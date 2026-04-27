from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional


class GenreBase(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class MovieBase(BaseModel):
    id: str
    title: str
    overview: Optional[str] = None
    poster_path: Optional[str] = None
    release_date: Optional[str] = None
    vote_average: Optional[float] = 0.0
    vote_count: Optional[int] = 0
    popularity: Optional[float] = 0.0

    class Config:
        from_attributes = True


class MovieCreate(MovieBase):
    genre_ids: List[int] = []


class Movie(MovieBase):
    genres: List[GenreBase] = []

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    username: str
    email: EmailStr

    class Config:
        from_attributes = True


class UserCreate(UserBase):
    password: str = Field(..., max_length=256)


class User(UserBase):
    id: int

    class Config:
        from_attributes = True

    @classmethod
    async def from_tortoise_orm(cls, obj):
        return cls(id=obj.id, username=obj.username, email=obj.email)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class LikeCreate(BaseModel):
    movie_id: str


class RatingCreate(BaseModel):
    movie_id: str
    rating: float
