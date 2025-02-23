from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from apps.media.models import Movie, Series, Video, Actor, Director
from apps.media.api.serializers import (
    MovieSerializer, SeriesSerializer, VideoSerializer,
    ActorSerializer, DirectorSerializer
)

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['genres', 'release_date', 'rating']
    search_fields = ['title', 'original_title']

    @action(detail=False, methods=['get'])
    def by_mood(self, request):
        mood = request.query_params.get('mood')
        if mood:
            movies = Movie.objects.filter(mood_tags__contains=[mood])
            serializer = self.get_serializer(movies, many=True)
            return Response(serializer.data)
        return Response([])

class SeriesViewSet(viewsets.ModelViewSet):
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['genres', 'status', 'rating']
    search_fields = ['title', 'original_title']

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['genres', 'channel_name']
    search_fields = ['title']
