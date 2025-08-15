import { useCallback, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { clearLocalStorage, exportData, importData } from '@/lib/storage';

export function useLocalStorage() {
  const { state, dispatch } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearAllData = useCallback(() => {
    clearLocalStorage();
    // Reset the app state to initial values
    dispatch({ type: 'SET_MANUSCRIPTS', payload: [] });
    dispatch({ type: 'SET_REVIEWERS', payload: [] });
    dispatch({ type: 'SET_COMMENTS', payload: [] });
    dispatch({ type: 'SET_RESPONSES', payload: [] });
    dispatch({ type: 'SET_REFERENCES', payload: [] });
    dispatch({ type: 'SELECT_MANUSCRIPT', payload: null });
    dispatch({ type: 'SELECT_REVIEWER', payload: null });
    dispatch({ type: 'SELECT_COMMENT', payload: null });
  }, [dispatch]);

  const exportAllData = useCallback(() => {
    exportData(state);
  }, [state]);

  const importAllData = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedState = await importData(file);
        // Replace current state with imported state
        dispatch({ type: 'SET_MANUSCRIPTS', payload: importedState.manuscripts });
        dispatch({ type: 'SET_REVIEWERS', payload: importedState.reviewers });
        dispatch({ type: 'SET_COMMENTS', payload: importedState.comments });
        dispatch({ type: 'SET_RESPONSES', payload: importedState.responses });
        dispatch({ type: 'SET_REFERENCES', payload: importedState.references });
        dispatch({ type: 'SELECT_MANUSCRIPT', payload: importedState.selectedManuscriptId });
        dispatch({ type: 'SELECT_REVIEWER', payload: importedState.selectedReviewerId });
        dispatch({ type: 'SELECT_COMMENT', payload: importedState.selectedCommentId });
      } catch (error) {
        console.error('Import failed:', error);
      }
    }
    // Reset the file input
    if (event.target) {
      event.target.value = '';
    }
  }, [dispatch]);

  return {
    clearAllData,
    exportAllData,
    importAllData,
    handleFileImport,
    fileInputRef,
  };
} 