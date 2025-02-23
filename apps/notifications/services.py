from apps.notifications.models import Notification
from django.utils.translation import gettext as _
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class NotificationService:
    @staticmethod
    def send_achievement_notifications(user, achievements):
        channel_layer = get_channel_layer()

        for achievement in achievements:
            # Create notification in database
            notification = Notification.objects.create(
                user=user,
                title=_('Achievement Unlocked!'),
                message=_(f'You have unlocked "{achievement.name}"'),
                notification_type='achievement',
                data={
                    'achievement_id': achievement.id,
                    'points': achievement.points,
                    'icon_url': achievement.icon.url if achievement.icon else None
                }
            )

            # Send WebSocket notification
            async_to_sync(channel_layer.group_send)(
                f"user_{user.id}_notifications",
                {
                    "type": "notification.message",
                    "message": {
                        "id": notification.id,
                        "title": notification.title,
                        "message": notification.message,
                        "type": notification.notification_type,
                        "data": notification.data,
                        "created_at": notification.created_at.isoformat()
                    }
                }
            )
