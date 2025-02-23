from celery import shared_task
from datetime import datetime
from .services.tmdb import TMDBService
from apps.content.models import Movie, Genre, Person, Credit
from django.db import transaction

@shared_task
def import_movie(tmdb_id: int) -> dict:
    try:
        movie_data = TMDBService.get_movie_details(tmdb_id)
        
        with transaction.atomic():
            # Create or update movie
            movie, created = Movie.objects.update_or_create(
                tmdb_id=tmdb_id,
                defaults={
                    'title': movie_data['title'],
                    'original_title': movie_data['original_title'],
                    'overview': movie_data['overview'],
                    'release_date': datetime.strptime(movie_data['release_date'], '%Y-%m-%d'),
                    'runtime': movie_data['runtime'],
                    'vote_average': movie_data['vote_average'],
                    'vote_count': movie_data['vote_count'],
                    'poster_path': movie_data['poster_path'],
                    'backdrop_path': movie_data['backdrop_path'],
                }
            )

            # Add genres
            movie.genres.clear()
            for genre_data in movie_data['genres']:
                genre, _ = Genre.objects.get_or_create(
                    tmdb_id=genre_data['id'],
                    defaults={'name': genre_data['name']}
                )
                movie.genres.add(genre)

            # Add credits
            movie.credits.all().delete()
            for person_data in movie_data['credits']['cast'][:10]:  # Top 10 cast
                person, _ = Person.objects.get_or_create(
                    tmdb_id=person_data['id'],
                    defaults={
                        'name': person_data['name'],
                        'profile_path': person_data['profile_path']
                    }
                )
                Credit.objects.create(
                    movie=movie,
                    person=person,
                    character=person_data['character'],
                    order=person_data['order'],
                    credit_type='CAST'
                )

            # Add crew (director and writers)
            for person_data in movie_data['credits']['crew']:
                if person_data['job'] in ['Director', 'Screenplay']:
                    person, _ = Person.objects.get_or_create(
                        tmdb_id=person_data['id'],
                        defaults={
                            'name': person_data['name'],
                            'profile_path': person_data['profile_path']
                        }
                    )
                    Credit.objects.create(
                        movie=movie,
                        person=person,
                        job=person_data['job'],
                        credit_type='CREW'
                    )

        return {
            'status': 'success',
            'movie_id': movie.id,
            'created': created
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e)
        }

@shared_task
def import_trending_movies():
    movies = TMDBService.get_trending_movies()
    for movie_data in movies['results']:
        import_movie.delay(movie_data['id'])
