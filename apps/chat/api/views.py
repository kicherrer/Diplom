from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import ChatRoom, ChatMessage
from .serializers import ChatRoomSerializer, ChatMessageSerializer

class ChatViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChatRoomSerializer

    def get_queryset(self):
        return ChatRoom.objects.filter(participants=self.request.user)

    def perform_create(self, serializer):
        chat_room = serializer.save()
        chat_room.participants.add(self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        room = self.get_object()
        message = request.data.get('message', '')
        
        chat_message = ChatMessage.objects.create(
            room=room,
            sender=request.user,
            content=message
        )
        
        return Response({
            'id': chat_message.id,
            'content': chat_message.content,
            'timestamp': chat_message.timestamp,
        })

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        room = self.get_object()
        messages = ChatMessage.objects.filter(room=room)
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
