import os
import sys
from pathlib import Path
from celery.schedules import crontab

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Add apps to PYTHONPATH
sys.path.insert(0, str(BASE_DIR))

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Local apps
    'apps.content.apps.ContentConfig',
    'apps.analytics.apps.AnalyticsConfig',
    'apps.users.apps.UsersConfig',
    'apps.cinema.apps.CinemaConfig',
    'apps.chat.apps.ChatConfig',
    # ...rest of your apps
]

INSTALLED_APPS += [
    'django_celery_beat',
    'django_celery_results',
]

# Celery Configuration
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'django-db'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'

# Celery Beat Schedule
CELERY_BEAT_SCHEDULE = {
    'cleanup_old_sessions': {
        'task': 'apps.core.tasks.cleanup_old_sessions',
        'schedule': crontab(hour=0, minute=0),  # Run daily at midnight
    },
}

# ...rest of existing settings...
