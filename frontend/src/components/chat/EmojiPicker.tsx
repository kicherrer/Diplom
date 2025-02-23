import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { IconButton, Popover } from '@mui/material';
import { EmojiEmotions } from '@mui/icons-material';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <EmojiEmotions />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Picker 
          data={data} 
          onEmojiSelect={handleEmojiSelect}
          theme="light"
        />
      </Popover>
    </>
  );
};
