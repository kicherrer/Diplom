import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Skeleton,
  Chip
} from '@mui/material';
import { Movie } from '../../api/client';
import { OptimizedImage } from '../common/OptimizedImage';
import { useRecommendations } from '../../hooks/useRecommendations';

interface Props {
  userId: string;
  mood?: null;
}

export const RecommendationList: React.FC<Props> = ({ userId, mood }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { recommendations, isLoading } = useRecommendations(userId, { mood: mood || null });

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((key) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Skeleton variant="rectangular" height={200} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 2 }}
      >
        <Tab label="For You" />
        <Tab label="Based on Mood" />
        <Tab label="Similar Content" />
      </Tabs>

      <Grid container spacing={2}>
        {recommendations.map((movie) => (
          <Grid item xs={12} sm={6} md={3} key={movie.id}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 1,
                overflow: 'hidden',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  '& .movie-info': {
                    opacity: 1,
                  },
                },
              }}
            >
              <OptimizedImage
                src={movie.poster_url}
                alt={movie.title}
                width="100%"
                height={300}
              />
              <Box
                className="movie-info"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 2,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                }}
              >
                <Typography variant="subtitle1" color="white">
                  {movie.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                  {movie.genres.slice(0, 2).map((genre: string) => (
                    <Chip
                      key={genre}
                      label={genre}
                      size="small"
                      sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
