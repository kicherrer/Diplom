from django.db import models
from django.conf import settings
from apps.media.models import Movie, Series, Video

class UserPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    favorite_genres = models.JSONField(default=list)
    watch_time = models.JSONField(default=dict)  # {"morning": [], "afternoon": [], "evening": []}
    mood_preferences = models.JSONField(default=dict)  # {"happy": [], "sad": [], ...}

class Recommendation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=20)  # movie, series, video
    content_id = models.IntegerField()
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_viewed = models.BooleanField(default=False)

class UserActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=20)
    content_id = models.IntegerField()
    activity_type = models.CharField(max_length=20)  # view, like, save
    timestamp = models.DateTimeField(auto_now_add=True)
