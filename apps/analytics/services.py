from datetime import datetime, timedelta
from django.db.models import Sum, Count, Avg
from django.db.models.functions import TruncDate
from django.contrib.contenttypes.models import ContentType
from django.apps import apps
from .models import ViewEvent, UserActivity  # Add this import

# Заменяем прямой импорт на получение модели через apps
Movie = apps.get_model('content', 'Movie')
Genre = apps.get_model('content', 'Genre')

class AnalyticsService:
    @staticmethod
    def record_view(user, content_object, duration, progress):
        content_type = ContentType.objects.get_for_model(content_object)
        
        # Record view event
        view = ViewEvent.objects.create(
            user=user,
            content_type=content_type,
            object_id=content_object.id,
            duration=duration,
            watch_progress=progress,
            completed=progress >= 0.9  # Consider completed if watched 90%
        )

        # Update daily activity
        activity, _ = UserActivity.objects.get_or_create(
            user=user,
            date=datetime.now().date()
        )
        activity.watch_time += duration
        activity.content_count += 1

        # Update genre distribution
        if hasattr(content_object, 'genres'):
            genres = activity.genres or {}
            for genre in content_object.genres.all():
                genres[genre.name] = genres.get(genre.name, 0) + 1
            activity.genres = genres

        activity.save()
        return view

    @staticmethod
    def get_user_stats(user, days=30):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        activities = UserActivity.objects.filter(
            user=user,
            date__range=[start_date.date(), end_date.date()]
        )

        # Get daily watch time
        daily_stats = activities.values('date').annotate(
            total_time=Sum('watch_time'),
            content_watched=Count('content_count')
        ).order_by('date')

        # Get favorite genres
        genre_counts = {}
        for activity in activities:
            for genre, count in activity.genres.items():
                genre_counts[genre] = genre_counts.get(genre, 0) + count

        # Get completion rate
        views = ViewEvent.objects.filter(
            user=user,
            timestamp__range=[start_date, end_date]
        )
        completion_rate = views.filter(completed=True).count() / views.count() if views.count() > 0 else 0

        return {
            'daily_stats': list(daily_stats),
            'total_watch_time': activities.aggregate(total=Sum('watch_time'))['total'] or 0,
            'total_content_watched': activities.aggregate(total=Sum('content_count'))['total'] or 0,
            'favorite_genres': sorted(genre_counts.items(), key=lambda x: x[1], reverse=True),
            'completion_rate': completion_rate,
            'average_session': views.aggregate(avg=Avg('duration'))['avg'] or 0
        }

    @staticmethod
    def get_trending_content(days=7, limit=10):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        movie_type = ContentType.objects.get_for_model(Movie)
        trending = ViewEvent.objects.filter(
            content_type=movie_type,
            timestamp__range=[start_date, end_date]
        ).values(
            'object_id'
        ).annotate(
            view_count=Count('id'),
            avg_progress=Avg('watch_progress'),
            total_duration=Sum('duration')
        ).order_by('-view_count')[:limit]

        return [{
            'content': Movie.objects.get(id=item['object_id']),
            'stats': item
        } for item in trending]
