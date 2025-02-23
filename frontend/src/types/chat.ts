import { AxiosResponse } from 'axios';

export interface ChatParticipant {
  id: number;
  username: string;
  avatar: string | null;
}

export interface ChatRoom {
  id: number;
  participants: ChatParticipant[];
  last_message: {
    content: string;
    timestamp: string;
    sender_id: number;
  } | null;
  unread_count: number;
}

// Add a type for raw API response
export interface ApiChatRoom {
  id: string;  // API returns string
  participants: Array<{
    id: string;
    username: string;
    avatar: string | null;
  }>;
  last_message: {
    content: string;
    timestamp: string;
    sender_id: string;
  } | null;
  unread_count: number;
}

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface ChatRoomsResponse {
  data: ChatRoom[];
  status: 'success' | 'error';
  message?: string;
}

export type GetRoomsResponse = AxiosResponse<ChatRoomsResponse>;
