import { api } from '../api/client';

export class RecommendationService {
  async getPersonalizedRecommendations(userId: string) {
    const userPreferences = await this.getUserPreferences(userId);
    const watchHistory = await this.getWatchHistory(userId);
    
    return api.recommendations.getPersonalized({
      preferences: userPreferences,
      history: watchHistory,
      limit: 20
    });
  }

  async getMoodBasedRecommendations(mood: string) {
    return api.recommendations.getByMood(mood);
  }

  async getSimilarContent(contentId: string, contentType: 'movie' | 'series') {
    return api.recommendations.getSimilar(contentId, contentType);
  }

  private async getUserPreferences(userId: string) {
    return api.users.getPreferences(userId);
  }

  private async getWatchHistory(userId: string) {
    return api.users.getWatchHistory(userId);
  }
}

export const recommendationService = new RecommendationService();
