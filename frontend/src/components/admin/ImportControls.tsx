import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid
} from '@mui/material';

interface ImportJob {
  id: string;
  type: 'movie' | 'series' | 'video';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
}

export const ImportControls: React.FC = () => {
  const [tmdbId, setTmdbId] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [importJobs, setImportJobs] = useState<ImportJob[]>([]);

  const handleImportMovie = async () => {
    // Add implementation for movie import
  };

  const handleImportVideo = async () => {
    // Add implementation for video import
  };

  const handleImportTrending = async () => {
    // Add implementation for trending content import
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Import from TMDb
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                label="TMDb ID"
                value={tmdbId}
                onChange={(e) => setTmdbId(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={handleImportMovie}
              >
                Import Movie
              </Button>
            </Box>
            <Button
              variant="outlined"
              onClick={handleImportTrending}
              fullWidth
            >
              Import Trending Movies
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Import from YouTube
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                label="YouTube URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                size="small"
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleImportVideo}
              >
                Import
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Import Jobs
            </Typography>
            <List>
              {importJobs.map((job) => (
                <ListItem key={job.id}>
                  <ListItemText
                    primary={`Import ${job.type} #${job.id}`}
                    secondary={job.message}
                  />
                  <Box sx={{ minWidth: 100 }}>
                    <Chip
                      label={job.status}
                      color={
                        job.status === 'completed' ? 'success' :
                        job.status === 'failed' ? 'error' :
                        'primary'
                      }
                      size="small"
                    />
                  </Box>
                  {job.status === 'processing' && (
                    <Box sx={{ width: 200, ml: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={job.progress}
                      />
                    </Box>
                  )}
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
