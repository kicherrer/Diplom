import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
} from '@mui/material';
import {
  MoreVert,
  PersonAdd,
  ExitToApp,
  GroupOutlined,
  Edit,
  Delete,
  Close,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ChatRoom } from '../../types/chat';

interface GroupChatProps {
  room: ChatRoom;
  onAddParticipants: () => void;
  onLeaveGroup: () => void;
  onEditGroup?: () => void;
  onDeleteGroup?: () => void;
}

export const GroupChat: React.FC<GroupChatProps> = ({
  room,
  onAddParticipants,
  onLeaveGroup,
  onEditGroup,
  onDeleteGroup,
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isAdmin = currentUser?.id ? room.admins.includes(String(currentUser.id)) : false;

  const handleRemoveParticipant = (participantId: string) => {
    // Handle remove participant logic
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
        <Avatar src={room.avatar} alt={room.name}>
          {!room.avatar && <GroupOutlined />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6">{room.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {room.participants.length} participants
          </Typography>
        </Box>
        <IconButton onClick={() => setShowParticipants(true)}>
          <GroupOutlined />
        </IconButton>
        <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <MoreVert />
        </IconButton>
      </Box>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={onAddParticipants}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add Participants</ListItemText>
        </MenuItem>
        {isAdmin && (
          <MenuItem onClick={onEditGroup}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Group</ListItemText>
          </MenuItem>
        )}
        {isAdmin && (
          <MenuItem onClick={onDeleteGroup}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Group</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={onLeaveGroup}>
          <ListItemIcon>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          <ListItemText>Leave Group</ListItemText>
        </MenuItem>
      </Menu>

      <Drawer
        anchor="right"
        open={showParticipants}
        onClose={() => setShowParticipants(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Participants
          </Typography>
          <List>
            {room.participants.map((participant) => (
              <ListItem
                key={participant.id}
                secondaryAction={
                  isAdmin && currentUser?.id && participant.id !== String(currentUser.id) && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleRemoveParticipant(participant.id)}
                    >
                      <Close />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={participant.avatar}>
                    {participant.username[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={participant.username}
                  secondary={participant.id === room.created_by ? 'Admin' : ''}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
