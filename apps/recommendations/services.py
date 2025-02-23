from typing import List, Dict
from django.db.models import Count, Avg, Q
from apps.content.models import Movie, Genre
from apps.users.models import User, UserPreference
from apps.analytics.models import ViewEvent
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

class RecommendationService:
    @staticmethod
    def get_personalized_recommendations(user: User, limit: int = 20) -> List[Movie]:
        # Get user preferences
        preferences = UserPreference.objects.filter(user=user).first()
        favorite_genres = preferences.favorite_genres.all() if preferences else []

        # Get user's viewing history
        watched_movies = ViewEvent.objects.filter(
            user=user,
            content_type='movie'
        ).values_list('content_id', flat=True)

        # Base query excluding watched movies
        base_query = Movie.objects.exclude(id__in=watched_movies)

        if favorite_genres:
            # Get movies in favorite genres
            genre_movies = base_query.filter(
                genres__in=favorite_genres
            ).annotate(
                match_count=Count('genres', filter=Q(genres__in=favorite_genres))
            ).order_by('-match_count', '-vote_average')
            
            recommendations = list(genre_movies[:limit])
            
            if len(recommendations) < limit:
                # Fill remaining slots with popular movies
                remaining = limit - len(recommendations)
                popular_movies = base_query.exclude(
                    id__in=[m.id for m in recommendations]
                ).order_by('-vote_average')[:remaining]
                recommendations.extend(popular_movies)
        else:
            # If no preferences, return popular movies
            recommendations = list(
                base_query.order_by('-vote_average')[:limit]
            )

        return recommendations

    @staticmethod
    def get_similar_users(user: User, limit: int = 5) -> List[Dict]:
        # Get all users' genre preferences
        all_genres = set(Genre.objects.values_list('id', flat=True))
        user_vectors = {}

        for u in User.objects.all():
            vector = np.zeros(len(all_genres))
            
            # Add genre preferences
            prefs = UserPreference.objects.filter(user=u).first()
            if prefs:
                for genre in prefs.favorite_genres.all():
                    vector[genre.id - 1] = 1
            
            # Add weighted genres from viewing history
            views = ViewEvent.objects.filter(user=u, content_type='movie')
            for view in views:
                for genre in view.content_object.genres.all():
                    vector[genre.id - 1] += 0.5

            user_vectors[u.id] = vector

        if user.id not in user_vectors:
            return []

        # Calculate similarities
        user_vector = user_vectors[user.id]
        similarities = []
        
        for other_id, other_vector in user_vectors.items():
            if other_id != user.id:
                sim = cosine_similarity(
                    user_vector.reshape(1, -1),
                    other_vector.reshape(1, -1)
                )[0][0]
                similarities.append((other_id, sim))

        # Sort by similarity and get top users
        similar_users = sorted(similarities, key=lambda x: x[1], reverse=True)[:limit]
        
        return [
            {
                'user': User.objects.get(id=uid),
                'similarity_score': score
            }
            for uid, score in similar_users
        ]
