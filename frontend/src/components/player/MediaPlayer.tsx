import React, { useState, useRef } from 'react';
import { Box, IconButton, Slider, Typography, Paper, Menu, MenuItem } from '@mui/material';
import {
  PlayArrow, Pause, VolumeUp, VolumeMute, 
  Fullscreen, Settings, Speed, Subtitles,
  SkipNext, HighQuality, RepeatOne
} from '@mui/icons-material';
import { formatDuration } from '../../utils';

interface MediaPlayerProps {
  url: string;
  title: string;
  poster?: string;
  subtitles?: Array<{ label: string; src: string }>;
  qualities?: Array<{ label: string; src: string }>;
  onNext?: () => void;
  autoplay?: boolean;
  onProgress?: (progress: number) => void;
}

export const MediaPlayer: React.FC<MediaPlayerProps> = ({
  url,
  title,
  poster,
  subtitles = [],
  qualities = [],
  onNext,
  autoplay = false,
  onProgress
}) => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(newProgress);
      onProgress?.(newProgress);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleVolumeChange = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setVolume(value / 100);
    if (videoRef.current) {
      videoRef.current.volume = value / 100;
    }
  };

  const handleProgressChange = (_: Event, newValue: number | number[]) => {
    const value = newValue as number;
    if (videoRef.current) {
      const newTime = (value / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(value);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <Paper 
      elevation={8}
      onMouseEnter={() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000);
      }}
      sx={{ 
        position: 'relative',
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <video
        ref={videoRef}
        src={url}
        poster={poster}
        style={{ width: '100%', display: 'block' }}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration);
          }
        }}
        autoPlay={autoplay}
      >
        {subtitles.map((sub) => (
          <track 
            key={sub.label}
            kind="subtitles"
            src={sub.src}
            label={sub.label}
          />
        ))}
      </video>

      {showControls && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          <Slider
            value={progress}
            onChange={handleProgressChange}
            sx={{ color: 'primary.main' }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', width: 200 }}>
              <IconButton 
                onClick={() => setVolume(prev => prev === 0 ? 1 : 0)}
                sx={{ color: 'white' }}
              >
                {volume === 0 ? <VolumeMute /> : <VolumeUp />}
              </IconButton>
              <Slider
                value={volume * 100}
                onChange={handleVolumeChange}
                sx={{ color: 'white', ml: 1 }}
              />
            </Box>

            <Typography sx={{ color: 'white', flex: 1 }}>
              {formatDuration(videoRef.current?.currentTime || 0)} / 
              {formatDuration(duration)}
            </Typography>

            {onNext && (
              <IconButton onClick={onNext} sx={{ color: 'white' }}>
                <SkipNext />
              </IconButton>
            )}

            <IconButton 
              onClick={(e) => setSettingsAnchor(e.currentTarget)}
              sx={{ color: 'white' }}
            >
              <Settings />
            </IconButton>

            <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>
      )}

      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
      >
        <MenuItem>
          <Speed sx={{ mr: 1 }} /> Скорость воспроизведения
        </MenuItem>
        <MenuItem>
          <HighQuality sx={{ mr: 1 }} /> Качество видео
        </MenuItem>
        <MenuItem>
          <Subtitles sx={{ mr: 1 }} /> Субтитры
        </MenuItem>
        <MenuItem>
          <RepeatOne sx={{ mr: 1 }} /> Повтор
        </MenuItem>
      </Menu>
    </Paper>
  );
};
