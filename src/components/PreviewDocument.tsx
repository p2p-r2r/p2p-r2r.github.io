import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/context/AppContext';

interface PreviewDocumentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewDocument({ isOpen, onClose }: PreviewDocumentProps) {
  const { state } = useApp();

  const generatePreviewData = () => {
    return state.manuscripts.map(manuscript => {
      const manuscriptReviewers = state.reviewers.filter(r => r.manuscriptId === manuscript.id);
      
      return {
        ...manuscript,
        reviewers: manuscriptReviewers.map(reviewer => {
          const reviewerComments = state.comments.filter(c => c.reviewerId === reviewer.id);
          
          return {
            ...reviewer,
            comments: reviewerComments.map(comment => {
              const response = state.responses.find(r => r.commentId === comment.id);
              const reference = state.references.find(r => r.commentId === comment.id);
              
              return {
                ...comment,
                response: response?.text || '',
                reference: reference?.text || '',
              };
            }),
          };
        }),
      };
    });
  };

  const previewData = generatePreviewData();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Document Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-8 p-4">
          {previewData.map(manuscript => (
            <div key={manuscript.id} className="space-y-6">
              <h1 className="text-2xl font-bold border-b pb-2">{manuscript.title}</h1>
              
              {manuscript.reviewers.map(reviewer => (
                <div key={reviewer.id} className="ml-4 space-y-4">
                  <h2 className="text-xl font-semibold text-primary">{reviewer.name}</h2>
                  
                  {reviewer.comments.map((comment, index) => (
                    <div key={comment.id} className="ml-4 space-y-3">
                      {/* Comment section with background highlight */}
                      <div className="bg-[hsl(var(--comment-bg))] border border-[hsl(var(--comment-border))] rounded-lg p-4 shadow-sm">
                        <div className="border-l-4 border-primary pl-3">
                          <h3 className="font-medium text-sm text-muted-foreground">
                            Comment {index + 1}
                          </h3>
                          <p className="text-sm mt-1 whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                      
                      {/* Response section with different background */}
                      {comment.response && (
                        <div className="bg-[hsl(var(--response-bg))] border border-[hsl(var(--response-border))] rounded-lg p-4 shadow-sm ml-4">
                          <h4 className="font-medium text-sm text-muted-foreground">Response</h4>
                          <p className="text-sm mt-1 whitespace-pre-wrap">{comment.response}</p>
                        </div>
                      )}
                      
                      {/* Reference section with subtle background */}
                      {comment.reference && (
                        <div className="bg-muted/30 border border-muted rounded-lg p-4 shadow-sm ml-4">
                          <h4 className="font-medium text-sm text-muted-foreground">Reference</h4>
                          <p className="text-sm mt-1 whitespace-pre-wrap">{comment.reference}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}