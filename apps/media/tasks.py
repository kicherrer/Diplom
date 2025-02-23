from celery import shared_task
from .services.tmdb import TMDBService
from .services.youtube import YouTubeService
from django.db import transaction
import logging

logger = logging.getLogger(__name__)

@shared_task
def import_movie_task(tmdb_id):
    try:
        with transaction.atomic():
            movie = TMDBService.import_movie(tmdb_id)
            logger.info(f"Successfully imported movie: {movie.title}")
            return {"status": "success", "movie_id": movie.id}
    except Exception as e:
        logger.error(f"Failed to import movie {tmdb_id}: {str(e)}")
        return {"status": "error", "message": str(e)}

@shared_task
def import_trending_movies_task():
    try:
        trending_movies = TMDBService.get_trending_movies()
        for movie in trending_movies[:20]:  # Import top 20 trending movies
            import_movie_task.delay(movie['id'])
        return {"status": "success", "movies_count": len(trending_movies)}
    except Exception as e:
        logger.error(f"Failed to import trending movies: {str(e)}")
        return {"status": "error", "message": str(e)}

@shared_task
def import_youtube_video_task(video_id):
    try:
        youtube_service = YouTubeService()
        video = youtube_service.import_video(video_id)
        logger.info(f"Successfully imported video: {video.title}")
        return {"status": "success", "video_id": video.id}
    except Exception as e:
        logger.error(f"Failed to import video {video_id}: {str(e)}")
        return {"status": "error", "message": str(e)}
