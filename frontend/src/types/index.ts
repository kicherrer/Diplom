export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  preferred_genres: string[];
  current_mood?: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_url: string;
  backdrop_url?: string;
  genres: string[];
  release_date: string;
  rating: number;
  vote_count: number;
  duration: number;
  trailer_url?: string;
}

export interface CinemaRoom {
  id: number;
  name: string;
  content_type: 'movie' | 'series';
  content_id: number;
  is_private: boolean;
  current_position: number;
  is_playing: boolean;
  participants_count: number;
  messages: ChatMessage[];
  is_owner: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  user: User;
  message: string;
  timestamp: string;
}
