from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.cinema.models import CinemaRoom, ChatMessage
from apps.cinema.api.serializers import CinemaRoomSerializer, ChatMessageSerializer

class CinemaRoomViewSet(viewsets.ModelViewSet):
    queryset = CinemaRoom.objects.all()
    serializer_class = CinemaRoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        room = self.get_object()
        if room.is_private:
            password = request.data.get('password')
            if not password or password != room.password:
                return Response(
                    {'error': 'Invalid password'},
                    status=status.HTTP_403_FORBIDDEN
                )
        room.participants.add(request.user)
        return Response({'status': 'joined'})

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        room = self.get_object()
        room.participants.remove(request.user)
        return Response({'status': 'left'})

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        room = self.get_object()
        message = request.data.get('message')
        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        chat_message = ChatMessage.objects.create(
            room=room,
            user=request.user,
            message=message
        )
        serializer = ChatMessageSerializer(chat_message)
        return Response(serializer.data)
