from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    display_name = Column(String)
    role = Column(String)  # "hombre" o "mujer"
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)


class BlogEntry(Base):
    __tablename__ = "blog_entries"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    date = Column(DateTime, default=datetime.utcnow)
    paragraph_hombre = Column(Text, nullable=True)
    paragraph_mujer = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship("Image", back_populates="entry", cascade="all, delete-orphan")


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    entry_id = Column(Integer, ForeignKey("blog_entries.id"))
    filename = Column(String)
    caption = Column(String, nullable=True)
    is_featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)

    entry = relationship("BlogEntry", back_populates="images")
