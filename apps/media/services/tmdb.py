import tmdbsimple as tmdb
from django.conf import settings
from apps.media.models import Movie, Series, Actor, Director, Episode
from datetime import datetime

tmdb.API_KEY = settings.TMDB_API_KEY

class TMDBService:
    @staticmethod
    def import_movie(tmdb_id):
        movie = tmdb.Movies(tmdb_id)
        movie_info = movie.info()
        credits = movie.credits()
        videos = movie.videos()

        # Get trailer URL if available
        trailer_url = None
        for video in videos.get('results', []):
            if video['type'] == 'Trailer' and video['site'] == 'YouTube':
                trailer_url = f"https://www.youtube.com/watch?v={video['key']}"
                break

        movie_obj, created = Movie.objects.update_or_create(
            tmdb_id=tmdb_id,
            defaults={
                'title': movie_info['title'],
                'original_title': movie_info['original_title'],
                'overview': movie_info['overview'],
                'poster_url': f"https://image.tmdb.org/t/p/w500{movie_info['poster_path']}",
                'backdrop_url': f"https://image.tmdb.org/t/p/original{movie_info['backdrop_path']}",
                'genres': [genre['name'] for genre in movie_info['genres']],
                'release_date': datetime.strptime(movie_info['release_date'], '%Y-%m-%d'),
                'rating': movie_info['vote_average'],
                'vote_count': movie_info['vote_count'],
                'duration': movie_info['runtime'],
                'trailer_url': trailer_url
            }
        )

        # Process cast and crew
        for person in credits.get('crew', []):
            if person['job'] == 'Director':
                director, _ = Director.objects.get_or_create(
                    tmdb_id=person['id'],
                    defaults={
                        'name': person['name'],
                        'image_url': f"https://image.tmdb.org/t/p/w185{person['profile_path']}" if person['profile_path'] else None
                    }
                )
                movie_obj.directors.add(director)

        for person in credits.get('cast', [])[:10]:  # Only top 10 actors
            actor, _ = Actor.objects.get_or_create(
                tmdb_id=person['id'],
                defaults={
                    'name': person['name'],
                    'image_url': f"https://image.tmdb.org/t/p/w185{person['profile_path']}" if person['profile_path'] else None
                }
            )
            movie_obj.actors.add(actor)

        return movie_obj

    @staticmethod
    def get_trending_movies(time_window='day', page=1):
        trending = tmdb.Trending('movie', time_window)
        return trending.info()['results']
