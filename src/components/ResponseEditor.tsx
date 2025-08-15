import { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { useEntityActions } from '@/hooks/useEntityActions';

export function ResponseEditor() {
  const { state } = useApp();
  const { saveResponse, saveReference } = useEntityActions();
  
  const [responseText, setResponseText] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  const selectedComment = state.comments.find(c => c.id === state.selectedCommentId);
  const currentResponse = state.responses.find(r => r.commentId === state.selectedCommentId);
  const currentReference = state.references.find(r => r.commentId === state.selectedCommentId);

  useEffect(() => {
    if (selectedComment) {
      setResponseText(currentResponse?.text || '');
      setReferenceText(currentReference?.text || '');
      setHasChanges(false);
    }
  }, [selectedComment, currentResponse, currentReference]);

  const handleResponseChange = (value: string) => {
    setResponseText(value);
    setHasChanges(true);
  };

  const handleReferenceChange = (value: string) => {
    setReferenceText(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    if (!selectedComment) return;

    if (responseText.trim()) {
      saveResponse(responseText.trim(), selectedComment.id, selectedComment.reviewerId, selectedComment.manuscriptId);
    }
    
    if (referenceText.trim()) {
      saveReference(referenceText.trim(), selectedComment.id, selectedComment.reviewerId, selectedComment.manuscriptId);
    }

    setHasChanges(false);
  };

  if (!selectedComment) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a comment to respond</p>
          <p className="text-sm">Choose a comment from the list to add your response and references</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header with title and save button */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Response & Reference</h2>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges || (!responseText.trim() && !referenceText.trim())}
          className="min-w-[100px]"
        >
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Content area with text areas */}
      <div className="flex-1 flex flex-col p-4 space-y-4 overflow-hidden">
        <div className="flex-1 flex flex-col space-y-2">
          <Label htmlFor="response">Response</Label>
          <Textarea
            id="response"
            placeholder="Enter your response to this comment..."
            value={responseText}
            onChange={(e) => handleResponseChange(e.target.value)}
            className="flex-1 resize-none"
          />
        </div>

        <div className="flex-1 flex flex-col space-y-2">
          <Label htmlFor="reference">Reference</Label>
          <Textarea
            id="reference"
            placeholder="Add any references or citations..."
            value={referenceText}
            onChange={(e) => handleReferenceChange(e.target.value)}
            className="flex-1 resize-none"
          />
        </div>
      </div>
    </div>
  );
}