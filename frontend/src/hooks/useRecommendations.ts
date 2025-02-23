import { useState, useEffect } from 'react';
import { recommendationService } from '../services/RecommendationService';
import { useCachedQuery } from './useCachedQuery';

interface RecommendationResponse {
  data: any[];
}

export function useRecommendations(userId: string, options = { mood: null }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [similarContent, setSimilarContent] = useState([]);

  const { data: personalizedRecs } = useCachedQuery<RecommendationResponse>(
    'personalized',
    () => recommendationService.getPersonalizedRecommendations(userId)
  );
  
  const { data: moodRecs } = useCachedQuery<RecommendationResponse>(
    `mood-${options.mood}`,
    () => recommendationService.getMoodBasedRecommendations(options.mood || ''),
    { enabled: !!options.mood }
  );
  useEffect(() => {
    if (options.mood && moodRecs && 'data' in moodRecs) {
      setRecommendations(moodRecs.data);
    } else if (personalizedRecs && 'data' in personalizedRecs) {
      setRecommendations(personalizedRecs.data);
    }
  }, [personalizedRecs, moodRecs, options.mood]);

  const getSimilarContent = async (contentId: string, contentType: 'movie' | 'series') => {
    try {
      const similar = await recommendationService.getSimilarContent(contentId, contentType);
      setSimilarContent(similar.data);
    } catch (error) {
      console.error('Error fetching similar content:', error);
    }
  };

  return {
    recommendations,
    similarContent,
    getSimilarContent,
    isLoading: !personalizedRecs && !moodRecs
  };
}
