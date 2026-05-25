import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .database import engine, Base
from .routers import auth, entries, images, users
from .seed import seed_users

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/app/uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def _run_migrations():
    with engine.connect() as conn:
        cols = [r[1] for r in conn.execute(text("PRAGMA table_info(blog_entries)")).fetchall()]
        if "categories" not in cols:
            conn.execute(text("ALTER TABLE blog_entries ADD COLUMN categories VARCHAR"))
            conn.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    _run_migrations()
    from .database import SessionLocal
    db = SessionLocal()
    try:
        seed_users(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Nuestra Historia API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(entries.router)
app.include_router(images.router)
app.include_router(users.router)


@app.get("/")
async def root():
    return {"message": "Nuestra Historia API"}
