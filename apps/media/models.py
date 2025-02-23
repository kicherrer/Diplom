from django.db import models
from django.contrib.postgres.fields import ArrayField

class Person(models.Model):
    name = models.CharField(max_length=255)
    tmdb_id = models.IntegerField(unique=True)
    image_url = models.URLField(null=True, blank=True)
    biography = models.TextField(blank=True)

    class Meta:
        abstract = True

class Actor(Person):
    pass

class Director(Person):
    pass

class MediaContent(models.Model):
    title = models.CharField(max_length=255)
    original_title = models.CharField(max_length=255)
    overview = models.TextField()
    poster_url = models.URLField()
    backdrop_url = models.URLField(null=True, blank=True)
    genres = ArrayField(models.CharField(max_length=50))
    release_date = models.DateField()
    rating = models.FloatField(default=0.0)
    vote_count = models.IntegerField(default=0)
    tmdb_id = models.IntegerField(unique=True)
    mood_tags = ArrayField(models.CharField(max_length=50), default=list)

    class Meta:
        abstract = True

class Movie(MediaContent):
    duration = models.IntegerField()  # in minutes
    directors = models.ManyToManyField(Director, related_name='movies')
    actors = models.ManyToManyField(Actor, related_name='movies')
    trailer_url = models.URLField(null=True, blank=True)

class Series(MediaContent):
    seasons_count = models.IntegerField()
    episodes_count = models.IntegerField()
    status = models.CharField(max_length=50)  # ongoing, completed, cancelled
    next_episode_date = models.DateField(null=True, blank=True)

class Episode(models.Model):
    series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name='episodes')
    title = models.CharField(max_length=255)
    overview = models.TextField()
    season_number = models.IntegerField()
    episode_number = models.IntegerField()
    air_date = models.DateField()
    duration = models.IntegerField()  # in minutes

class Video(MediaContent):
    youtube_id = models.CharField(max_length=20, unique=True)
    channel_name = models.CharField(max_length=255)
    duration = models.IntegerField()  # in seconds
    view_count = models.IntegerField(default=0)
