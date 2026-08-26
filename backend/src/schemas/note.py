from pydantic import BaseModel
from datetime import datetime

class NoteBase(BaseModel):
    title: str
    content: str
    color: str | None = None

class NoteCreate(NoteBase):
    is_pinned: bool = False

class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    color: str | None = None
    is_pinned: bool | None = None
    is_deleted: bool | None = None

class NoteOut(NoteBase):
    id : int
    is_pinned: bool = False
    is_deleted: bool = False
    created_at: datetime
    updated_at: datetime
    summary: str | None = None