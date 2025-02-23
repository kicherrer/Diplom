import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  PlayCircleOutline,
  ExpandMore,
  ExpandLess,
  CheckCircle,
} from '@mui/icons-material';
import { MediaPlayer } from '../player/MediaPlayer';

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  watched?: boolean;
}

interface Season {
  id: string;
  number: number;
  episodes: Episode[];
}

interface SeriesViewerProps {
  title: string;
  description: string;
  seasons: Season[];
  onEpisodeWatch?: (episodeId: string) => void;
}

export const SeriesViewer: React.FC<SeriesViewerProps> = ({
  title,
  description,
  seasons,
  onEpisodeWatch,
}) => {
  const [selectedSeason, setSelectedSeason] = useState(0);
  const [expandedSeasons, setExpandedSeasons] = useState<string[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);

  const handleSeasonToggle = (seasonId: string) => {
    setExpandedSeasons((prev) =>
      prev.includes(seasonId)
        ? prev.filter((id) => id !== seasonId)
        : [...prev, seasonId]
    );
  };

  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode);
    onEpisodeWatch?.(episode.id);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
      </Grid>

      {currentEpisode && (
        <Grid item xs={12}>
          <MediaPlayer
            url={currentEpisode.videoUrl}
            title={currentEpisode.title}
            poster={currentEpisode.thumbnail}
            onNext={() => {
              // Implement next episode logic
            }}
          />
        </Grid>
      )}

      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Tabs
            value={selectedSeason}
            onChange={(_, newValue) => setSelectedSeason(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {seasons.map((season, index) => (
              <Tab key={season.id} label={`Season ${season.number}`} />
            ))}
          </Tabs>

          <List>
            {seasons[selectedSeason]?.episodes.map((episode) => (
              <ListItem
                key={episode.id}
                button
                selected={currentEpisode?.id === episode.id}
                onClick={() => handleEpisodeSelect(episode)}
              >
                <ListItemIcon>
                  {episode.watched ? (
                    <CheckCircle color="primary" />
                  ) : (
                    <PlayCircleOutline />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={episode.title}
                  secondary={`${Math.floor(episode.duration / 60)}min`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12} md={8}>
        {currentEpisode && (
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {currentEpisode.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {currentEpisode.description}
            </Typography>
          </Paper>
        )}
      </Grid>
    </Grid>
  );
};
