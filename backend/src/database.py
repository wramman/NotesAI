from sqlalchemy.orm import sessionmaker
from sqlmodel import Session, create_engine

from config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(class_=Session, autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
