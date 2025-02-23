import React, { useState } from 'react';
import { Box, IconButton, Popover, Typography } from '@mui/material';
import { AddReaction } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { EmojiPicker } from './EmojiPicker';
import { MessageReaction } from '../../types/shared';

interface MessageReactionsProps {
  reactions: MessageReaction[];
  onReact: (emoji: string) => void;
  onRemoveReact: (emoji: string) => void;
  currentUserId: number;
}

export const MessageReactions: React.FC<MessageReactionsProps> = ({
  reactions,
  onReact,
  onRemoveReact,
  currentUserId
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleEmojiSelect = (emoji: any) => {
    onReact(emoji.native);
    setAnchorEl(null);
  };

  const handleReactionClick = (emoji: string, users: number[]) => { // Change type from string[] to number[]
    if (users.includes(currentUserId)) {
      onRemoveReact(emoji);
    } else {
      onReact(emoji);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
        <AnimatePresence>
          {reactions.map(({ emoji, count, users }) => (
            <motion.div
              key={emoji}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Typography
                component="button"
                variant="caption"
                onClick={() => handleReactionClick(emoji, users)}
                sx={{
                  border: 1,
                  borderColor: users.includes(currentUserId) ? 'primary.main' : 'divider',
                  borderRadius: 3,
                  px: 1,
                  py: 0.5,
                  cursor: 'pointer',
                  bgcolor: users.includes(currentUserId) ? 'primary.light' : 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                {emoji} <span>{count}</span>
              </Typography>
            </motion.div>
          ))}
        </AnimatePresence>
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ opacity: 0.6, '&:hover': { opacity: 1 } }}
        >
          <AddReaction fontSize="small" />
        </IconButton>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
      </Popover>
    </>
  );
};
