import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ExperienceGainPopup } from './ExperienceGainPopup';

interface LevelProgressProps {
  level: number;
  currentExp: number;
  expToNext: number;
  totalExp: number;
  onExpGain?: (callback: (amount: number, action: string) => void) => () => void;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  currentExp,
  expToNext,
  totalExp,
  onExpGain
}) => {
  const { t } = useTranslation();
  const progress = (currentExp / expToNext) * 100;
  const [expPopup, setExpPopup] = useState<{ amount: number; action: string } | null>(null);

  const handleExpGain = useCallback((amount: number, action: string) => {
    setExpPopup({ amount, action });
  }, []);

  React.useEffect(() => {
    if (onExpGain) {
      return onExpGain(handleExpGain);
    }
  }, [onExpGain, handleExpGain]);

  return (
    <>
      <Paper 
        sx={{ 
          p: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h4" component="span" color="primary">
              {level}
            </Typography>
          </motion.div>
          <Typography variant="h6" sx={{ ml: 1 }}>
            {t('profile.level')}
          </Typography>
          <Tooltip title={t('profile.levelInfo')}>
            <IconButton size="small" sx={{ ml: 1 }}>
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {currentExp} / {expToNext} XP
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              mt: 1,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              },
            }}
          />
        </Box>

        <Typography variant="caption" color="text.secondary">
          {t('profile.totalExp')}: {totalExp} XP
        </Typography>

        {/* Level up animation */}
        <AnimatePresence>
          {progress >= 100 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.7)',
              }}
            >
              <Typography variant="h4" color="primary">
                {t('profile.levelUp')}!
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>

      {expPopup && (
        <ExperienceGainPopup
          amount={expPopup.amount}
          action={expPopup.action}
          onComplete={() => setExpPopup(null)}
        />
      )}
    </>
  );
};
