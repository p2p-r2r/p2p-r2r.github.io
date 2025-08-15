import { useState, useEffect } from 'react';
import { Eye, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppProvider, useApp } from '@/context/AppContext';
import { AppSidebar } from '@/components/AppSidebar';
import { CommentsList } from '@/components/CommentsList';
import { ResponseEditor } from '@/components/ResponseEditor';
import { PreviewDocument } from '@/components/PreviewDocument';

function MainContent() {
  const { state } = useApp();
  const [showPreview, setShowPreview] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  const hasPreviewableContent = state.manuscripts.some(m => {
    const hasReviewers = state.reviewers.some(r => r.manuscriptId === m.id);
    const hasComments = state.comments.some(c => c.manuscriptId === m.id);
    return hasReviewers && hasComments;
  });

  // Show saved indicator whenever state changes
  useEffect(() => {
    setShowSavedIndicator(true);
    const timer = setTimeout(() => setShowSavedIndicator(false), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">
                {state.selectedManuscriptId 
                  ? state.manuscripts.find(m => m.id === state.selectedManuscriptId)?.title || 'Manuscript Reviewer Response'
                  : 'Manuscript Reviewer Response'
                }
              </h1>
              {showSavedIndicator && (
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Saved</span>
                </div>
              )}
            </div>
            {hasPreviewableContent && (
              <Button onClick={() => setShowPreview(true)} variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Document
              </Button>
            )}
          </div>
        </header>
        
        <div className="flex-1 flex overflow-hidden">
          <CommentsList />
          <div className="w-px bg-border" />
          <ResponseEditor />
        </div>
      </div>
      
      <PreviewDocument isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </div>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <SidebarProvider>
        <MainContent />
      </SidebarProvider>
    </AppProvider>
  );
};

export default Index;
