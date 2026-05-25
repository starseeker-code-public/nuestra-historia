from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/api/entries", tags=["entries"])


@router.get("/", response_model=List[schemas.BlogEntry])
async def list_entries(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.get_blog_entries(db, skip=skip, limit=limit)


@router.get("/{entry_id}", response_model=schemas.BlogEntry)
async def get_entry(entry_id: int, db: Session = Depends(get_db)):
    entry = crud.get_blog_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return entry


@router.post("/", response_model=schemas.BlogEntry)
async def create_entry(
    entry: schemas.BlogEntryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return crud.create_blog_entry(db, entry)


@router.put("/{entry_id}", response_model=schemas.BlogEntry)
async def update_entry(
    entry_id: int,
    entry_update: schemas.BlogEntryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    entry = crud.update_blog_entry(db, entry_id, entry_update)
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return entry


@router.delete("/{entry_id}")
async def delete_entry(
    entry_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    success = crud.delete_blog_entry(db, entry_id)
    if not success:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return {"message": "Entrada eliminada"}
