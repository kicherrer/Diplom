from apps.users.models import Achievement, UserAchievement
from apps.notifications.services import NotificationService
from django.db.models import Count, Q
from datetime import timedelta, datetime

class AchievementService:
    @staticmethod
    def check_achievements(user):
        achievements_unlocked = []

        # Check watch count achievements
        watch_count = len(user.watch_history)
        watch_achievements = Achievement.objects.filter(
            achievement_type='watch_count',
            required_value__lte=watch_count
        )
        
        for achievement in watch_achievements:
            achievement_unlocked = AchievementService._update_achievement(
                user, achievement, watch_count
            )
            if achievement_unlocked:
                achievements_unlocked.append(achievement)

        # Check rating count achievements
        rating_count = user.ratings.count()
        rating_achievements = Achievement.objects.filter(
            achievement_type='rating_count',
            required_value__lte=rating_count
        )
        
        for achievement in rating_achievements:
            achievement_unlocked = AchievementService._update_achievement(
                user, achievement, rating_count
            )
            if achievement_unlocked:
                achievements_unlocked.append(achievement)

        # Check genre master achievements
        genres_watched = {}
        for item in user.watch_history:
            for genre in item.get('genres', []):
                genres_watched[genre] = genres_watched.get(genre, 0) + 1

        for genre, count in genres_watched.items():
            genre_achievements = Achievement.objects.filter(
                achievement_type='genre_master',
                required_value__lte=count
            )
            
            for achievement in genre_achievements:
                if genre in achievement.name.lower():
                    achievement_unlocked = AchievementService._update_achievement(
                        user, achievement, count
                    )
                    if achievement_unlocked:
                        achievements_unlocked.append(achievement)

        # Notify about new achievements
        if achievements_unlocked:
            NotificationService.send_achievement_notifications(user, achievements_unlocked)

        return achievements_unlocked

    @staticmethod
    def _update_achievement(user, achievement, current_value):
        user_achievement, created = UserAchievement.objects.get_or_create(
            user=user,
            achievement=achievement,
            defaults={'current_value': current_value}
        )

        was_unlocked = user_achievement.current_value >= achievement.required_value
        is_now_unlocked = current_value >= achievement.required_value

        if not was_unlocked and is_now_unlocked:
            user_achievement.current_value = current_value
            user_achievement.save()
            return True

        if not created and current_value > user_achievement.current_value:
            user_achievement.current_value = current_value
            user_achievement.save()

        return False
