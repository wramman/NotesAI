export interface Note {
  id: number;
  title: string;
  content: string;
  color: string | null;
  is_pinned: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  summary: string | null;
}

export interface NoteCreate {
  title: string;
  content: string;
  color?: string | null;
  is_pinned?: boolean;
}

export interface NoteUpdate {
  title?: string;
  content?: string;
  color?: string | null;
  is_pinned?: boolean;
}
