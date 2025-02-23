import React, { useState } from 'react';
import { API_URLS } from '../../../config/api.config';
import { api } from '../../../api/client';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Dialog,
} from '@mui/material';
import {
  Search,
  CloudDownload,
  YouTube,
  Language,
  Info,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { externalApi } from '../../../services/externalApi';

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface SearchState {
  query: string;
  activeTab: number;
  selectedMovie: TMDBMovie | null;
}

export const MovieSearch: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    query: '',
    activeTab: 0,
    selectedMovie: null
  });

  const { data: searchResults, isLoading } = useQuery(
    ['movieSearch', state.query, state.activeTab],
    async () => {
      if (!state.query) return [];
      
      if (state.activeTab === 0) {
        const result = await externalApi.tmdb.searchMovies(state.query);
        return result.results;
      } else {
        const result = await externalApi.kinopoisk.searchMovies(state.query);
        return result.films.map((film: any) => ({
          id: film.filmId,
          title: film.nameRu,
          original_title: film.nameEn,
          poster_path: film.posterUrl,
          release_date: film.year.toString(),
          vote_average: film.rating,
          overview: film.description || ''
        }));
      }
    },
    { enabled: state.query.length > 2 }
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Trigger search
  };

  const handleImport = async (movie: TMDBMovie) => {
    try {
      await api.admin.importTMDB(movie.id);
      // Combine data and import
      // Implementation depends on your backend API
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const getImageUrl = (path: string | null) => {
    if (!path) return '';
    return `${API_URLS.TMDB.IMAGE_BASE}/${API_URLS.TMDB.POSTER_SIZE}${path}`;
  };

  return (
    <Box>
      <Paper component="form" onSubmit={handleSearchSubmit} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <TextField
              fullWidth
              label="Поиск фильмов"
              value={state.query}
              onChange={(e) => setState({ ...state, query: e.target.value })}
            />
          </Grid>
          <Grid item>
            <Tabs
              value={state.activeTab}
              onChange={(_, value) => setState({ ...state, activeTab: value })}
            >
              <Tab value={0} label="TMDB" />
              <Tab value={1} label="Кинопоиск" />
            </Tabs>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Search />}
              type="submit"
            >
              Поиск
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {searchResults?.map((movie: TMDBMovie) => (
            <Grid item xs={12} sm={6} md={4} key={movie.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="400"
                  image={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {movie.original_title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip 
                      label={movie.release_date.split('-')[0]}
                      size="small"
                    />
                    <Chip 
                      label={`Рейтинг: ${movie.vote_average}`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2
                    }}
                  >
                    {movie.overview}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => setState({ ...state, selectedMovie: movie })}
                      >
                        <Info />
                      </IconButton>
                      <IconButton
                        size="small"
                        component="a"
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          `${movie.title} ${movie.release_date.split('-')[0]} трейлер`
                        )}`}
                        target="_blank"
                      >
                        <YouTube />
                      </IconButton>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<CloudDownload />}
                      onClick={() => handleImport(movie)}
                    >
                      Импортировать
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Movie Details Dialog */}
      <Dialog
        open={Boolean(state.selectedMovie)}
        onClose={() => setState({ ...state, selectedMovie: null })}
        maxWidth="md"
        fullWidth
      >
        {state.selectedMovie && (
          // Implement movie details view
          <Box p={3}>
            <Typography variant="h5">{state.selectedMovie.title}</Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};
