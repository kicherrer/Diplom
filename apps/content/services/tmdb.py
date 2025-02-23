import os
import requests
from typing import Dict, List, Optional
from django.conf import settings

class TMDBService:
    BASE_URL = "https://api.themoviedb.org/3"
    API_KEY = settings.TMDB_API_KEY

    @classmethod
    def _make_request(cls, endpoint: str, params: Dict = None) -> Dict:
        url = f"{cls.BASE_URL}/{endpoint}"
        params = params or {}
        params['api_key'] = cls.API_KEY
        params['language'] = 'ru-RU'

        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()

    @classmethod
    def get_movie_details(cls, tmdb_id: int) -> Dict:
        return cls._make_request(f"movie/{tmdb_id}", {
            'append_to_response': 'credits,videos,similar,keywords'
        })

    @classmethod
    def get_trending_movies(cls, page: int = 1) -> List[Dict]:
        return cls._make_request("trending/movie/week", {'page': page})

    @classmethod
    def search_movies(cls, query: str, page: int = 1) -> List[Dict]:
        return cls._make_request("search/movie", {
            'query': query,
            'page': page
        })

    @classmethod
    def get_movie_recommendations(cls, tmdb_id: int) -> List[Dict]:
        return cls._make_request(f"movie/{tmdb_id}/recommendations")

    @classmethod
    def get_genre_list(cls) -> List[Dict]:
        return cls._make_request("genre/movie/list")
