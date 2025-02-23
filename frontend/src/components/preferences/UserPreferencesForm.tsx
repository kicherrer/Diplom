import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../api/client';
import { RootState } from '../../store';

const AVAILABLE_GENRES: string[] = [
  'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 
  'Thriller', 'Sci-Fi', 'Documentary'
];

const MOOD_OPTIONS: string[] = [
  'Happy', 'Relaxed', 'Excited', 'Thoughtful', 
  'Melancholic', 'Inspired'
];

export const UserPreferencesForm: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [currentMood, setCurrentMood] = useState<string>('');
  const [contentRating, setContentRating] = useState<[number, number]>([0, 10]);
  const userId = useSelector((state: RootState) => state.auth.user?.id ?? '');

  const handleGenreClick = (genre: string) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleSave = async () => {
    if (!userId) return;
    try {
      await api.users.update(userId.toString(), {
        favorite_genres: selectedGenres,
        current_mood: currentMood,
        rating_range: contentRating
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Preferences
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Favorite Genres
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {AVAILABLE_GENRES.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                onClick={() => handleGenreClick(genre)}
                color={selectedGenres.includes(genre) ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Current Mood</InputLabel>
            <Select
              value={currentMood}
              onChange={(e) => setCurrentMood(e.target.value)}
              label="Current Mood"
            >
              {MOOD_OPTIONS.map((mood) => (
                <MenuItem key={mood} value={mood}>{mood}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>
            Content Rating Range
          </Typography>
          <Slider
            value={contentRating}
            onChange={(_, newValue) => setContentRating(newValue as [number, number])}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={0.5}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            fullWidth
          >
            Save Preferences
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
