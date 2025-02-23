export interface MessageReaction {
  emoji: string;
  users: number[];
  count: number;
}

export interface BaseUser {
  id: number;  // Changed from string to number for consistency
  username: string;
  avatar?: string;
}

export interface User extends BaseUser {
  email: string;
  role: 'admin' | 'moderator' | 'user';
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;  // Add error field
}

export interface ChatParticipant extends BaseUser {}  // Now inherits correct id type

export interface Message {
  id: number;  // Changed from string to number
  content: string;
  sender_id: number;  // Changed from string to number
  timestamp: string;
  sender_avatar?: string;
  message_type: 'text' | 'voice' | 'file';
  voice_duration?: number;  // Add this field
  reactions?: MessageReaction[];  // Add this field
  attachments?: {
    url: string;
    type: string;
    name: string;
  }[];
}

export interface GroupChatForm {
  name: string;
  description: string;
  participants: string[];
  avatar?: File;
}

export interface UserSearchProps {
  onSelect: (user: BaseUser) => void;  // Changed from User to BaseUser
  excludeIds?: number[];  // Changed from string[] to number[]
  // ...other props
}

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}
