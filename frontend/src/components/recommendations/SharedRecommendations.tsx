import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  AvatarGroup,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { PlayArrow, Share, ThumbUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { api, Movie } from '../../api/client';
import { useCachedQuery } from '../../hooks';

interface SharedRecommendation {
  movie: Movie;
  friends: Array<{
    id: string;
    username: string;
    avatar: string;
  }>;
  match_score: number;
  common_interests: string[];
}

export const SharedRecommendations: React.FC = () => {
  const { t } = useTranslation();
  const { data: recommendations } = useCachedQuery<SharedRecommendation[]>(
    'shared-recommendations',
    () => api.recommendations.getSharedRecommendations()
  );

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('recommendations.sharedWithFriends')}
      </Typography>
      
      <Grid container spacing={3}>
        {recommendations?.map((rec: SharedRecommendation) => (
          <Grid item xs={12} md={6} key={rec.movie.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card sx={{ display: 'flex', height: '100%' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 140 }}
                  image={rec.movie.poster_url}
                  alt={rec.movie.title}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">
                      {rec.movie.title}
                    </Typography>
                    <Chip 
                      label={`${rec.match_score}% Match`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('recommendations.sharedInterests')}:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                      {rec.common_interests.map((interest) => (
                        <Chip
                          key={interest}
                          label={interest}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <AvatarGroup max={4} sx={{ mr: 2 }}>
                      {rec.friends.map((friend) => (
                        <Tooltip key={friend.id} title={friend.username}>
                          <Avatar src={friend.avatar} />
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                    
                    <Box>
                      <IconButton size="small">
                        <ThumbUp />
                      </IconButton>
                      <IconButton size="small">
                        <Share />
                      </IconButton>
                      <IconButton size="small" color="primary">
                        <PlayArrow />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
