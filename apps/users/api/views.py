from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.users.models import WatchHistory, UserFriend
from apps.users.api.serializers import WatchHistorySerializer, UserFriendSerializer

class WatchHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = WatchHistorySerializer

    def get_queryset(self):
        return WatchHistory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['post'])
    def update_progress(self, request):
        content_type = request.data.get('content_type')
        content_id = request.data.get('content_id')
        progress = request.data.get('progress')

        if not all([content_type, content_id, progress]):
            return Response(
                {'error': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )

        history, created = WatchHistory.objects.get_or_create(
            user=request.user,
            content_type=content_type,
            content_id=content_id,
            defaults={'progress': progress}
        )

        if not created:
            history.progress = progress
            history.save()

        return Response(WatchHistorySerializer(history).data)

class UserFriendViewSet(viewsets.ModelViewSet):
    serializer_class = UserFriendSerializer

    def get_queryset(self):
        return UserFriend.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def send_request(self, request):
        friend_id = request.data.get('friend_id')
        if not friend_id:
            return Response(
                {'error': 'friend_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        friendship, created = UserFriend.objects.get_or_create(
            user=request.user,
            friend_id=friend_id,
            defaults={'status': 'pending'}
        )

        return Response(UserFriendSerializer(friendship).data)

    @action(detail=True, methods=['post'])
    def accept_request(self, request, pk=None):
        friendship = self.get_object()
        friendship.status = 'accepted'
        friendship.save()
        return Response(UserFriendSerializer(friendship).data)

    @action(detail=True, methods=['post'])
    def decline_request(self, request, pk=None):
        friendship = self.get_object()
        friendship.status = 'declined'
        friendship.save()
        return Response(UserFriendSerializer(friendship).data)
