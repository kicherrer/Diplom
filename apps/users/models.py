from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings  # Add this import

class User(AbstractUser):
    MOOD_CHOICES = [
        ('happy', 'Happy'),
        ('sad', 'Sad'),
        ('excited', 'Excited'),
        ('relaxed', 'Relaxed'),
    ]

    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    preferred_genres = models.JSONField(default=list, blank=True)
    current_mood = models.CharField(max_length=20, choices=MOOD_CHOICES, null=True, blank=True)
    watch_history = models.JSONField(default=list, blank=True)
    friends = models.ManyToManyField('self', blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

class Achievement(models.Model):
    TYPES = [
        ('watch_count', 'Watch Count'),
        ('rating_count', 'Rating Count'),
        ('genre_master', 'Genre Master'),
        ('social', 'Social Activity'),
    ]
    
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='achievements/')
    achievement_type = models.CharField(max_length=20, choices=TYPES)
    required_value = models.IntegerField()
    points = models.IntegerField(default=10)

class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    unlocked_at = models.DateTimeField(auto_now_add=True)
    current_value = models.IntegerField(default=0)

class WatchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='watch_records')
    content_type = models.CharField(max_length=20, choices=[
        ('movie', 'Movie'),
        ('series', 'Series'),
        ('video', 'Video')
    ])
    content_id = models.IntegerField()
    watched_at = models.DateTimeField(auto_now_add=True)
    progress = models.FloatField(default=0)  # Progress in percentage
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-watched_at']

class UserFriend(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friendships')
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='friend_of')
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'friend']

class UserLevel(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='level')
    current_level = models.IntegerField(default=1)
    current_exp = models.IntegerField(default=0)
    total_exp = models.IntegerField(default=0)

    @property
    def exp_to_next_level(self):
        return self.current_level * 1000  # Простая формула: уровень * 1000

    @property
    def progress_percentage(self):
        return (self.current_exp / self.exp_to_next_level) * 100
