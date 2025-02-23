import React, { useState } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Paper,
  Box,
  Slider,
  Typography,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import { MobileFilterPanel } from './MobileFilterPanel';

interface FilterProps {
  filters: {
    genres: string[];
    rating: [number, number];
    sortBy: 'match' | 'rating' | 'date';
    mood: string | null;
  };
  onFilterChange: (filters: any) => void;
  availableGenres: string[];
  availableMoods: string[];
}

export const RecommendationFilters: React.FC<FilterProps> = (props) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { filters, onFilterChange, availableGenres, availableMoods } = props;

  const filterContent = (
    <>
      <Typography variant="h6" gutterBottom>
        Filter Recommendations
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Genres</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {availableGenres.map((genre) => (
            <Chip
              key={genre}
              label={genre}
              onClick={() => {
                const newGenres = filters.genres.includes(genre)
                  ? filters.genres.filter(g => g !== genre)
                  : [...filters.genres, genre];
                onFilterChange({ ...filters, genres: newGenres });
              }}
              color={filters.genres.includes(genre) ? 'primary' : 'default'}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Rating Range</Typography>
        <Slider
          value={filters.rating}
          onChange={(_, newValue) => 
            onFilterChange({ ...filters, rating: newValue as [number, number] })}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          step={0.5}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Current Mood</InputLabel>
          <Select
            value={filters.mood || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              mood: e.target.value || null 
            })}
            label="Current Mood"
          >
            <MenuItem value="">Any Mood</MenuItem>
            {availableMoods.map((mood) => (
              <MenuItem key={mood} value={mood}>{mood}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <FormControl fullWidth>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({
            ...filters,
            sortBy: e.target.value
          })}
          label="Sort By"
        >
          <MenuItem value="match">Best Match</MenuItem>
          <MenuItem value="rating">Highest Rating</MenuItem>
          <MenuItem value="date">Release Date</MenuItem>
        </Select>
      </FormControl>
    </>
  );

  if (isMobile) {
    return (
      <MobileFilterPanel
        open={isMobileOpen}
        onOpen={() => setIsMobileOpen(true)}
        onClose={() => setIsMobileOpen(false)}
      >
        {filterContent}
      </MobileFilterPanel>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {filterContent}
    </Paper>
  );
};
