import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Grid,
  Rating
} from '@mui/material';
import { motion } from 'framer-motion';
import InfoIcon from '@mui/icons-material/Info';
import { Movie } from '../../api/client';
import { ContentRating } from '../ratings/ContentRating';

interface EnhancedRecommendationsProps {
  recommendations: Movie[];
  onMovieSelect: (movie: Movie) => void;
}

export const EnhancedRecommendations: React.FC<EnhancedRecommendationsProps> = ({
  recommendations,
  onMovieSelect
}) => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Grid container spacing={3}>
        {recommendations.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <motion.div variants={item}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.poster_url}
                  alt={movie.title}
                  onClick={() => onMovieSelect(movie)}
                  sx={{ cursor: 'pointer' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    {movie.genres.map((genre) => (
                      <Chip key={genre} label={genre} size="small" />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Rating value={movie.rating / 2} precision={0.5} readOnly />
                    <IconButton 
                      size="small"
                      onClick={() => setExpandedId(expandedId === movie.id ? null : movie.id)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Box>
                  <Collapse in={expandedId === movie.id}>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {movie.overview}
                      </Typography>
                      <ContentRating
                        contentId={movie.id}
                        contentType="movie"
                      />
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};
