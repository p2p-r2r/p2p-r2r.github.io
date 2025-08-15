import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppState, AppContextType, AppAction } from '@/types';
import { saveToLocalStorage, loadFromLocalStorage, isLocalStorageAvailable } from '@/lib/storage';
import { toast } from 'sonner';

const initialState: AppState = {
  manuscripts: [],
  reviewers: [],
  comments: [],
  responses: [],
  references: [],
  selectedManuscriptId: null,
  selectedReviewerId: null,
  selectedCommentId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_MANUSCRIPTS':
      return { ...state, manuscripts: action.payload };
    case 'ADD_MANUSCRIPT':
      return { ...state, manuscripts: [...state.manuscripts, action.payload] };
    case 'UPDATE_MANUSCRIPT':
      return {
        ...state,
        manuscripts: state.manuscripts.map(m =>
          m.id === action.payload.id ? action.payload : m
        ),
      };
    case 'DELETE_MANUSCRIPT':
      return {
        ...state,
        manuscripts: state.manuscripts.filter(m => m.id !== action.payload),
        reviewers: state.reviewers.filter(r => r.manuscriptId !== action.payload),
        comments: state.comments.filter(c => c.manuscriptId !== action.payload),
        responses: state.responses.filter(r => r.manuscriptId !== action.payload),
        references: state.references.filter(r => r.manuscriptId !== action.payload),
        selectedManuscriptId: state.selectedManuscriptId === action.payload ? null : state.selectedManuscriptId,
      };
    case 'SET_REVIEWERS':
      return { ...state, reviewers: action.payload };
    case 'ADD_REVIEWER':
      return { ...state, reviewers: [...state.reviewers, action.payload] };
    case 'UPDATE_REVIEWER':
      return {
        ...state,
        reviewers: state.reviewers.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case 'DELETE_REVIEWER':
      return {
        ...state,
        reviewers: state.reviewers.filter(r => r.id !== action.payload),
        comments: state.comments.filter(c => c.reviewerId !== action.payload),
        responses: state.responses.filter(r => r.reviewerId !== action.payload),
        references: state.references.filter(r => r.reviewerId !== action.payload),
        selectedReviewerId: state.selectedReviewerId === action.payload ? null : state.selectedReviewerId,
      };
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload };
    case 'ADD_COMMENT':
      return { ...state, comments: [...state.comments, action.payload] };
    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: state.comments.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: state.comments.filter(c => c.id !== action.payload),
        responses: state.responses.filter(r => r.commentId !== action.payload),
        references: state.references.filter(r => r.commentId !== action.payload),
        selectedCommentId: state.selectedCommentId === action.payload ? null : state.selectedCommentId,
      };
    case 'SET_RESPONSES':
      return { ...state, responses: action.payload };
    case 'ADD_RESPONSE':
      return { ...state, responses: [...state.responses, action.payload] };
    case 'UPDATE_RESPONSE':
      return {
        ...state,
        responses: state.responses.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case 'DELETE_RESPONSE':
      return {
        ...state,
        responses: state.responses.filter(r => r.id !== action.payload),
      };
    case 'SET_REFERENCES':
      return { ...state, references: action.payload };
    case 'ADD_REFERENCE':
      return { ...state, references: [...state.references, action.payload] };
    case 'UPDATE_REFERENCE':
      return {
        ...state,
        references: state.references.map(r =>
          r.id === action.payload.id ? action.payload : r
        ),
      };
    case 'DELETE_REFERENCE':
      return {
        ...state,
        references: state.references.filter(r => r.id !== action.payload),
      };
    case 'SELECT_MANUSCRIPT':
      return {
        ...state,
        selectedManuscriptId: action.payload,
        selectedReviewerId: null,
        selectedCommentId: null,
      };
    case 'SELECT_REVIEWER':
      return {
        ...state,
        selectedReviewerId: action.payload,
        selectedCommentId: null,
      };
    case 'SELECT_COMMENT':
      return { ...state, selectedCommentId: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Check if localStorage is available
  const storageAvailable = isLocalStorageAvailable();
  
  // Load initial state from localStorage if available
  const savedState = storageAvailable ? loadFromLocalStorage() : null;
  const [state, dispatch] = useReducer(appReducer, savedState || initialState);

  // Save state to localStorage whenever it changes (if available)
  useEffect(() => {
    if (storageAvailable) {
      saveToLocalStorage(state);
    }
  }, [state, storageAvailable]);

  // Show warning if localStorage is not available
  useEffect(() => {
    if (!storageAvailable) {
      toast.warning('Local storage is not available. Your data will not be saved between sessions.');
    }
  }, [storageAvailable]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}