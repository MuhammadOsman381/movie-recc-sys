import requests
from ..core.config import settings

class OMDBService:
    def __init__(self):
        self.api_key = settings.OMDB_API_KEY
        self.base_url = settings.OMDB_BASE_URL

    def get_movies_by_search(self, query="Marvel", page=1):
        url = f"{self.base_url}"
        params = {
            "apikey": self.api_key,
            "s": query,
            "page": page,
            "type": "movie"
        }
        response = requests.get(url, params=params)
        data = response.json()
        if data.get("Response") == "True":
            # Map OMDb fields to our local schema
            results = []
            for item in data.get("Search", []):
                results.append({
                    "id": item["imdbID"],
                    "title": item["Title"],
                    "poster_path": item["Poster"],
                    "release_date": item["Year"],
                    "overview": "" # Search list doesn't provide overview
                })
            return {"results": results}
        return {"results": []}

    def get_movie_details(self, movie_id):
        url = f"{self.base_url}"
        params = {
            "apikey": self.api_key,
            "i": movie_id,
            "plot": "full"
        }
        response = requests.get(url, params=params)
        data = response.json()
        if data.get("Response") == "True":
            return {
                "id": data["imdbID"],
                "title": data["Title"],
                "overview": data["Plot"],
                "poster_path": data["Poster"],
                "release_date": data["Released"],
                "vote_average": float(data["imdbRating"]) if data["imdbRating"] != "N/A" else 0.0,
                "vote_count": int(data["imdbVotes"].replace(",", "")) if data["imdbVotes"] != "N/A" else 0,
                "popularity": 0.0
            }
        return {}

    def get_movie_recommendations(self, movie_id):
        # OMDb doesn't have a recommendations endpoint.
        # We can implement a simple fall-back by searching for the movie's genre or similar title words
        details = self.get_movie_details(movie_id)
        if details:
            # Search by title words (first two words)
            search_query = " ".join(details["title"].split()[:2])
            return self.get_movies_by_search(search_query)
        return {"results": []}

omdb_service = OMDBService()
