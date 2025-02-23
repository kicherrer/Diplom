import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { AchievementsList } from '../achievements/AchievementsList';
import { WatchHistory } from './WatchHistory';
import { UserStats } from './UserStats';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';

interface ProfileTabsProps {
  userId: string | undefined;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ userId }) => {
  const [tab, setTab] = React.useState(0);
  const { t } = useTranslation();

  const tabContent = [
    {
      label: t('profile.achievements'),
      component: <AchievementsList userId={userId} />,
    },
    {
      label: t('profile.watchHistory'),
      component: <WatchHistory userId={userId} />,
    },
    {
      label: t('profile.stats'),
      component: <UserStats userId={userId} />,
    },
  ];

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
      >
        {tabContent.map((item, index) => (
          <Tab key={index} label={item.label} />
        ))}
      </Tabs>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {tabContent[tab].component}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};
