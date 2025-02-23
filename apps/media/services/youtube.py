from googleapiclient.discovery import build
from django.conf import settings
from apps.media.models import Video
from datetime import datetime
import isodate

class YouTubeService:
    def __init__(self):
        self.youtube = build('youtube', 'v3', developerKey=settings.YOUTUBE_API_KEY)

    def import_video(self, video_id):
        try:
            video_response = self.youtube.videos().list(
                part='snippet,contentDetails,statistics',
                id=video_id
            ).execute()

            if not video_response['items']:
                return None

            video_data = video_response['items'][0]
            snippet = video_data['snippet']
            
            video_obj, created = Video.objects.update_or_create(
                youtube_id=video_id,
                defaults={
                    'title': snippet['title'],
                    'original_title': snippet['title'],
                    'overview': snippet.get('description', ''),
                    'poster_url': snippet['thumbnails']['high']['url'],
                    'channel_name': snippet['channelTitle'],
                    'genres': snippet.get('tags', [])[:5],
                    'release_date': datetime.strptime(snippet['publishedAt'].split('T')[0], '%Y-%m-%d'),
                    'view_count': int(video_data['statistics'].get('viewCount', 0)),
                    'rating': float(video_data['statistics'].get('likeCount', 0)) / 100,
                    'vote_count': int(video_data['statistics'].get('likeCount', 0)),
                    'duration': int(isodate.parse_duration(video_data['contentDetails']['duration']).total_seconds()),
                    'mood_tags': self._extract_mood_tags(snippet.get('tags', []))
                }
            )
            return video_obj
        except Exception as e:
            raise Exception(f"Error importing video {video_id}: {str(e)}")

    def _extract_mood_tags(self, tags):
        mood_keywords = {
            'happy': ['funny', 'comedy', 'happiness', 'joy'],
            'sad': ['drama', 'emotional', 'sad'],
            'excited': ['action', 'adventure', 'thriller'],
            'relaxed': ['ambient', 'meditation', 'relaxing']
        }
        
        video_moods = []
        for mood, keywords in mood_keywords.items():
            if any(keyword in tag.lower() for tag in tags for keyword in keywords):
                video_moods.append(mood)
        return video_moods
