from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.content.models import Movie
from apps.content.api.serializers import MovieSerializer
from ..services import RecommendationService

class RecommendationViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def personalized(self, request):
        limit = int(request.query_params.get('limit', 20))
        movies = RecommendationService.get_personalized_recommendations(
            user=request.user,
            limit=limit
        )
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['GET'])
    def similar_movies(self, request, pk=None):
        try:
            movie = Movie.objects.get(pk=pk)
            similar_movies = movie.get_similar_movies()
            serializer = MovieSerializer(similar_movies, many=True)
            return Response(serializer.data)
        except Movie.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=404)

    @action(detail=False, methods=['GET'])
    def similar_users(self, request):
        limit = int(request.query_params.get('limit', 5))
        similar_users = RecommendationService.get_similar_users(
            user=request.user,
            limit=limit
        )
        return Response(similar_users)
