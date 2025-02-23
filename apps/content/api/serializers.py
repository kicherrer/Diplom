from rest_framework import serializers
from ..models import Movie, Genre

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'tmdb_id']

class MovieSerializer(serializers.ModelSerializer):
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'original_title', 'overview',
            'release_date', 'runtime', 'vote_average',
            'vote_count', 'poster_path', 'backdrop_path',
            'tmdb_id', 'genres'
        ]
