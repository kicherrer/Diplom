import React, { useState, useCallback } from 'react';
import {
  TextField,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import { Search, Close } from '@mui/icons-material';
import { debounce } from 'lodash';

interface MessageSearchProps {
  messages: any[];
  onMessageSelect: (messageId: string) => void;
}

export const MessageSearch: React.FC<MessageSearchProps> = ({ messages, onMessageSelect }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = useCallback(
    debounce((term: string) => {
      if (!term) {
        setResults([]);
        return;
      }
      
      const filtered = messages.filter(msg => 
        msg.content.toLowerCase().includes(term.toLowerCase())
      );
      setResults(filtered);
    }, 300),
    [messages]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Search />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <TextField
            fullWidth
            size="small"
            value={searchTerm}
            onChange={handleChange}
            placeholder="Search messages..."
            InputProps={{
              endAdornment: searchTerm && (
                <IconButton size="small" onClick={() => setSearchTerm('')}>
                  <Close fontSize="small" />
                </IconButton>
              ),
            }}
          />
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {results.map((msg) => (
              <ListItem
                key={msg.id}
                button
                onClick={() => {
                  onMessageSelect(msg.id);
                  setAnchorEl(null);
                }}
              >
                <ListItemText
                  primary={msg.content}
                  secondary={new Date(msg.timestamp).toLocaleString()}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { maxWidth: 200 }
                  }}
                />
              </ListItem>
            ))}
            {searchTerm && !results.length && (
              <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                No messages found
              </Typography>
            )}
          </List>
        </Box>
      </Popover>
    </>
  );
};
