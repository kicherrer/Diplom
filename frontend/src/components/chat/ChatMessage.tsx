import React from 'react';
import { ListItem, Avatar, Paper, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { MessageReactions } from './MessageReactions';
import { FormattedText } from './FormattedText';
import { LinkPreview } from './LinkPreview';
import { VoiceMessage } from './VoiceMessage';
import { Message } from '../../types/shared';

// URL detection regex
const URL_REGEX = /(https?:\/\/[^\s]+)/g;

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
  onReact: (messageId: number, emoji: string) => void;  // Change parameter type to number
  onRemoveReact: (messageId: number, emoji: string) => void;  // Change parameter type to number
  currentUserId: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isOwn,
  onReact,
  onRemoveReact,
  currentUserId
}) => {
  const isOwnMessage = message.sender_id === currentUserId;  // Now types match

  // Extract URLs from message content
  const urls = message.content.match(URL_REGEX) || [];

  const renderContent = () => {
    switch (message.message_type) {
      case 'voice':
        return (
          <VoiceMessage
            url={message.content}
            duration={message.voice_duration}
          />
        );
      default:
        return <FormattedText text={message.content} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.01 }}
      transition={{
        layout: { type: "spring", stiffness: 500, damping: 30 }
      }}
    >
      <ListItem
        sx={{
          flexDirection: isOwn ? 'row-reverse' : 'row',
          gap: 1,
        }}
      >
        <Avatar 
          src={message.sender_avatar} 
          sx={{ 
            width: 32, 
            height: 32,
            boxShadow: 1 
          }} 
        />
        <Box>
          <Paper
            sx={{
              p: 1.5,
              maxWidth: '70%',
              bgcolor: isOwn ? 'primary.main' : 'background.paper',
              color: isOwn ? 'primary.contrastText' : 'text.primary',
              borderRadius: 3,
              boxShadow: 2,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '50%',
                [isOwn ? 'right' : 'left']: -6,
                marginTop: -6,
                border: '6px solid transparent',
                borderRightColor: isOwn ? 'transparent' : 'background.paper',
                borderLeftColor: isOwn ? 'primary.main' : 'transparent',
                transform: isOwn ? 'scaleX(-1)' : 'none',
              }
            }}
          >
            {renderContent()}
            <Typography 
              variant="caption" 
              color="inherit" 
              sx={{ 
                opacity: 0.7,
                display: 'block',
                textAlign: 'right',
                mt: 0.5
              }}
            >
              {new Date(message.timestamp).toLocaleTimeString()}
            </Typography>
          </Paper>
          {urls.map((url) => (
            <LinkPreview key={url} url={url} />
          ))}
          <MessageReactions
            reactions={message.reactions || []}  // Add default empty array
            onReact={(emoji) => onReact(message.id, emoji)}
            onRemoveReact={(emoji) => onRemoveReact(message.id, emoji)}
            currentUserId={currentUserId}
          />
        </Box>
      </ListItem>
    </motion.div>
  );
};
