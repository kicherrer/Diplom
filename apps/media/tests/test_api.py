import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.media.models import Movie, Actor, Director
from apps.users.models import User

@pytest.mark.django_db
class TestMovieAPI:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            username='testuser',
            password='testpass123'
        )

    @pytest.fixture
    def movie(self):
        movie = Movie.objects.create(
            title='Test Movie',
            original_title='Test Movie',
            overview='Test Overview',
            poster_url='http://example.com/poster.jpg',
            genres=['Action', 'Drama'],
            release_date='2023-01-01',
            tmdb_id=12345,
            duration=120
        )
        return movie

    def test_list_movies(self, api_client, user, movie):
        api_client.force_authenticate(user=user)
        url = reverse('movie-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == movie.title

    def test_movie_by_mood(self, api_client, user, movie):
        movie.mood_tags = ['happy']
        movie.save()
        api_client.force_authenticate(user=user)
        url = reverse('movie-by-mood')
        response = api_client.get(url, {'mood': 'happy'})
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 1
        assert response.data[0]['title'] == movie.title
