from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, crud
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/api/entries", tags=["entries"])


def _paragraph_field_for(role: str) -> str:
    return "paragraph_hombre" if role == "hombre" else "paragraph_mujer"


@router.get("/", response_model=List[schemas.BlogEntry])
async def list_entries(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return crud.get_blog_entries(db, skip=skip, limit=limit)


@router.get("/pending/me", response_model=List[schemas.BlogEntry])
async def list_pending(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return crud.get_pending_for_role(db, current_user.role)


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
    data = {
        "title": entry.title,
        "description": entry.description,
        "date": entry.date,
        "categories": entry.categories,
        "paragraph_hombre": None,
        "paragraph_mujer": None,
    }
    data[_paragraph_field_for(current_user.role)] = entry.my_paragraph
    return crud.create_blog_entry(db, data)


@router.put("/{entry_id}", response_model=schemas.BlogEntry)
async def update_entry(
    entry_id: int,
    entry_update: schemas.BlogEntryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    update_data = entry_update.model_dump(exclude_unset=True)
    if "my_paragraph" in update_data:
        my_para = update_data.pop("my_paragraph")
        update_data[_paragraph_field_for(current_user.role)] = my_para
    entry = crud.update_blog_entry(db, entry_id, update_data)
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
