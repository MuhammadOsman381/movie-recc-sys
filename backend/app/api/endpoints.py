from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.models import models
from app.schemas import schemas
from app.services.omdb import omdb_service
from app.services.recommendation import recommender
from .auth import get_current_user

router = APIRouter()

@router.get("/movies/popular", response_model=List[schemas.Movie])
async def get_popular(page: int = 1):
    tmdb_data = omdb_service.get_movies_by_search("Action", page=page)
    results = tmdb_data.get("results", [])
    
    movie_list = []
    for item in results:
        movie, created = await models.Movie.get_or_create(
            id=item["id"],
            defaults={
                "title": item["title"],
                "overview": item.get("overview", ""),
                "poster_path": item["poster_path"],
                "release_date": item.get("release_date"),
                "vote_average": item.get("vote_average", 0.0),
                "vote_count": item.get("vote_count", 0),
                "popularity": item.get("popularity", 0.0)
            }
        )
        # Convert to dict and fetch related if needed, but here we just want the base data
        movie_data = {
            "id": movie.id,
            "title": movie.title,
            "overview": movie.overview,
            "poster_path": movie.poster_path,
            "release_date": movie.release_date,
            "vote_average": movie.vote_average,
            "vote_count": movie.vote_count,
            "popularity": movie.popularity,
            "genres": [] # Default to empty list for results
        }
        movie_list.append(movie_data)
    return movie_list

@router.get("/movies/search", response_model=List[schemas.Movie])
async def search_movies(query: str, page: int = 1):
    tmdb_data = omdb_service.get_movies_by_search(query, page=page)
    results = tmdb_data.get("results", [])
    
    movie_list = []
    for item in results:
        movie, created = await models.Movie.get_or_create(
            id=item["id"],
            defaults={
                "title": item["title"],
                "overview": item.get("overview", ""),
                "poster_path": item["poster_path"],
                "release_date": item.get("release_date")
            }
        )
        movie_data = {
            "id": movie.id,
            "title": movie.title,
            "overview": movie.overview,
            "poster_path": movie.poster_path,
            "release_date": movie.release_date,
            "vote_average": movie.vote_average,
            "vote_count": movie.vote_count,
            "popularity": movie.popularity,
            "genres": []
        }
        movie_list.append(movie_data)
    return movie_list

@router.get("/movies/{movie_id}", response_model=schemas.Movie)
async def get_movie(movie_id: str):
    movie = await models.Movie.get_or_none(id=movie_id).prefetch_related("genres")
    if not movie or not movie.overview:
        item = omdb_service.get_movie_details(movie_id)
        if not item or "id" not in item:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        if not movie:
            movie = await models.Movie.create(
                id=item["id"],
                title=item["title"],
                overview=item["overview"],
                poster_path=item["poster_path"],
                release_date=item.get("release_date"),
                vote_average=item.get("vote_average"),
                vote_count=item.get("vote_count")
            )
        else:
            movie.overview = item["overview"]
            movie.vote_average = item.get("vote_average")
            movie.vote_count = item.get("vote_count")
            await movie.save()
            
    # Manually map to include genres list
    return {
        "id": movie.id,
        "title": movie.title,
        "overview": movie.overview,
        "poster_path": movie.poster_path,
        "release_date": movie.release_date,
        "vote_average": movie.vote_average,
        "vote_count": movie.vote_count,
        "popularity": movie.popularity,
        "genres": [g for g in getattr(movie, "genres", [])]
    }

@router.post("/movies/{movie_id}/like")
async def like_movie(movie_id: str, current_user: models.User = Depends(get_current_user)):
    existing_like = await models.Like.get_or_none(user=current_user, movie_id=movie_id)
    
    if existing_like:
        await existing_like.delete()
        return {"message": "Movie unliked"}
    
    await models.Like.create(user=current_user, movie_id=movie_id)
    return {"message": "Movie liked"}

@router.get("/recommendations/content/{movie_id}", response_model=List[schemas.Movie])
async def get_content_recommendations(movie_id: str):
    movie_ids = await recommender.get_content_recommendations(movie_id)
    movies = await models.Movie.filter(id__in=movie_ids)
    return [{
        "id": m.id,
        "title": m.title,
        "overview": m.overview,
        "poster_path": m.poster_path,
        "release_date": m.release_date,
        "vote_average": m.vote_average,
        "vote_count": m.vote_count,
        "popularity": m.popularity,
        "genres": []
    } for m in movies]

@router.get("/recommendations/user", response_model=List[schemas.Movie])
async def get_user_recommendations(current_user: models.User = Depends(get_current_user)):
    movie_ids = await recommender.get_collaborative_recommendations(current_user.id)
    movies = await models.Movie.filter(id__in=movie_ids)
    return [{
        "id": m.id,
        "title": m.title,
        "overview": m.overview,
        "poster_path": m.poster_path,
        "release_date": m.release_date,
        "vote_average": m.vote_average,
        "vote_count": m.vote_count,
        "popularity": m.popularity,
        "genres": []
    } for m in movies]
