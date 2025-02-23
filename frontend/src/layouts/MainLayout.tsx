import React from 'react';
import { Box } from '@mui/material';
import { FriendChat } from '../components/chat/FriendChat';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      <FriendChat />
    </Box>
  );
};
