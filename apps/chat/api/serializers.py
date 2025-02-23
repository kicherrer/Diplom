from rest_framework import serializers
from ..models import ChatRoom, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'content', 'timestamp', 'sender', 'room']
        read_only_fields = ['sender']

class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'participants', 'created_at', 'is_private']
        read_only_fields = ['created_at']
