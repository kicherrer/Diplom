import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('core')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Configure periodic tasks
app.conf.beat_schedule = {
    'import-trending-movies': {
        'task': 'apps.media.tasks.import_trending_movies_task',
        'schedule': crontab(hour='*/12'),  # Run every 12 hours
    },
}
