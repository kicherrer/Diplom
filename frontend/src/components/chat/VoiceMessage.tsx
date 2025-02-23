import React, { useState, useRef } from 'react';
import { Box, IconButton, LinearProgress, Typography } from '@mui/material';
import { PlayArrow, Pause, Mic, Stop } from '@mui/icons-material';
import { formatDuration } from '../../utils';

interface VoiceMessageProps {
  url?: string;
  onRecord?: (blob: Blob) => void;
  duration?: number;
}

export const VoiceMessage: React.FC<VoiceMessageProps> = ({ url, onRecord, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecord?.(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setProgress((current / total) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 200 }}>
      {url ? (
        <>
          <IconButton onClick={togglePlayback}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <Box sx={{ flex: 1 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ height: 4, borderRadius: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              {formatDuration(currentTime)} / {formatDuration(duration || 0)}
            </Typography>
          </Box>
          <audio
            ref={audioRef}
            src={url}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />
        </>
      ) : (
        <IconButton 
          color={isRecording ? 'error' : 'default'}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <Stop /> : <Mic />}
        </IconButton>
      )}
    </Box>
  );
};
