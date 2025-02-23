from django.db import models
from django.conf import settings  # Add this import
from apps.media.models import Movie, Series

class CinemaRoom(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content_type = models.CharField(max_length=20, choices=[('movie', 'Movie'), ('series', 'Series')])
    content_id = models.IntegerField()
    is_private = models.BooleanField(default=False)
    password = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    current_position = models.IntegerField(default=0)  # Position in seconds
    is_playing = models.BooleanField(default=False)
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='cinema_rooms')

class ChatMessage(models.Model):
    room = models.ForeignKey(CinemaRoom, on_delete=models.CASCADE, related_name='messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
