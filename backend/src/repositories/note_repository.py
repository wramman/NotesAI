from datetime import datetime, timezone

from sqlmodel import Session, select, create_engine
from models.note import Note
from services.llm_service import resumir 


def _active_notes():
    return select(Note).where(Note.is_deleted == False)


def get_all(db: Session):
    return db.exec(_active_notes()).all()


def get_by_id(db: Session, note_id: int):
    return db.exec(_active_notes().where(Note.id == note_id)).first()


def create(db: Session, note_data: dict):
    new_note = Note(**note_data)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


def update(db: Session, note_id: int, note_data: dict):
    note = db.exec(_active_notes().where(Note.id == note_id)).first()
    if note:
        if note_data.get("title") is not None:
            setattr(note, "title", note_data["title"])
        if note_data.get("content") is not None:
            setattr(note, "content", note_data["content"])
        if note_data.get("color") is not None:
            setattr(note, "color", note_data["color"])
        if note_data.get("is_pinned") is not None:
            setattr(note, "is_pinned", note_data["is_pinned"])
        setattr(note, "updated_at", datetime.now(timezone.utc))
        db.commit()
        db.refresh(note)
    return note

def summarize(db: Session, note_id: int):
    note = get_by_id(db, note_id)
    print("Note:" , note)
    if not note:
        return None
    summary = note.content

    if not note.content.strip():
        return ValueError("The note content is empty. Cannot generate a summary.")
    
    try:
        note.summary = resumir(summary)
    except ConnectionError:
        raise ConnectionError("Ollama service is down. Please try again later.")
    
    db.commit()
    db.refresh(note)
    return note


def soft_delete(db: Session, note_id: int):
    note = db.exec(_active_notes().where(Note.id == note_id)).first()
    if note:
        note.is_deleted = True
        db.commit()
        db.refresh(note)
    return note
