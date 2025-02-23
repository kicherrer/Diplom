import React, { useState } from 'react';
import {
  Paper,
  Box,
  TextField,
  Slider,
  Typography,
  Chip,
  Autocomplete,
  Button,
  IconButton,
  Collapse,
  Grid
} from '@mui/material';
import { FilterList, Search, Clear } from '@mui/icons-material';

interface SearchFilters {
  query: string;
  genres: string[];
  yearRange: [number, number];
  rating: [number, number];
  contentType: ('movie' | 'series' | 'video')[];
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  genres: string[];
  initialFilters?: Partial<SearchFilters>;
}

const currentYear = new Date().getFullYear();

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  genres,
  initialFilters
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    genres: [],
    yearRange: [1900, currentYear],
    rating: [0, 10],
    contentType: ['movie', 'series', 'video'],
    ...initialFilters
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      query: '',
      genres: [],
      yearRange: [1900, currentYear],
      rating: [0, 10],
      contentType: ['movie', 'series', 'video']
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search movies, series, videos..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <IconButton onClick={() => setShowFilters(!showFilters)}>
          <FilterList color={showFilters ? 'primary' : 'inherit'} />
        </IconButton>
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Genres</Typography>
              <Autocomplete
                multiple
                options={genres}
                value={filters.genres}
                onChange={(_, newValue) => setFilters({ ...filters, genres: newValue })}
                renderInput={(params) => <TextField {...params} />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip 
                      label={option} 
                      {...getTagProps({ index })}
                      sx={{ m: 0.5 }}
                    />
                  ))
                }
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Year Range</Typography>
              <Slider
                value={filters.yearRange}
                onChange={(_, newValue) => setFilters({ 
                  ...filters, 
                  yearRange: newValue as [number, number] 
                })}
                valueLabelDisplay="auto"
                min={1900}
                max={currentYear}
                marks={[
                  { value: 1900, label: '1900' },
                  { value: currentYear, label: currentYear.toString() }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Rating</Typography>
              <Slider
                value={filters.rating}
                onChange={(_, newValue) => setFilters({ 
                  ...filters, 
                  rating: newValue as [number, number] 
                })}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                step={0.5}
                marks={[
                  { value: 0, label: '0' },
                  { value: 10, label: '10' }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Content Type</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {(['movie', 'series', 'video'] as const).map((type) => (
                  <Chip
                    key={type}
                    label={type}
                    onClick={() => {
                      const types = filters.contentType.includes(type)
                        ? filters.contentType.filter(t => t !== type)
                        : [...filters.contentType, type];
                      setFilters({ ...filters, contentType: types });
                    }}
                    color={filters.contentType.includes(type) ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              startIcon={<Clear />}
              onClick={handleClear}
              sx={{ mr: 1 }}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};
