import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface AchievementCardProps {
  achievement: {
    name: string;
    description: string;
    icon: string;
    points: number;
    progress: {
      current: number;
      required: number;
      percentage: number;
      unlocked: boolean;
      unlocked_at: string | null;
    };
  };
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        sx={{ 
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            transform: 'translateY(-4px)',
            transition: 'transform 0.2s'
          }
        }}
      >
        {achievement.progress.unlocked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <Box
              component="img"
              src="/images/achievement-unlocked.png"
              sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 40,
                height: 40
              }}
            />
          </motion.div>
        )}
        
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              component="img"
              src={achievement.icon}
              sx={{ width: 48, height: 48, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">{achievement.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {achievement.points} {t('achievements.points')}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 2 }}>
            {achievement.description}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption">
                {achievement.progress.current} / {achievement.progress.required}
              </Typography>
              <Typography variant="caption">
                {Math.round(achievement.progress.percentage)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={achievement.progress.percentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'action.hover',
                '& .MuiLinearProgress-bar': {
                  bgcolor: achievement.progress.unlocked ? 'success.main' : 'primary.main'
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
