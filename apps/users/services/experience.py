from apps.users.models import UserLevel
from apps.notifications.services import NotificationService

class ExperienceService:
    EXP_ACTIONS = {
        'watch_movie': 100,
        'rate_content': 50,
        'write_review': 150,
        'achievement_unlock': 200,
        'daily_login': 75,
        'invite_friend': 125,
        'complete_profile': 250
    }

    @staticmethod
    def add_experience(user, action_type):
        if action_type not in ExperienceService.EXP_ACTIONS:
            return None

        exp_amount = ExperienceService.EXP_ACTIONS[action_type]
        user_level, _ = UserLevel.objects.get_or_create(user=user)
        
        old_level = user_level.current_level
        user_level.current_exp += exp_amount
        user_level.total_exp += exp_amount

        # Check for level up
        while user_level.current_exp >= user_level.exp_to_next_level:
            user_level.current_exp -= user_level.exp_to_next_level
            user_level.current_level += 1

        user_level.save()

        # Notify user if leveled up
        if user_level.current_level > old_level:
            NotificationService.send_level_up_notification(
                user=user,
                new_level=user_level.current_level,
                rewards=ExperienceService.get_level_rewards(user_level.current_level)
            )

        return {
            'exp_gained': exp_amount,
            'leveled_up': user_level.current_level > old_level,
            'new_level': user_level.current_level,
            'current_exp': user_level.current_exp,
            'exp_to_next': user_level.exp_to_next_level
        }

    @staticmethod
    def get_level_rewards(level):
        rewards = []
        if level % 5 == 0:  # Every 5 levels
            rewards.append({
                'type': 'special_avatar_frame',
                'name': f'Level {level} Frame'
            })
        if level % 10 == 0:  # Every 10 levels
            rewards.append({
                'type': 'unique_title',
                'name': f'Level {level} Master'
            })
        return rewards
