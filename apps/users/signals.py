from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import UserLevel, User

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Создаем уровень пользователя при регистрации
        UserLevel.objects.create(user=instance)
