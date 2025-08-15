import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useEntityActions } from '@/hooks/useEntityActions';
import { toDate } from '@/lib/utils';
import { CommentModal } from './modals/CommentModal';

export function CommentsList() {
  const { state } = useApp();
  const { addComment, updateComment, deleteComment, selectComment } = useEntityActions();
  const commentsContainerRef = useRef<HTMLDivElement>(null);
  const selectedCommentRef = useRef<HTMLDivElement>(null);
  
  const [commentModal, setCommentModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    commentId?: string;
    initialText?: string;
  }>({ isOpen: false, mode: 'add' });

  const selectedManuscript = state.manuscripts.find(m => m.id === state.selectedManuscriptId);
  const selectedReviewer = state.reviewers.find(r => r.id === state.selectedReviewerId);
  const comments = state.comments.filter(c => 
    c.reviewerId === state.selectedReviewerId && 
    c.manuscriptId === state.selectedManuscriptId
  );

  // Scroll selected comment to top when selection changes
  useEffect(() => {
    if (selectedCommentRef.current && commentsContainerRef.current) {
      selectedCommentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }, [state.selectedCommentId]);

  // Debug logging
  console.log('CommentsList Debug:', {
    selectedManuscriptId: state.selectedManuscriptId,
    selectedReviewerId: state.selectedReviewerId,
    selectedManuscript: selectedManuscript?.title,
    selectedReviewer: selectedReviewer?.name,
    allComments: state.comments,
    filteredComments: comments,
    commentsCount: comments.length
  });

  const handleCommentSave = (text: string) => {
    if (commentModal.mode === 'add' && state.selectedReviewerId && state.selectedManuscriptId) {
      const comment = addComment(text, state.selectedReviewerId, state.selectedManuscriptId);
      selectComment(comment.id);
    } else if (commentModal.commentId) {
      updateComment(commentModal.commentId, text);
    }
  };

  const openEditComment = (commentId: string, text: string) => {
    setCommentModal({
      isOpen: true,
      mode: 'edit',
      commentId,
      initialText: text,
    });
  };

  // Helper function to get response and reference for a comment
  const getCommentStatus = (commentId: string) => {
    const response = state.responses.find(r => r.commentId === commentId);
    const reference = state.references.find(r => r.commentId === commentId);
    
    return {
      hasResponse: response && response.text.trim().length > 0,
      hasReference: reference && reference.text.trim().length > 0
    };
  };

  // Helper function to truncate text to one line
  const truncateText = (text: string, isSelected: boolean) => {
    if (isSelected) return text;
    return text.length > 100 ? text.substring(0, 100) + '...' : text;
  };

  if (!selectedManuscript) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a manuscript to view comments</p>
          <p className="text-sm">Choose a manuscript from the sidebar to get started</p>
        </div>
      </div>
    );
  }

  if (!selectedReviewer) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a reviewer to view comments</p>
          <p className="text-sm">Choose a reviewer for "{selectedManuscript.title}"</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Comments</h2>
              <p className="text-sm text-muted-foreground">
                {selectedReviewer.name}
              </p>
            </div>
            <Button 
              onClick={() => setCommentModal({ isOpen: true, mode: 'add' })}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>

        {/* Comments List */}
        <div ref={commentsContainerRef} className="flex-1 overflow-auto p-4 space-y-3">
          {comments.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>No comments yet</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCommentModal({ isOpen: true, mode: 'add' })}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Comment
                </Button>
              </div>
            </div>
          ) : (
            comments.map((comment) => {
              const isSelected = state.selectedCommentId === comment.id;
              const { hasResponse, hasReference } = getCommentStatus(comment.id);
              
              return (
                <Card 
                  key={comment.id}
                  ref={isSelected ? selectedCommentRef : null}
                  className={`comment-card group ${
                    isSelected ? 'selected' : ''
                  }`}
                  onClick={() => selectComment(comment.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm break-words ${
                          isSelected ? 'whitespace-pre-wrap' : 'truncate'
                        }`}>
                          {truncateText(comment.text, isSelected)}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span>Response:</span>
                            {hasResponse ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <span className="text-orange-500">Pending</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Reference:</span>
                            {hasReference ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <span className="text-orange-500">Pending</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditComment(comment.id, comment.text);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteComment(comment.id);
                          }}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <CommentModal
        isOpen={commentModal.isOpen}
        onClose={() => setCommentModal({ isOpen: false, mode: 'add' })}
        onSave={handleCommentSave}
        initialText={commentModal.initialText}
        mode={commentModal.mode}
      />
    </>
  );
}