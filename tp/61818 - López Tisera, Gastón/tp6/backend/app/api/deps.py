from collections.abc import Generator

from sqlmodel import Session

from app.db.session import get_session


def get_db() -> Generator[Session, None, None]:
    """Expose a SQLModel session as a dependency."""
    yield from get_session()

