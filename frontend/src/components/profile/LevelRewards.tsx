import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tooltip,
  Badge,
} from '@mui/material';
import { Lock, Stars } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Reward {
  level: number;
  type: 'avatar_frame' | 'title' | 'feature';
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

interface LevelRewardsProps {
  currentLevel: number;
  rewards: Reward[];
}

export const LevelRewards: React.FC<LevelRewardsProps> = ({
  currentLevel,
  rewards
}) => {
  const { t } = useTranslation();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {t('profile.rewards')}
      </Typography>
      
      <motion.div variants={container} initial="hidden" animate="show">
        <Grid container spacing={2}>
          {rewards.map((reward) => (
            <Grid item xs={12} sm={6} md={4} key={`${reward.type}-${reward.level}`}>
              <motion.div variants={item}>
                <Card 
                  sx={{ 
                    position: 'relative',
                    opacity: reward.unlocked ? 1 : 0.7,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Badge
                        badgeContent={reward.level}
                        color="primary"
                        sx={{ mr: 2 }}
                      >
                        {reward.unlocked ? (
                          <Stars color="primary" />
                        ) : (
                          <Lock color="action" />
                        )}
                      </Badge>
                      <Typography variant="h6">{reward.name}</Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary">
                      {reward.description}
                    </Typography>

                    {!reward.unlocked && (
                      <Typography 
                        variant="caption" 
                        color="primary"
                        sx={{ mt: 1, display: 'block' }}
                      >
                        {t('profile.unlocksAtLevel', { level: reward.level })}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};
