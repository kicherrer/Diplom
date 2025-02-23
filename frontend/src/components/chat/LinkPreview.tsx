import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Skeleton, Link } from '@mui/material';
import { api } from '../../api/client';

interface LinkPreviewProps {
  url: string;
}

interface PreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const response = await api.chat.getLinkPreview(url);
        setPreview(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (error) return null;
  
  return (
    <Link href={url} target="_blank" underline="none">
      <Paper 
        sx={{ 
          mt: 1,
          overflow: 'hidden',
          display: 'flex',
          height: 100,
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        {loading ? (
          <Box sx={{ p: 1, width: '100%' }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
          </Box>
        ) : (
          <>
            <Box sx={{ flex: 1, p: 1 }}>
              <Typography variant="subtitle2" noWrap>
                {preview?.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {preview?.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {preview?.siteName}
              </Typography>
            </Box>
            {preview?.image && (
              <Box
                component="img"
                src={preview.image}
                sx={{
                  width: 100,
                  height: '100%',
                  objectFit: 'cover'
                }}
                alt={preview.title}
              />
            )}
          </>
        )}
      </Paper>
    </Link>
  );
};
