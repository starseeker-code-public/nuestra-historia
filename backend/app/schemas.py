from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class UserBase(BaseModel):
    username: str
    display_name: str
    role: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool

    model_config = {"from_attributes": True}


class UserPublic(BaseModel):
    display_name: str
    role: str

    model_config = {"from_attributes": True}


class Token(BaseModel):
    access_token: str
    token_type: str
    user: User


class TokenData(BaseModel):
    username: Optional[str] = None


class ImageBase(BaseModel):
    caption: Optional[str] = None
    is_featured: bool = False
    order_index: int = 0


class ImageCreate(ImageBase):
    filename: str
    entry_id: int


class Image(ImageBase):
    id: int
    filename: str
    entry_id: int

    model_config = {"from_attributes": True}


class BlogEntryCreate(BaseModel):
    title: str
    description: str
    date: datetime
    my_paragraph: Optional[str] = None
    categories: Optional[str] = None


class BlogEntryUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    my_paragraph: Optional[str] = None
    categories: Optional[str] = None


class BlogEntry(BaseModel):
    id: int
    title: str
    description: str
    date: datetime
    paragraph_hombre: Optional[str] = None
    paragraph_mujer: Optional[str] = None
    categories: Optional[str] = None
    images: List[Image] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
