from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import Movie, Genre
from .serializers import MovieSerializer, GenreSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        genre = self.request.query_params.get('genre', None)
        if genre:
            queryset = queryset.filter(genres__name=genre)
        return queryset

class GenreViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticated]
