import os
from sqlalchemy.orm import Session
from . import models
from .auth import get_password_hash


def seed_users(db: Session):
    users = [
        {
            "username": os.getenv("USER1_USERNAME", "el_hombre"),
            "display_name": os.getenv("USER1_DISPLAY_NAME", "Él"),
            "role": "hombre",
            "password": os.getenv("USER1_PASSWORD", "changeme1"),
        },
        {
            "username": os.getenv("USER2_USERNAME", "la_mujer"),
            "display_name": os.getenv("USER2_DISPLAY_NAME", "Ella"),
            "role": "mujer",
            "password": os.getenv("USER2_PASSWORD", "changeme2"),
        },
    ]

    for data in users:
        password = data.pop("password")
        existing = db.query(models.User).filter(models.User.username == data["username"]).first()
        if existing:
            existing.display_name = data["display_name"]
            existing.hashed_password = get_password_hash(password)
        else:
            db.add(models.User(**data, hashed_password=get_password_hash(password)))

    db.commit()
