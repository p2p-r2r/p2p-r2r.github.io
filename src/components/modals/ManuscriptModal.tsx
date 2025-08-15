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

interface ManuscriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  initialTitle?: string;
  mode: 'add' | 'edit';
}

export function ManuscriptModal({
  isOpen,
  onClose,
  onSave,
  initialTitle = '',
  mode,
}: ManuscriptModalProps) {
  const [title, setTitle] = useState(initialTitle);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle, isOpen]);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim());
      setTitle('');
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle(initialTitle);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Manuscript' : 'Edit Manuscript'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="manuscript-title">Manuscript Title</Label>
            <Textarea
              id="manuscript-title"
              placeholder="Enter manuscript title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-[100px] resize-none"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}