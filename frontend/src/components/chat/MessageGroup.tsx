import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';
import { useTranslation } from 'react-i18next';

interface MessageGroupProps {
  date: string;
  children: React.ReactNode;
}

export const MessageGroup: React.FC<MessageGroupProps> = ({ date, children }) => {
  const { t } = useTranslation();
  const messageDate = new Date(date);

  const getDateLabel = () => {
    if (isToday(messageDate)) {
      return t('chat.today');
    }
    if (isYesterday(messageDate)) {
      return t('chat.yesterday');
    }
    return format(messageDate, 'MMMM d, yyyy');
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 2 
      }}>
        <Divider sx={{ flex: 1 }} />
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ px: 2, py: 0.5, bgcolor: 'background.paper', borderRadius: 1 }}
        >
          {getDateLabel()}
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Box>
      {children}
    </Box>
  );
};
