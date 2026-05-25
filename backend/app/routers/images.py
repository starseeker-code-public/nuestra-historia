import os
import uuid
import aiofiles
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/api/images", tags=["images"])

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/app/uploads")


@router.post("/upload/{entry_id}", response_model=schemas.Image)
async def upload_image(
    entry_id: int,
    file: UploadFile = File(...),
    caption: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    order_index: int = Form(0),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(file.filename or "image.jpg")[1].lower() or ".jpg"
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    async with aiofiles.open(filepath, "wb") as f:
        content = await file.read()
        await f.write(content)

    image_data = schemas.ImageCreate(
        filename=filename,
        entry_id=entry_id,
        caption=caption,
        is_featured=is_featured,
        order_index=order_index,
    )
    return crud.create_image(db, image_data)


@router.get("/{filename}")
async def get_image(filename: str):
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    return FileResponse(filepath)


@router.delete("/{image_id}")
async def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    filename = crud.delete_image(db, image_id)
    if not filename:
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    filepath = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    return {"message": "Imagen eliminada"}


@router.put("/{image_id}/featured")
async def set_featured(
    image_id: int,
    entry_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    crud.set_featured_image(db, image_id, entry_id)
    return {"message": "Imagen destacada actualizada"}
