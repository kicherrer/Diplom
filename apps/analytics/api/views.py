from django.apps import apps  # Add this import
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from ..services import AnalyticsService

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['GET'])
    def user_stats(self, request):
        days = int(request.query_params.get('days', 30))
        stats = AnalyticsService.get_user_stats(request.user, days=days)
        return Response(stats)

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    @action(detail=False, methods=['GET'])
    def trending(self, request):
        days = int(request.query_params.get('days', 7))
        limit = int(request.query_params.get('limit', 10))
        trending = AnalyticsService.get_trending_content(days=days, limit=limit)
        return Response(trending)

    @action(detail=False, methods=['POST'])
    def record_view(self, request):
        content_type = request.data.get('content_type')
        object_id = request.data.get('object_id')
        duration = int(request.data.get('duration', 0))
        progress = float(request.data.get('progress', 0))

        content_model = apps.get_model(*content_type.split('.'))
        content_object = content_model.objects.get(id=object_id)

        view = AnalyticsService.record_view(
            user=request.user,
            content_object=content_object,
            duration=duration,
            progress=progress
        )

        return Response({
            'view_id': view.id,
            'recorded_duration': duration,
            'recorded_progress': progress
        })
