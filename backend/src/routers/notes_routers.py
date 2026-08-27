from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from database import get_db
from schemas.note import NoteCreate, NoteOut, NoteUpdate
from repositories.note_repository import (
    create,
    get_all,
    get_by_id,
    soft_delete,
    update,
    summarize
)

router = APIRouter(
    prefix="/notes",
    tags=["notes"]
)


@router.get("", response_model=list[NoteOut])
def read_notes(db: Session = Depends(get_db)):
    notes = get_all(db)
    return notes


@router.get("/{note_id}", response_model=NoteOut)
def read_note(note_id: int, db: Session = Depends(get_db)):
    note = get_by_id(db, note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.post("", response_model=NoteOut)
def create_note(note: NoteCreate, db: Session = Depends(get_db)):
    new_note = create(db, note.model_dump())
    return new_note


@router.put("/{note_id}", response_model=NoteOut)
def update_note(note_id: int, note: NoteUpdate, db: Session = Depends(get_db)):
    updated_note = update(db, note_id, note.model_dump(exclude_unset=True))
    if not updated_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return updated_note

@router.get("/{note_id}/summarize", response_model=NoteOut)
def summarize_note(note_id: int, db: Session = Depends(get_db)):
    try:
        summarized_note = summarize(db, note_id)
    except ConnectionError:
        raise HTTPException(status_code=503, detail="Service unavailable. Please try again later.")

    if isinstance(summarized_note, ValueError):
        raise HTTPException(status_code=400, detail=str("No content to summarize. The note is empty."))
    
    if not summarized_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return summarized_note


@router.delete("/{note_id}", response_model=str)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    deleted_note = soft_delete(db, note_id)
    if not deleted_note:
        raise HTTPException(status_code=404, detail="Note not found")
    return "Note deleted successfully"