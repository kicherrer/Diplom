import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { 
  Image, 
  VideoLibrary, 
  Description,
  FileDownload 
} from '@mui/icons-material';

interface AttachmentProps {
  type: 'image' | 'video' | 'file';
  url: string;
  name: string;
}

export const MessageAttachment: React.FC<AttachmentProps> = ({ type, url, name }) => {
  const renderAttachment = () => {
    switch (type) {
      case 'image':
        return (
          <Box
            component="img"
            src={url}
            alt={name}
            sx={{
              maxWidth: '100%',
              maxHeight: 200,
              borderRadius: 1,
              cursor: 'pointer'
            }}
            onClick={() => window.open(url, '_blank')}
          />
        );
      case 'video':
        return (
          <Box
            component="video"
            src={url}
            controls
            sx={{
              maxWidth: '100%',
              maxHeight: 200,
              borderRadius: 1
            }}
          />
        );
      case 'file':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Description />
            <Typography noWrap sx={{ flex: 1 }}>{name}</Typography>
            <IconButton 
              size="small" 
              onClick={() => window.open(url, '_blank')}
            >
              <FileDownload />
            </IconButton>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ mt: 1 }}>
      {renderAttachment()}
    </Box>
  );
};
