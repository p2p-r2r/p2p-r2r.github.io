import { useApp } from '@/context/AppContext';
import { Manuscript, Reviewer, Comment, Response, Reference } from '@/types';
import { useToast } from '@/hooks/use-toast';

export function useEntityActions() {
  const { state, dispatch } = useApp();
  const { toast } = useToast();

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addManuscript = (title: string) => {
    const manuscript: Manuscript = {
      id: generateId(),
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_MANUSCRIPT', payload: manuscript });
    toast({ title: 'Manuscript added successfully' });
    return manuscript;
  };

  const updateManuscript = (id: string, title: string) => {
    const manuscript = state.manuscripts.find(m => m.id === id);
    if (manuscript) {
      const updated = { ...manuscript, title, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_MANUSCRIPT', payload: updated });
      toast({ title: 'Manuscript updated successfully' });
    }
  };

  const deleteManuscript = (id: string) => {
    dispatch({ type: 'DELETE_MANUSCRIPT', payload: id });
    toast({ title: 'Manuscript deleted successfully' });
  };

  const addReviewer = (name: string, manuscriptId: string) => {
    const reviewer: Reviewer = {
      id: generateId(),
      name,
      manuscriptId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_REVIEWER', payload: reviewer });
    toast({ title: 'Reviewer added successfully' });
    return reviewer;
  };

  const updateReviewer = (id: string, name: string) => {
    const reviewer = state.reviewers.find(r => r.id === id);
    if (reviewer) {
      const updated = { ...reviewer, name, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_REVIEWER', payload: updated });
      toast({ title: 'Reviewer updated successfully' });
    }
  };

  const deleteReviewer = (id: string) => {
    dispatch({ type: 'DELETE_REVIEWER', payload: id });
    toast({ title: 'Reviewer deleted successfully' });
  };

  const addComment = (text: string, reviewerId: string, manuscriptId: string) => {
    const comment: Comment = {
      id: generateId(),
      text,
      reviewerId,
      manuscriptId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch({ type: 'ADD_COMMENT', payload: comment });
    toast({ title: 'Comment added successfully' });
    return comment;
  };

  const updateComment = (id: string, text: string) => {
    const comment = state.comments.find(c => c.id === id);
    if (comment) {
      const updated = { ...comment, text, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_COMMENT', payload: updated });
      toast({ title: 'Comment updated successfully' });
    }
  };

  const deleteComment = (id: string) => {
    dispatch({ type: 'DELETE_COMMENT', payload: id });
    toast({ title: 'Comment deleted successfully' });
  };

  const saveResponse = (text: string, commentId: string, reviewerId: string, manuscriptId: string) => {
    const existingResponse = state.responses.find(r => r.commentId === commentId);
    
    if (existingResponse) {
      const updated = { ...existingResponse, text, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_RESPONSE', payload: updated });
    } else {
      const response: Response = {
        id: generateId(),
        text,
        commentId,
        reviewerId,
        manuscriptId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: 'ADD_RESPONSE', payload: response });
    }
    toast({ title: 'Response saved successfully' });
  };

  const saveReference = (text: string, commentId: string, reviewerId: string, manuscriptId: string) => {
    const existingReference = state.references.find(r => r.commentId === commentId);
    
    if (existingReference) {
      const updated = { ...existingReference, text, updatedAt: new Date() };
      dispatch({ type: 'UPDATE_REFERENCE', payload: updated });
    } else {
      const reference: Reference = {
        id: generateId(),
        text,
        commentId,
        reviewerId,
        manuscriptId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      dispatch({ type: 'ADD_REFERENCE', payload: reference });
    }
    toast({ title: 'Reference saved successfully' });
  };

  const selectManuscript = (id: string | null) => {
    dispatch({ type: 'SELECT_MANUSCRIPT', payload: id });
  };

  const selectReviewer = (id: string | null) => {
    dispatch({ type: 'SELECT_REVIEWER', payload: id });
  };

  const selectComment = (id: string | null) => {
    dispatch({ type: 'SELECT_COMMENT', payload: id });
  };

  return {
    addManuscript,
    updateManuscript,
    deleteManuscript,
    addReviewer,
    updateReviewer,
    deleteReviewer,
    addComment,
    updateComment,
    deleteComment,
    saveResponse,
    saveReference,
    selectManuscript,
    selectReviewer,
    selectComment,
  };
}