import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItem,
  Drawer,
  Fab,
} from '@mui/material';
import { Send, Chat as ChatIcon, Close, AttachFile } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useWebSocket } from '../../hooks';
import { ChatList } from './ChatList';
import { api } from '../../api/client';
import { EmojiPicker } from './EmojiPicker';
import { TypingIndicator } from './TypingIndicator';
import { MessageSearch } from './MessageSearch';
import { debounce } from 'lodash';

interface Message {
  id: string;
  sender_id: string;  // Changed from sender to sender_id
  content: string;
  timestamp: string;
  sender_avatar?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  timestamp: string;
  sender_id: string;
  sender_avatar?: string;
}

export const FriendChat: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>(undefined);
  const [typingUsers, setTypingUsers] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { sendMessage, lastMessage } = useWebSocket(
    `ws://${window.location.host}/ws/chat/private/`
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage) as Message;
        setMessages((prevMessages) => [...prevMessages, data]);
        scrollToBottom();
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  }, [lastMessage, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (messageText.trim() && user?.id && selectedRoom) {
      try {
        sendMessage(JSON.stringify({
          type: 'private_message',
          content: messageText,
          room_id: selectedRoom,
          sender: user.id
        }));
        setMessageText('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  }, [messageText, user?.id, sendMessage, selectedRoom]);

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleRoomSelect = useCallback((roomId: string) => {
    setSelectedRoom(roomId);
    setMessages([]);
    
    if (roomId) {
      api.chat.getMessages(roomId)
        .then((response) => {
          if (response.data.data) {
            setMessages(response.data.data);
          }
        })
        .catch(console.error);
    }
  }, []);

  const handleEmojiSelect = (emoji: any) => {
    setMessageText(prev => prev + emoji.native);
  };

  const notifyTyping = useCallback(
    debounce((roomId: string) => {
      if (roomId && user?.id) {
        sendMessage(JSON.stringify({
          type: 'typing',
          room_id: roomId,
          user_id: user.id
        }));
      }
    }, 500),
    [sendMessage, user?.id]
  );

  const handleMessageSelect = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message && messagesEndRef.current) {
      const element = document.getElementById(`message-${messageId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.style.backgroundColor = 'rgba(25, 118, 210, 0.08)';
        setTimeout(() => {
          element.style.backgroundColor = 'transparent';
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'typing') {
          setTypingUsers(prev => ({
            ...prev,
            [data.user_id]: Date.now()
          }));
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers(prev => {
        const now = Date.now();
        const updated = { ...prev };
        Object.keys(updated).forEach(userId => {
          if (now - updated[userId] > 3000) {
            delete updated[userId];
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedRoom) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('room_id', selectedRoom);
    
    try {
      const response = await api.chat.uploadAttachment(formData);
      if (response.data.url) {
        sendMessage(JSON.stringify({
          type: 'private_message',
          content: '',
          room_id: selectedRoom,
          attachment: {
            url: response.data.url,
            type: response.data.type,
            name: file.name
          }
        }));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: Record<string, Message[]> = {};
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  }, [messages]);

  if (!user) return null;

  return (
    <>
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        onClick={() => setIsOpen(true)}
      >
        <ChatIcon />
      </Fab>

      <Drawer
        anchor="right"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: { width: { xs: '100%', sm: 400 } }
        }}
      >
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Box
            sx={{
              width: 300,
              borderRight: 1,
              borderColor: 'divider'
            }}
          >
            <ChatList
              onRoomSelect={handleRoomSelect}
              selectedRoomId={selectedRoom}
            />
          </Box>
          
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">{t('chat.title')}</Typography>
              <MessageSearch messages={messages} onMessageSelect={handleMessageSelect} />
            </Box>

            <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <ListItem
                      sx={{
                        flexDirection: msg.sender_id === user.id?.toString() ? 'row-reverse' : 'row',
                        gap: 1,
                      }}
                    >
                      <Avatar src={msg.sender_avatar} sx={{ width: 32, height: 32 }} />
                      <Paper
                        sx={{
                          p: 1,
                          maxWidth: '70%',
                          bgcolor: msg.sender_id === user.id?.toString() ? 'primary.main' : 'background.paper',
                          color: msg.sender_id === user.id?.toString() ? 'primary.contrastText' : 'text.primary',
                        }}
                      >
                        <Typography variant="body2">{msg.content}</Typography>
                        <Typography variant="caption" color="inherit" sx={{ opacity: 0.7 }}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Paper>
                    </ListItem>
                  </motion.div>
                ))}
                {Object.keys(typingUsers).map(userId => (
                  <TypingIndicator key={userId} username="Someone" />
                ))}
                <div ref={messagesEndRef} />
              </AnimatePresence>
            </List>

            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileSelect}
                />
                <IconButton 
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <AttachFile />
                </IconButton>
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                <TextField
                  fullWidth
                  size="small"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('chat.typePlaceholder')}
                  multiline
                  maxRows={3}
                  InputProps={{
                    sx: { borderRadius: 3 }
                  }}
                />
                <IconButton 
                  color="primary" 
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                      color: 'action.disabled',
                    }
                  }}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};