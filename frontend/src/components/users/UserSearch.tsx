import React, { useState } from 'react';
import {
  TextField,
  Autocomplete,
  Avatar,
  Box,
  Typography
} from '@mui/material';
import { api } from '../../api/client';
import { debounce } from 'lodash';
import { BaseUser, UserSearchProps } from '../../types/shared';

interface User {
  id: number;
  username: string;
  avatar?: string;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onSelect, excludeIds = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const searchUsers = debounce(async (term: string) => {
    if (!term) {
      setUsers([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.users.searchUsers(term);
      const filteredUsers = response.data.filter(
        user => !excludeIds.includes(user.id)
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSelect = (user: BaseUser) => {
    onSelect(user);
  };

  return (
    <Autocomplete
      options={users}
      loading={loading}
      filterOptions={(x) => x}
      getOptionLabel={(option) => option.username}
      onChange={(_, user) => user && handleSelect(user)}
      onInputChange={(_, value) => {
        setSearchTerm(value);
        searchUsers(value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search users"
          variant="outlined"
          fullWidth
        />
      )}
      renderOption={(props, user) => (
        <Box component="li" {...props}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={user.avatar} sx={{ width: 32, height: 32 }}>
              {user.username[0]}
            </Avatar>
            <Typography>{user.username}</Typography>
          </Box>
        </Box>
      )}
    />
  );
};
