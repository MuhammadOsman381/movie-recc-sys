from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise
from app.core.config import settings
from app.api import endpoints, auth

app = FastAPI(title="Movie Recommendation System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, tags=["auth"])
app.include_router(endpoints.router, prefix="/api", tags=["movies"])

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Movie Recommendation System API"}

register_tortoise(
    app,
    db_url=settings.DATABASE_URL,
    modules={"models": ["app.models.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)
