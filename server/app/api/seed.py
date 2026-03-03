"""Seed endpoint — triggers database seeding with DSA topics and problems."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.services.seed_service import seed_all

router = APIRouter(prefix="/seed", tags=["seed"])


@router.post("")
async def run_seed(db: AsyncSession = Depends(get_db)) -> dict:
    """Populate the database with initial topics and starter problems."""
    await seed_all(db)
    return {"message": "Database seeded successfully"}
