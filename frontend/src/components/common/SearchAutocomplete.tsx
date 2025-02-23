import React, { useState, useCallback } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import debounce from 'lodash/debounce';
import { Movie } from '../../types';
import { api } from '../../api/client';

interface SearchAutocompleteProps {
  onSelect: (movie: Movie | null) => void;
}

export const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = useCallback(
    debounce(async (query: string) => {
      if (query.length < 2) return;
      setLoading(true);
      try {
        const response = await api.movies.search(query);
        setOptions(response.data);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      onChange={(_, value) => onSelect(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search movies..."
          onChange={(e) => fetchResults(e.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress color="inherit" size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              variant="rounded"
              src={option.poster_url}
              sx={{ width: 40, height: 56 }}
            />
            <Box>
              <Typography variant="body1">{option.title}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(option.release_date).getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    />
  );
};
