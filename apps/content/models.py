from django.db import models
from django.conf import settings

class Genre(models.Model):
    name = models.CharField(max_length=100)
    tmdb_id = models.IntegerField(unique=True)
    
    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=255)
    original_title = models.CharField(max_length=255)
    overview = models.TextField()
    release_date = models.DateField()
    runtime = models.IntegerField()
    vote_average = models.FloatField()
    vote_count = models.IntegerField()
    poster_path = models.CharField(max_length=255, null=True)
    backdrop_path = models.CharField(max_length=255, null=True)
    tmdb_id = models.IntegerField(unique=True)
    genres = models.ManyToManyField(Genre)

    def __str__(self):
        return self.title
