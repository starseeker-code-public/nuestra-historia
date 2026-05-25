from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import schemas, models
from ..database import get_db

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/", response_model=List[schemas.UserPublic])
async def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.is_active == True).all()
