import { useState } from 'react';
import { FileText, UserCheck, Plus, Edit, Trash2, Trash, Download, Upload } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { useEntityActions } from '@/hooks/useEntityActions';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ManuscriptModal } from './modals/ManuscriptModal';
import { ReviewerModal } from './modals/ReviewerModal';

export function AppSidebar() {
  const { state } = useApp();
  const { state: sidebarState } = useSidebar();
  const collapsed = sidebarState === 'collapsed';
  const { clearAllData, exportAllData, importAllData, handleFileImport, fileInputRef } = useLocalStorage();
  const {
    addManuscript,
    updateManuscript,
    deleteManuscript,
    addReviewer,
    updateReviewer,
    deleteReviewer,
    selectManuscript,
    selectReviewer,
  } = useEntityActions();

  const [manuscriptModal, setManuscriptModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    manuscriptId?: string;
    initialTitle?: string;
  }>({ isOpen: false, mode: 'add' });

  const [reviewerModal, setReviewerModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    reviewerId?: string;
    manuscriptId?: string;
    initialName?: string;
  }>({ isOpen: false, mode: 'add' });

  // Helper function to get manuscript statistics
  const getManuscriptStats = (manuscriptId: string) => {
    const manuscriptReviewers = state.reviewers.filter(r => r.manuscriptId === manuscriptId);
    const manuscriptComments = state.comments.filter(c => c.manuscriptId === manuscriptId);
    
    return {
      totalReviewers: manuscriptReviewers.length,
      totalComments: manuscriptComments.length
    };
  };

  // Helper function to get reviewer statistics
  const getReviewerStats = (reviewerId: string) => {
    const reviewerComments = state.comments.filter(c => c.reviewerId === reviewerId);
    let pendingCount = 0;
    
    reviewerComments.forEach(comment => {
      const response = state.responses.find(r => r.commentId === comment.id);
      const reference = state.references.find(r => r.commentId === comment.id);
      
      const hasResponse = response && response.text.trim().length > 0;
      const hasReference = reference && reference.text.trim().length > 0;
      
      if (!hasResponse || !hasReference) {
        pendingCount++;
      }
    });
    
    return {
      totalComments: reviewerComments.length,
      pendingCount
    };
  };

  const handleManuscriptSave = (title: string) => {
    if (manuscriptModal.mode === 'add') {
      const manuscript = addManuscript(title);
      selectManuscript(manuscript.id);
    } else if (manuscriptModal.manuscriptId) {
      updateManuscript(manuscriptModal.manuscriptId, title);
    }
  };

  const handleReviewerSave = (name: string) => {
    if (reviewerModal.mode === 'add' && reviewerModal.manuscriptId) {
      const reviewer = addReviewer(name, reviewerModal.manuscriptId);
      selectReviewer(reviewer.id);
    } else if (reviewerModal.reviewerId) {
      updateReviewer(reviewerModal.reviewerId, name);
    }
  };

  const openEditManuscript = (manuscriptId: string, title: string) => {
    setManuscriptModal({
      isOpen: true,
      mode: 'edit',
      manuscriptId,
      initialTitle: title,
    });
  };

  const openEditReviewer = (reviewerId: string, name: string) => {
    setReviewerModal({
      isOpen: true,
      mode: 'edit',
      reviewerId,
      initialName: name,
    });
  };

  const openAddReviewer = (manuscriptId: string) => {
    setReviewerModal({
      isOpen: true,
      mode: 'add',
      manuscriptId,
    });
  };

  return (
    <>
      <Sidebar className="border-r modern-shadow">
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between">
              <SidebarGroupLabel>Manuscripts</SidebarGroupLabel>
              {!collapsed && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setManuscriptModal({ isOpen: true, mode: 'add' })}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {state.manuscripts.map((manuscript) => {
                  const manuscriptReviewers = state.reviewers.filter(
                    (r) => r.manuscriptId === manuscript.id
                  );
                  const manuscriptStats = getManuscriptStats(manuscript.id);
                  
                  return (
                    <div key={manuscript.id} className="space-y-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={state.selectedManuscriptId === manuscript.id}
                          onClick={() => selectManuscript(manuscript.id)}
                          className="group"
                        >
                          <FileText className="h-4 w-4" />
                          {!collapsed && (
                            <div className="flex flex-col items-start min-w-0">
                              <span className="truncate">{manuscript.title}</span>
                              <span className="text-xs text-muted-foreground">
                                {manuscriptStats.totalReviewers} Reviewers, {manuscriptStats.totalComments} Comments
                              </span>
                            </div>
                          )}
                        </SidebarMenuButton>
                        {!collapsed && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <SidebarMenuAction
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditManuscript(manuscript.id, manuscript.title);
                              }}
                              className="mr-8"
                            >
                              <Edit className="h-3 w-3" />
                            </SidebarMenuAction>
                            <SidebarMenuAction
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteManuscript(manuscript.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </SidebarMenuAction>
                          </div>
                        )}
                      </SidebarMenuItem>

                      {/* Reviewers for this manuscript */}
                      {state.selectedManuscriptId === manuscript.id && !collapsed && (
                        <div className="ml-6 space-y-1">
                          <div className="flex items-center justify-between px-2">
                            <span className="text-xs text-muted-foreground">
                              Reviewers
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openAddReviewer(manuscript.id)}
                              className="h-5 w-5 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          {manuscriptReviewers.map((reviewer) => {
                            const reviewerStats = getReviewerStats(reviewer.id);
                            
                            return (
                              <SidebarMenuItem key={reviewer.id}>
                                <SidebarMenuButton
                                  isActive={state.selectedReviewerId === reviewer.id}
                                  onClick={() => selectReviewer(reviewer.id)}
                                  size="sm"
                                  className="group"
                                >
                                  <UserCheck className="h-3 w-3" />
                                  <div className="flex flex-col items-start min-w-0">
                                    <span className="truncate">{reviewer.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {reviewerStats.totalComments} Comments,{' '}
                                      <span className="text-orange-500">
                                        {reviewerStats.pendingCount} Pending
                                      </span>
                                    </span>
                                  </div>
                                </SidebarMenuButton>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <SidebarMenuAction
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openEditReviewer(reviewer.id, reviewer.name);
                                    }}
                                    className="mr-8"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </SidebarMenuAction>
                                  <SidebarMenuAction
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      deleteReviewer(reviewer.id);
                                    }}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </SidebarMenuAction>
                                </div>
                              </SidebarMenuItem>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Data Management Section */}
          {state.manuscripts.length > 0 && (
            <SidebarGroup className="mt-auto">
              <SidebarGroupLabel className="text-xs text-muted-foreground">
                Data Management
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportAllData}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {!collapsed && "Export Data"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={importAllData}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {!collapsed && "Import Data"}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                      clearAllData();
                    }
                  }}
                  className="w-full"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {!collapsed && "Clear All Data"}
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
      </Sidebar>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileImport}
        style={{ display: 'none' }}
      />

      <ManuscriptModal
        isOpen={manuscriptModal.isOpen}
        onClose={() => setManuscriptModal({ isOpen: false, mode: 'add' })}
        onSave={handleManuscriptSave}
        initialTitle={manuscriptModal.initialTitle}
        mode={manuscriptModal.mode}
      />

      <ReviewerModal
        isOpen={reviewerModal.isOpen}
        onClose={() => setReviewerModal({ isOpen: false, mode: 'add' })}
        onSave={handleReviewerSave}
        initialName={reviewerModal.initialName}
        mode={reviewerModal.mode}
      />
    </>
  );
}