import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import { CloudUpload, Search } from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import { api } from '../../../api/client';
import { API_URLS } from '../../../config/api.config';

export const ImportContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const { mutate: importMovie, isLoading: isImporting } = useMutation(
    (tmdbId: string) => api.admin.importTMDB(parseInt(tmdbId, 10)), // Convert string to number
    {
      onSuccess: () => {
        // Handle success
      }
    }
  );

  const handleSearch = async () => {
    try {
      const response = await api.admin.searchTMDB(searchQuery);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Импорт контента
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Поиск фильма"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleSearch}
          >
            Найти
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {searchResults.map((movie) => (
          <Grid item xs={12} sm={6} md={4} key={movie.id}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={`${API_URLS.TMDB.IMAGE_BASE}/${API_URLS.TMDB.POSTER_SIZE}${movie.poster_path}`}
                alt={movie.title}
              />
              <CardContent>
                <Typography variant="h6" noWrap>
                  {movie.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(movie.release_date).getFullYear()}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    mb: 2
                  }}
                >
                  {movie.overview}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={`Рейтинг: ${movie.vote_average}`}
                    color="primary"
                  />
                  <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => importMovie(movie.id)}
                    disabled={isImporting}
                  >
                    Импортировать
                  </Button>
                </Box>
                {isImporting && (
                  <LinearProgress sx={{ mt: 2 }} />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
