import React, { useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Grid, Chip, Rating } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { api, Movie } from '../../api/client';
import { RootState } from '../../store';
import { useCachedQuery } from '../../hooks/useCachedQuery';
import { RecommendationFilters } from './RecommendationFilters';

interface RecommendationResponse {
  items: Movie[];
  total: number;
}

interface Filters {
  genres: string[];
  rating: [number, number];
  sortBy: 'match' | 'rating' | 'date';
  mood: string | null;
}

export const PersonalizedContent: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const { data: response } = useCachedQuery<RecommendationResponse>(
    `personalized-${userId}`,
    () => api.recommendations.getPersonalized({ userId })
  );

  const recommendations = response?.items || [];

  const [filters, setFilters] = useState<Filters>({
    genres: [],
    rating: [0, 10] as [number, number],
    sortBy: 'match',
    mood: null
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const itemAnimation = {
    initial: { scale: 0.6, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.6, opacity: 0 },
    transition: { duration: 0.2 }
  };

  const filteredRecommendations = useMemo(() => {
    if (!recommendations?.length) return [];
    
    return recommendations
      .filter(item => {
        const matchesGenres = filters.genres.length === 0 || 
          filters.genres.some(g => item.genres.includes(g));
        const matchesRating = item.rating >= filters.rating[0] && 
          item.rating <= filters.rating[1];
        const matchesMood = !filters.mood || 
          item.mood_tags.includes(filters.mood);
        
        return matchesGenres && matchesRating && matchesMood;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'match':
            return (b.match_score || 0) - (a.match_score || 0);
          case 'rating':
            return b.rating - a.rating;
          case 'date':
            return new Date(b.release_date).getTime() - 
              new Date(a.release_date).getTime();
          default:
            return 0;
        }
      });
  }, [recommendations, filters]);

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recommended for You
      </Typography>

      <RecommendationFilters
        filters={filters}
        onFilterChange={setFilters}
        availableGenres={availableGenres}
        availableMoods={availableMoods}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={3}>
          <AnimatePresence mode="popLayout">
            {filteredRecommendations.map((item: Movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <motion.div
                  layout
                  {...itemAnimation}
                >
                  <Card sx={{ height: '100%' }}>
                    <CardMedia
                      component="img"
                      height={240}
                      image={item.poster_url}
                      alt={item.title}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 1 }}>
                        {item.genres.map((genre: string) => (
                          <Chip key={genre} label={genre} size="small" />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={item.rating / 2} precision={0.5} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {item.match_score}% Match
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </motion.div>
    </Box>
  );
};

const availableGenres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Horror',
  'Romance', 'Sci-Fi', 'Thriller', 'Documentary'
];

const availableMoods = [
  'Happy', 'Excited', 'Relaxed', 'Thoughtful',
  'Melancholic', 'Inspired'
];
