from rest_framework import serializers
from apps.users.models import Achievement, UserAchievement, WatchHistory, UserFriend
from apps.media.models import Movie, Series, Video

class AchievementSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'icon', 'achievement_type', 
                 'required_value', 'points', 'progress']
    
    def get_progress(self, obj):
        user = self.context['request'].user
        try:
            user_achievement = UserAchievement.objects.get(
                user=user, 
                achievement=obj
            )
            return {
                'current': user_achievement.current_value,
                'required': obj.required_value,
                'percentage': (user_achievement.current_value / obj.required_value) * 100,
                'unlocked': user_achievement.current_value >= obj.required_value,
                'unlocked_at': user_achievement.unlocked_at if user_achievement.current_value >= obj.required_value else None
            }
        except UserAchievement.DoesNotExist:
            return {
                'current': 0,
                'required': obj.required_value,
                'percentage': 0,
                'unlocked': False,
                'unlocked_at': None
            }

class WatchHistorySerializer(serializers.ModelSerializer):
    content_title = serializers.SerializerMethodField()
    content_poster = serializers.SerializerMethodField()

    class Meta:
        model = WatchHistory
        fields = ['id', 'content_type', 'content_id', 'watched_at', 
                 'progress', 'completed', 'content_title', 'content_poster']

    def get_content_title(self, obj):
        model_map = {
            'movie': Movie,
            'series': Series,
            'video': Video
        }
        model = model_map.get(obj.content_type)
        if model:
            content = model.objects.filter(id=obj.content_id).first()
            return content.title if content else None
        return None

    def get_content_poster(self, obj):
        model_map = {
            'movie': Movie,
            'series': Series,
            'video': Video
        }
        model = model_map.get(obj.content_type)
        if model:
            content = model.objects.filter(id=obj.content_id).first()
            return content.poster_url if content else None
        return None

class UserFriendSerializer(serializers.ModelSerializer):
    friend_details = serializers.SerializerMethodField()

    class Meta:
        model = UserFriend
        fields = ['id', 'friend', 'status', 'created_at', 'friend_details']

    def get_friend_details(self, obj):
        return {
            'id': obj.friend.id,
            'username': obj.friend.username,
            'avatar': obj.friend.avatar.url if obj.friend.avatar else None
        }
