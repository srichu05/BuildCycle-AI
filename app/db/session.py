from typing import Generator, Optional
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

Base = declarative_base()

_engine = None
_SessionLocal = None


def get_engine():
    global _engine, _SessionLocal
    db_url = settings.normalized_database_url
    if not db_url:
        return None

    if _engine is None:
        # Neon PostgreSQL / Render pooling settings
        connect_args = {}
        # If postgresql and sslmode not in URL, Neon requires SSL
        if "postgresql" in db_url and "sslmode" not in db_url:
            connect_args["sslmode"] = "require"

        _engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            connect_args=connect_args,
        )
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine


def get_session_factory():
    global _SessionLocal
    if _SessionLocal is None:
        engine = get_engine()
        if engine is None:
            return None
    return _SessionLocal


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency to get a DB session."""
    factory = get_session_factory()
    if factory is None:
        raise RuntimeError("DATABASE_URL is not configured.")
    db = factory()
    try:
        yield db
    finally:
        db.close()


def check_db_ready() -> bool:
    """Lightweight readiness check for the database."""
    engine = get_engine()
    if engine is None:
        return False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
