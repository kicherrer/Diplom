from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from apps.media.models import Movie, Series, Video
from apps.recommendations.models import UserPreference, UserActivity
from collections import defaultdict

class ContentRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        
    def get_movie_recommendations(self, user, limit=10):
        # Get user preferences and history
        user_pref = UserPreference.objects.get(user=user)
        watched_movies = UserActivity.objects.filter(
            user=user, 
            content_type='movie'
        ).values_list('content_id', flat=True)

        # Get all movies except watched ones
        movies = Movie.objects.exclude(id__in=watched_movies)
        
        if not movies:
            return []

        # Prepare content features
        content_features = []
        for movie in movies:
            features = (
                f"{movie.title} {movie.overview} "
                f"{' '.join(movie.genres)} "
                f"{' '.join(movie.mood_tags)}"
            )
            content_features.append(features)

        # Transform features to vectors
        feature_matrix = self.vectorizer.fit_transform(content_features)
        
        # Calculate user profile vector based on preferences
        user_profile = self._calculate_user_profile(user_pref)
        
        # Calculate similarities
        similarities = cosine_similarity(
            user_profile.reshape(1, -1),
            feature_matrix
        )[0]

        # Get top recommendations
        top_indices = similarities.argsort()[-limit:][::-1]
        return [movies[i] for i in top_indices]

    def _calculate_user_profile(self, user_pref):
        profile_features = (
            f"{' '.join(user_pref.favorite_genres)} "
            f"{user_pref.current_mood if user_pref.current_mood else ''}"
        )
        return self.vectorizer.transform([profile_features]).toarray()[0]
