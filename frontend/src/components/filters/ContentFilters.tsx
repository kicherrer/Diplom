import React from 'react';
import { Paper, Stack, Chip, Slider, Typography, FormControl, Select, MenuItem } from '@mui/material';

interface FilterProps {
  genres: string[];
  rating: number[];
  year: number;
  onFilterChange: (type: string, value: any) => void;
}

export const ContentFilters: React.FC<FilterProps> = ({ genres, rating, year, onFilterChange }) => {
  const availableGenres = ['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller'];
  const currentYear = new Date().getFullYear();

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack spacing={2}>
        <div>
          <Typography gutterBottom>Genres</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {availableGenres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                onClick={() => onFilterChange('genres', genre)}
                color={genres.includes(genre) ? 'primary' : 'default'}
                sx={{ m: 0.5 }}
              />
            ))}
          </Stack>
        </div>

        <div>
          <Typography gutterBottom>Rating Range</Typography>
          <Slider
            value={rating}
            onChange={(_, value) => onFilterChange('rating', value)}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            step={0.5}
          />
        </div>

        <FormControl>
          <Typography gutterBottom>Release Year</Typography>
          <Select
            value={year}
            onChange={(e) => onFilterChange('year', e.target.value)}
            size="small"
          >
            {Array.from({ length: 50 }, (_, i) => currentYear - i).map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </Paper>
  );
};
