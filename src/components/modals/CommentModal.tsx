import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  initialText?: string;
  mode: 'add' | 'edit';
}

export function CommentModal({
  isOpen,
  onClose,
  onSave,
  initialText = '',
  mode,
}: CommentModalProps) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText, isOpen]);

  const handleSave = () => {
    if (text.trim()) {
      onSave(text.trim());
      setText('');
      onClose();
    }
  };

  const handleCancel = () => {
    setText(initialText);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Comment' : 'Edit Comment'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment-text">Comment Text</Label>
            <Textarea
              id="comment-text"
              placeholder="Enter comment text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[150px] resize-none"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!text.trim()}>
            {mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}