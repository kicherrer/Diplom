from django.db import models
from django.conf import settings
import uuid

class ChatRoom(models.Model):
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='chat_rooms')
    is_private = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    avatar = models.ImageField(upload_to='chat_room_avatars/', null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_rooms'
    )
    admins = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name='administered_rooms'
    )
    is_group = models.BooleanField(default=False)

    @property
    def last_message(self):
        return self.messages.first()

    def get_display_name(self):
        if self.name:
            return self.name
        if not self.is_group:
            # For private chats, return the other participant's name
            other_user = self.participants.exclude(id=self.created_by_id).first()
            return other_user.username if other_user else "Unknown"
        return "Group Chat"

class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    read_by = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='read_messages')
    attachment = models.FileField(
        upload_to=lambda instance, filename: f'chat_attachments/{uuid.uuid4()}/{filename}',
        null=True, 
        blank=True
    )
    attachment_type = models.CharField(
        max_length=20,
        choices=[
            ('image', 'Image'),
            ('video', 'Video'),
            ('file', 'File')
        ],
        null=True,
        blank=True
    )
    attachment_name = models.CharField(max_length=255, null=True, blank=True)
    message_type = models.CharField(
        max_length=20,
        choices=[
            ('text', 'Text'),
            ('voice', 'Voice'),
            ('file', 'File')
        ],
        default='text'
    )
    voice_duration = models.IntegerField(null=True, blank=True)  # Duration in seconds
    
    class Meta:
        ordering = ['-timestamp']

class MessageReaction(models.Model):
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    emoji = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('message', 'user', 'emoji')
