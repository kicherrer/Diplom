import React from 'react';
import { Card, CardContent, Skeleton, Box, Grid } from '@mui/material';

interface MovieSkeletonProps {
  count?: number;
}

export const MovieSkeleton: React.FC<MovieSkeletonProps> = ({ count = 4 }) => {
  return (
    <Grid container spacing={2}>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ height: '100%' }}>
            <Skeleton
              variant="rectangular"
              height={400}
              animation="wave"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                transform: 'none',
              }}
            />
            <CardContent>
              <Skeleton
                variant="text"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  height: 32,
                  mb: 1,
                }}
              />
              <Skeleton
                variant="text"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  height: 20,
                }}
                width="60%"
              />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
