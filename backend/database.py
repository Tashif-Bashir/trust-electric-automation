from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from config import settings

# Render provides postgres:// or postgresql:// — asyncpg requires postgresql+asyncpg://
_db_url = settings.database_url.replace("postgres://", "postgresql+asyncpg://", 1).replace(
    "postgresql://", "postgresql+asyncpg://", 1
)

engine = create_async_engine(
    _db_url,
    echo=settings.environment == "development",
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
