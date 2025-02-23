import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface TypingIndicatorProps {
  username: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ username }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
      <Typography variant="caption" color="text.secondary">
        {username} is typing
      </Typography>
      <Box sx={{ display: 'flex', ml: 1 }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -5, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 0.6,
              delay: i * 0.2,
              repeat: Infinity,
            }}
            style={{ 
              width: 4,
              height: 4,
              margin: '0 2px',
              borderRadius: '50%',
              background: 'currentColor',
              display: 'inline-block',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};
