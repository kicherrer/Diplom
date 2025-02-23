import React from 'react';
import {
  SwipeableDrawer,
  IconButton,
  Box,
  Typography,
  useTheme,
  Fab
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';

interface MobileFilterPanelProps {
  children: React.ReactNode;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const MobileFilterPanel: React.FC<MobileFilterPanelProps> = ({
  children,
  open,
  onOpen,
  onClose
}) => {
  const theme = useTheme();

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={onOpen}
      >
        <FilterListIcon />
      </Fab>

      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        disableSwipeToOpen
        sx={{
          display: { xs: 'block', sm: 'none' }
        }}
        PaperProps={{
          sx: {
            height: '90vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          {children}
        </Box>
      </SwipeableDrawer>
    </>
  );
};
