import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSound } from '../../hooks/useSound';

interface ExperienceGainPopupProps {
  amount: number;
  action: string;
  onComplete: () => void;
}

export const ExperienceGainPopup: React.FC<ExperienceGainPopupProps> = ({
  amount,
  action,
  onComplete
}) => {
  const { play: playExpSound } = useSound('/sounds/exp-gain.mp3', { volume: 0.5 });
  const { t } = useTranslation();

  React.useEffect(() => {
    playExpSound();
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete, playExpSound]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.3 }}
        style={{
          position: 'fixed',
          bottom: '20%',
          right: '5%',
          zIndex: 1500,
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 4,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle1">
            {t('experience.gained')}
          </Typography>
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: [1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h4" color="primary">
              +{amount} XP
            </Typography>
          </motion.div>
          <Typography variant="caption" color="text.secondary">
            {t(`experience.actions.${action}`)}
          </Typography>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};
