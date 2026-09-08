from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session
from app.core.config import settings

# Adjust connect_args for SQLite to support multi-threaded access in development
engine_kwargs = {}
if settings.DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass

def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency yield pattern.
    Ensures clean creation and teardown per request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
