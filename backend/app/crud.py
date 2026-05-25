from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash
from datetime import datetime


def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(
        username=user.username,
        display_name=user.display_name,
        role=user.role,
        hashed_password=get_password_hash(user.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_blog_entries(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.BlogEntry)
        .order_by(models.BlogEntry.date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_blog_entry(db: Session, entry_id: int):
    return db.query(models.BlogEntry).filter(models.BlogEntry.id == entry_id).first()


def create_blog_entry(db: Session, entry: schemas.BlogEntryCreate):
    db_entry = models.BlogEntry(**entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def update_blog_entry(db: Session, entry_id: int, entry_update: schemas.BlogEntryUpdate):
    db_entry = db.query(models.BlogEntry).filter(models.BlogEntry.id == entry_id).first()
    if not db_entry:
        return None
    update_data = entry_update.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    for key, value in update_data.items():
        setattr(db_entry, key, value)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def delete_blog_entry(db: Session, entry_id: int):
    db_entry = db.query(models.BlogEntry).filter(models.BlogEntry.id == entry_id).first()
    if not db_entry:
        return False
    db.delete(db_entry)
    db.commit()
    return True


def create_image(db: Session, image: schemas.ImageCreate):
    if image.is_featured:
        db.query(models.Image).filter(
            models.Image.entry_id == image.entry_id,
            models.Image.is_featured == True,
        ).update({"is_featured": False})
    db_image = models.Image(**image.model_dump())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def delete_image(db: Session, image_id: int):
    db_image = db.query(models.Image).filter(models.Image.id == image_id).first()
    if not db_image:
        return None
    filename = db_image.filename
    db.delete(db_image)
    db.commit()
    return filename


def set_featured_image(db: Session, image_id: int, entry_id: int):
    db.query(models.Image).filter(models.Image.entry_id == entry_id).update({"is_featured": False})
    db.query(models.Image).filter(models.Image.id == image_id).update({"is_featured": True})
    db.commit()
