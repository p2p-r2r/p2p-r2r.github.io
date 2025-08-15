export interface Manuscript {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reviewer {
  id: string;
  name: string;
  manuscriptId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  text: string;
  reviewerId: string;
  manuscriptId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Response {
  id: string;
  text: string;
  commentId: string;
  reviewerId: string;
  manuscriptId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reference {
  id: string;
  text: string;
  commentId: string;
  reviewerId: string;
  manuscriptId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  manuscripts: Manuscript[];
  reviewers: Reviewer[];
  comments: Comment[];
  responses: Response[];
  references: Reference[];
  selectedManuscriptId: string | null;
  selectedReviewerId: string | null;
  selectedCommentId: string | null;
}

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

export type AppAction =
  | { type: 'SET_MANUSCRIPTS'; payload: Manuscript[] }
  | { type: 'ADD_MANUSCRIPT'; payload: Manuscript }
  | { type: 'UPDATE_MANUSCRIPT'; payload: Manuscript }
  | { type: 'DELETE_MANUSCRIPT'; payload: string }
  | { type: 'SET_REVIEWERS'; payload: Reviewer[] }
  | { type: 'ADD_REVIEWER'; payload: Reviewer }
  | { type: 'UPDATE_REVIEWER'; payload: Reviewer }
  | { type: 'DELETE_REVIEWER'; payload: string }
  | { type: 'SET_COMMENTS'; payload: Comment[] }
  | { type: 'ADD_COMMENT'; payload: Comment }
  | { type: 'UPDATE_COMMENT'; payload: Comment }
  | { type: 'DELETE_COMMENT'; payload: string }
  | { type: 'SET_RESPONSES'; payload: Response[] }
  | { type: 'ADD_RESPONSE'; payload: Response }
  | { type: 'UPDATE_RESPONSE'; payload: Response }
  | { type: 'DELETE_RESPONSE'; payload: string }
  | { type: 'SET_REFERENCES'; payload: Reference[] }
  | { type: 'ADD_REFERENCE'; payload: Reference }
  | { type: 'UPDATE_REFERENCE'; payload: Reference }
  | { type: 'DELETE_REFERENCE'; payload: string }
  | { type: 'SELECT_MANUSCRIPT'; payload: string | null }
  | { type: 'SELECT_REVIEWER'; payload: string | null }
  | { type: 'SELECT_COMMENT'; payload: string | null };