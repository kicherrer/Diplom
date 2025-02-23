from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class ViewEvent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    timestamp = models.DateTimeField(auto_now_add=True)
    duration = models.PositiveIntegerField(default=0)  # Duration in seconds
    completed = models.BooleanField(default=False)
    watch_progress = models.FloatField(default=0)  # Progress percentage

    class Meta:
        indexes = [
            models.Index(fields=['content_type', 'object_id']),
            models.Index(fields=['user', 'timestamp'])
        ]

class UserActivity(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    watch_time = models.PositiveIntegerField(default=0)  # Total watch time in seconds
    content_count = models.PositiveIntegerField(default=0)  # Number of items watched
    genres = models.JSONField(default=dict)  # Genre distribution

    class Meta:
        unique_together = ('user', 'date')
