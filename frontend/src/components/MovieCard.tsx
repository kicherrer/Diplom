import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Movie } from '../types';

interface Props {
  movie: Movie;
  onWatch?: (movie: Movie) => void;
  onCreateRoom?: (movie: Movie) => void;
}

export const MovieCard: React.FC<Props> = ({ movie, onWatch, onCreateRoom }) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="440"
        image={movie.poster_url}
        alt={movie.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {movie.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {movie.overview.substring(0, 150)}...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rating: {movie.rating}/10
        </Typography>
      </CardContent>
      <CardActions>
        {onWatch && (
          <Button size="small" onClick={() => onWatch(movie)}>
            Watch
          </Button>
        )}
        {onCreateRoom && (
          <Button size="small" onClick={() => onCreateRoom(movie)}>
            Watch with Friends
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
