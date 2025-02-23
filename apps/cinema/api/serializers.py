from rest_framework import serializers
from apps.cinema.models import CinemaRoom, ChatMessage
from apps.users.serializers import UserSerializer

class ChatMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'message', 'timestamp']

class CinemaRoomSerializer(serializers.ModelSerializer):
    participants_count = serializers.SerializerMethodField()
    messages = ChatMessageSerializer(many=True, read_only=True)
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = CinemaRoom
        fields = [
            'id', 'name', 'content_type', 'content_id', 
            'is_private', 'current_position', 'is_playing',
            'participants_count', 'messages', 'is_owner',
            'created_at'
        ]
        read_only_fields = ['created_by', 'participants_count']

    def get_participants_count(self, obj):
        return obj.participants.count()

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            return obj.created_by == request.user
        return False
