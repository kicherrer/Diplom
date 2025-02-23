import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import { AddPhotoAlternate, Close } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { UserSearch } from '../../components/users';
import { User } from '../../types/user';
import { GroupChatForm, BaseUser } from '../../types/shared';

interface CreateGroupChatProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    participants: string[];
    avatar?: File;
  }) => void;
}

export const CreateGroupChat: React.FC<CreateGroupChatProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<GroupChatForm>({
    name: '',
    description: '',
    participants: [],
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onload = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleUserSelect = (user: BaseUser) => {
    setFormData(prev => ({
      ...prev,
      participants: [...prev.participants, user.id.toString()]
    }));
  };

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      ...(avatar && { avatar })
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Group Chat</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={avatarPreview}
              sx={{ width: 64, height: 64 }}
            />
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <IconButton component="span" color="primary">
                <AddPhotoAlternate />
              </IconButton>
            </label>
          </Box>

          <TextField
            label="Group Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
          />

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />

          <UserSearch
            onSelect={handleUserSelect}
            excludeIds={formData.participants.map(id => Number(id))}
          />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.participants.map((participantId) => (
              <Chip
                key={participantId}
                label={participantId}
                onDelete={() => setFormData(prev => ({
                  ...prev,
                  participants: prev.participants.filter(id => id !== participantId)
                }))}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || formData.participants.length < 2}
        >
          Create Group
        </Button>
      </DialogActions>
    </Dialog>
  );
};
