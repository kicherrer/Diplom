import React, { useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  hasMore,
  isLoading,
  children,
}) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading]);

  return (
    <>
      {children}
      {(hasMore || isLoading) && (
        <Box
          ref={ref}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            width: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
};
