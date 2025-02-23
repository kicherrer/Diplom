from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from apps.chat.models import ChatMessage, ChatRoom, MessageReaction
from apps.notifications.services import NotificationService

class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "chat",
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "chat",
            self.channel_name
        )

    async def receive_json(self, content):
        message_type = content.get('type')
        if message_type == 'chat_message':
            message = await self.save_message(content)
            await self.channel_layer.group_send(
                "chat",
                {
                    "type": "chat.message",
                    "message": message
                }
            )

    async def chat_message(self, event):
        await self.send_json(event["message"])

    @database_sync_to_async
    def save_message(self, content):
        message = ChatMessage.objects.create(
            sender_id=content['sender'],
            content=content['content']
        )
        return {
            'id': str(message.id),
            'sender': message.sender_id,
            'content': message.content,
            'timestamp': message.timestamp.isoformat(),
            'sender_avatar': message.sender.avatar.url if message.sender.avatar else None
        }

class PrivateChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if not self.user.is_authenticated:
            await self.close()
            return

        await self.accept()
        self.rooms = set()

        # Join all user's chat rooms
        user_rooms = await self.get_user_rooms()
        for room in user_rooms:
            room_group = f"chat_{room.id}"
            await self.channel_layer.group_add(room_group, self.channel_name)
            self.rooms.add(room_group)

    async def disconnect(self, close_code):
        # Leave all rooms
        for room_group in self.rooms:
            await self.channel_layer.group_discard(room_group, self.channel_name)

    async def receive_json(self, content):
        message_type = content.get('type')
        if message_type == 'typing':
            room_id = content.get('room_id')
            room_group = f"chat_{room_id}"
            await self.channel_layer.group_send(
                room_group,
                {
                    "type": "typing.notification",
                    "user_id": content.get('user_id')
                }
            )
        elif message_type == 'private_message':
            room_id = content.get('room_id')
            message_data = await self.save_private_message(
                room_id=room_id,
                content=content.get('content'),
                sender_id=self.user.id
            )
            
            # Send to room group
            room_group = f"chat_{room_id}"
            await self.channel_layer.group_send(
                room_group,
                {
                    "type": "chat.message",
                    "message": message_data
                }
            )

            # Send notifications to other participants
            await self.send_notifications(room_id, message_data)
        elif message_type == 'reaction':
            room_id = content.get('room_id')
            message_id = content.get('message_id')
            emoji = content.get('emoji')
            action = content.get('action')  # 'add' or 'remove'
            
            if action == 'add':
                await self.add_reaction(message_id, emoji)
            else:
                await self.remove_reaction(message_id, emoji)
                
            room_group = f"chat_{room_id}"
            await self.channel_layer.group_send(
                room_group,
                {
                    "type": "reaction.update",
                    "message_id": message_id,
                    "emoji": emoji,
                    "action": action,
                    "user_id": self.user.id
                }
            )

    async def chat_message(self, event):
        await self.send_json(event["message"])

    async def typing_notification(self, event):
        await self.send_json({
            "type": "typing",
            "user_id": event["user_id"]
        })

    async def reaction_update(self, event):
        await self.send_json(event)

    @database_sync_to_async
    def get_user_rooms(self):
        return list(self.user.chat_rooms.all())

    @database_sync_to_async
    def save_private_message(self, room_id, content, sender_id):
        room = ChatRoom.objects.get(id=room_id)
        message = ChatMessage.objects.create(
            room=room,
            sender_id=sender_id,
            content=content
        )
        # Mark as read by sender
        message.read_by.add(sender_id)
        
        return {
            'id': str(message.id),
            'room_id': room_id,
            'sender': sender_id,
            'content': content,
            'timestamp': message.timestamp.isoformat(),
            'sender_avatar': message.sender.avatar.url if message.sender.avatar else None
        }

    @database_sync_to_async
    def send_notifications(self, room_id, message_data):
        room = ChatRoom.objects.get(id=room_id)
        for participant in room.participants.exclude(id=self.user.id):
            NotificationService.send_chat_notification(
                user=participant,
                sender_name=self.user.username,
                message_preview=message_data['content'][:50],
                room_id=room_id
            )

    @database_sync_to_async
    def add_reaction(self, message_id, emoji):
        message = ChatMessage.objects.get(id=message_id)
        MessageReaction.objects.create(
            message=message,
            user=self.user,
            emoji=emoji
        )

    @database_sync_to_async
    def remove_reaction(self, message_id, emoji):
        MessageReaction.objects.filter(
            message_id=message_id,
            user=self.user,
            emoji=emoji
        ).delete()
