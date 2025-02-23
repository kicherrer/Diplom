import React from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedFilterContainerProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export const AnimatedFilterContainer: React.FC<AnimatedFilterContainerProps> = ({
  children,
  isVisible
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const variants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      height: 0,
      y: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          style={{
            position: isMobile ? 'fixed' : 'relative',
            top: isMobile ? '0' : 'auto',
            left: isMobile ? '0' : 'auto',
            right: isMobile ? '0' : 'auto',
            zIndex: isMobile ? 1100 : 'auto',
            backgroundColor: theme.palette.background.paper,
            overflow: 'hidden'
          }}
        >
          <Box sx={{ 
            p: 2,
            maxHeight: isMobile ? '80vh' : 'none',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            {children}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
