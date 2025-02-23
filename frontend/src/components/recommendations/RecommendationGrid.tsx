import React from 'react';
import { Grid, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { OptimizedImage } from '../common/OptimizedImage';
import { VirtualList } from '../common/VirtualList';
import { useOptimizedQuery } from '../../hooks/useOptimizedQuery';
import { recommendationService } from '../../services/RecommendationService';

interface RecommendationItem {
  posterUrl: string;
  title: string;
  matchScore: number;
}

interface RecommendationGridProps {
  userId: string;
  mood?: string;
}

export const RecommendationGrid: React.FC<RecommendationGridProps> = ({ userId, mood }) => {
  const theme = useTheme();
  
  const { data: recommendations, loading } = useOptimizedQuery<RecommendationItem[]>(
    `recommendations-${userId}-${mood}`,
    async () => {
      const response = await (mood 
        ? recommendationService.getMoodBasedRecommendations(mood)
        : recommendationService.getPersonalizedRecommendations(userId));
      return response.data;
    }
  );

  return (
    <VirtualList
      items={recommendations || []}
      itemHeight={300}
      containerHeight={800}
      renderItem={(item: RecommendationItem, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease-in-out',
                  }
                }}
              >
                <OptimizedImage
                  src={item.posterUrl}
                  alt={item.title}
                  width="100%"
                  height={250}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2,
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  }}
                >
                  <Typography variant="subtitle1" color="white">
                    {item.title}
                  </Typography>
                  <Typography variant="caption" color="grey.300">
                    Match: {item.matchScore}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      )}
    />
  );
};
