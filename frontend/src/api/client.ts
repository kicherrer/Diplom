import axios, { AxiosResponse } from 'axios';

// Add interfaces for API responses
export interface AdminAnalytics {
  userStats: any;
  contentStats: any;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

export interface AdminSettings {
  siteSettings: any;
  emailSettings: any;
  importSettings: any;
}

// Add Movie interface
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
  mood_tags: string[];
  match_score?: number;  // Optional because it only exists in recommendation responses
}

export interface PreferenceAnalytics {
  genrePreferences: Array<{
    genre: string;
    score: number;
  }>;
  watchHistory: Array<{
    date: string;
    count: number;
  }>;
  favoriteActors: Array<{
    name: string;
    count: number;
  }>;
}

export interface RatingSubmission {
  contentId: number;
  contentType: 'movie' | 'series' | 'video';
  rating: number;
  review?: string;
}

export interface ViewingStats {
  dailyActivity: Array<{
    date: string;
    minutes: number;
  }>;
  totalWatchTime: number;
  mostActiveTime: string;
  genreDistribution: Array<{
    genre: string;
    count: number;
  }>;
}

export interface GenreRating {
  genre: string;
  averageRating: number;
  count: number;
}

export interface RatingAnalytics {
  ratingDistribution: Array<{
    rating: number;
    count: number;
  }>;
  genreRatings: GenreRating[];
  ratingTrends: Array<{
    date: string;
    averageRating: number;
    count: number;
  }>;
}

export interface SimilarUser {
  id: string;
  username: string;
  avatar_url?: string;
  common_genres: string[];
  similarity_score: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  achievement_type: string;
  points: number;
  progress: {
    current: number;
    required: number;
    percentage: number;
    unlocked: boolean;
    unlocked_at: string | null;
  };
}

export interface Friend {
  id: number;
  friend_details: {
    id: string;
    username: string;
    avatar: string | null;
    shared_interests: number;
  };
  status: 'pending' | 'accepted' | 'declined';
  created_at: string;
}

export interface SharedRecommendation {
  movie: Movie;
  friends: Array<{
    id: string;
    username: string;
    avatar: string;
  }>;
  match_score: number;
  common_interests: string[];
}

export interface ChatRoom {
  id: string;
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

export interface ChatMessage {
  id: string;
  sender_id: string;
  content: string;
  timestamp: string;
  sender_avatar?: string;
  message_type: 'text' | 'voice' | 'file';
  voice_duration?: number;
  reactions: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
}

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
}

export interface RatingAnalyticsResponse extends ApiResponse<RatingAnalytics> {}
export interface ViewingStatsResponse extends ApiResponse<ViewingStats> {}
export interface RecommendationListResponse extends ApiResponse<RecommendationResponse> {}
export interface SimilarUsersResponse extends ApiResponse<SimilarUser[]> {}
export interface FriendsResponse extends ApiResponse<Friend[]> {}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AnalyticsDay {
  date: string;
  total_time: number;
  content_watched: number;
}

export interface UserStats {
  daily_stats: AnalyticsDay[];
  total_watch_time: number;
  total_content_watched: number;
  favorite_genres: [string, number][];
  completion_rate: number;
  average_session: number;
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      client.post('/auth/token/', { username, password }),
    register: (data: any) => client.post('/auth/register/', data),
    me: () => client.get('/users/me/'),
  },
  movies: {
    list: () => client.get<Movie[]>('/movies/'),
    getById: (id: number) => client.get<Movie>(`/movies/${id}/`),
    search: (query: string) => client.get<Movie[]>(`/movies/search/?q=${query}`),
    byMood: (mood: string) => client.get<Movie[]>(`/movies/by_mood/?mood=${mood}`),
  },
  recommendations: {
    getPersonalized: (data: any) => 
      client.post('/recommendations/personalized/', data),
    getByMood: (mood: string) => 
      client.get(`/recommendations/mood/${mood}/`),
    getSimilar: (contentId: string, contentType: string) =>
      client.get(`/recommendations/similar/${contentType}/${contentId}/`),
    updatePreferences: (userId: string, preferences: any) =>
      client.put(`/users/${userId}/preferences/`, preferences),
    getPersonalizedWithRatings: (userId: string) =>
      client.get(`/recommendations/personalized/${userId}/with-ratings/`),
    getSimilarByRatings: (contentId: number, contentType: string) =>
      client.get(`/recommendations/similar-by-ratings/${contentType}/${contentId}/`),
    getSharedRecommendations: (): Promise<AxiosResponse<ApiResponse<SharedRecommendation[]>>> =>
      client.get('/recommendations/shared/'),
  },
  users: {
    getPreferences: (userId: string) =>
      client.get(`/users/${userId}/preferences/`),
    getWatchHistory: (userId: string) =>
      client.get(`/users/${userId}/watch-history/`),
    updateMood: (userId: string, mood: string) =>
      client.post(`/users/${userId}/mood/`, { mood }),
    update: (userId: string, data: any) =>
      client.patch(`/users/${userId}/`, data),
    getProfile: (userId: string) =>
      client.get(`/users/${userId}/profile/`),
    getPreferenceAnalytics: (userId: string): Promise<AxiosResponse<ApiResponse<PreferenceAnalytics>>> =>
      client.get(`/users/${userId}/analytics/preferences/`),
    getViewingStats: (userId: string): Promise<AxiosResponse<ApiResponse<ViewingStats>>> =>
      client.get(`/users/${userId}/stats/viewing/`),
    getRatingAnalytics: (userId: string): Promise<AxiosResponse<ApiResponse<RatingAnalytics>>> =>
      client.get(`/users/${userId}/ratings/analytics/`),
    getSimilarUsers: (userId: string): Promise<AxiosResponse<ApiResponse<SimilarUser[]>>> =>
      client.get(`/users/${userId}/similar/`),
    getAchievements: (userId: string): Promise<AxiosResponse<ApiResponse<Achievement[]>>> =>
      client.get(`/users/${userId}/achievements/`),
    getFriends: (): Promise<AxiosResponse<ApiResponse<Friend[]>>> =>
      client.get('/users/friends/'),
    getFriendRequests: (): Promise<AxiosResponse<ApiResponse<Friend[]>>> =>
      client.get('/users/friend-requests/'),
    sendFriendRequest: (userId: string): Promise<AxiosResponse<ApiResponse<Friend>>> =>
      client.post(`/users/friends/request/${userId}/`),
    acceptFriendRequest: (requestId: number): Promise<AxiosResponse<Friend>> =>
      client.post(`/users/friends/accept/${requestId}/`),
    declineFriendRequest: (requestId: number): Promise<AxiosResponse<void>> =>
      client.post(`/users/friends/decline/${requestId}/`),
    searchUsers: (query: string): Promise<AxiosResponse<any[]>> =>
      client.get(`/users/search/?q=${query}`),
  },
  admin: {
    getAnalytics: (): Promise<AxiosResponse<AdminAnalytics>> => 
      client.get('/admin/analytics/'),
    getUsers: (): Promise<AxiosResponse<AdminUser[]>> => 
      client.get('/admin/users/'),
    updateUser: (userId: number, data: Partial<AdminUser>): Promise<AxiosResponse<AdminUser>> => 
      client.patch(`/admin/users/${userId}/`, data),
    deleteUser: (userId: number): Promise<AxiosResponse<void>> => 
      client.delete(`/admin/users/${userId}/`),
    getSettings: (): Promise<AxiosResponse<AdminSettings>> => 
      client.get('/admin/settings/'),
    updateSettings: (data: Partial<AdminSettings>): Promise<AxiosResponse<AdminSettings>> => 
      client.put('/admin/settings/', data),
    importTrending: (): Promise<AxiosResponse<any>> => 
      client.post('/admin/import/trending/'),
    getImportJobs: (): Promise<AxiosResponse<any[]>> => 
      client.get('/admin/import/jobs/'),
    moderateContent: (data: { id: number; action: string; note: string }): Promise<AxiosResponse<any>> =>
      client.post('/admin/moderate/', data),
    getContent: (params?: { 
      page?: number; 
      limit?: number; 
      search?: string;
    }) => axios.get<PaginatedResponse<Content>>('/api/admin/content', { params }),
    
    deleteContent: (id: string | number) => 
      axios.delete(`/api/admin/content/${id}`),
    
    updateContent: (id: string | number, data: Partial<Content>) =>
      axios.patch(`/api/admin/content/${id}`, data),
      
    createContent: (data: CreateContentDTO) =>
      axios.post('/api/admin/content', data),

    searchTMDB: (query: string) => 
      axios.get<TMDBSearchResponse>('/api/admin/tmdb/search', {
        params: { query }
      }),

    importTMDB: (tmdbId: number) => // Renamed from importMovie to importTMDB
      axios.post('/api/admin/tmdb/import', { tmdb_id: tmdbId }),
  },
  ratings: {
    submit: (data: RatingSubmission): Promise<AxiosResponse<any>> =>
      client.post('/ratings/', data),
    getForContent: (contentId: number, contentType: string): Promise<AxiosResponse<any>> =>
      client.get(`/ratings/${contentType}/${contentId}/`),
    getUserRatings: (userId: string): Promise<AxiosResponse<any>> =>
      client.get(`/users/${userId}/ratings/`),
    getUserAnalytics: (userId: string): Promise<AxiosResponse<ApiResponse<RatingAnalytics>>> =>
      client.get(`/users/${userId}/ratings/analytics/`),
  },
  chat: {
    getRooms: (): Promise<AxiosResponse<ApiResponse<ChatRoom[]>>> =>
      client.get('/chat/rooms/'),
    getMessages: (roomId: string): Promise<AxiosResponse<ApiResponse<ChatMessage[]>>> =>
      client.get(`/chat/rooms/${roomId}/messages/`),
    createRoom: (userId: string): Promise<AxiosResponse<ApiResponse<ChatRoom>>> =>
      client.post('/chat/rooms/', { user_id: userId }),
    uploadAttachment: (formData: FormData): Promise<AxiosResponse<{
      url: string;
      type: 'image' | 'video' | 'file';
    }>> => {
      return client.post('/chat/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    getLinkPreview: (url: string): Promise<AxiosResponse<{
      title: string;
      description: string;
      image: string;
      siteName: string;
    }>> => client.get('/chat/link-preview/', { params: { url } }),
    uploadVoiceMessage: (roomId: string, blob: Blob): Promise<AxiosResponse<{
      url: string;
      duration: number;
    }>> => {
      const formData = new FormData();
      formData.append('file', blob, 'voice-message.webm');
      formData.append('room_id', roomId);
      formData.append('type', 'voice');
      
      return client.post('/chat/upload/voice/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    },
    createGroupChat: (data: FormData): Promise<AxiosResponse<ApiResponse<ChatRoom>>> =>
      client.post('/chat/rooms/group/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    updateRoom: (roomId: string, data: FormData): Promise<AxiosResponse<ApiResponse<ChatRoom>>> =>
      client.patch(`/chat/rooms/${roomId}/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }),
    addParticipants: (roomId: string, userIds: string[]): Promise<AxiosResponse<void>> =>
      client.post(`/chat/rooms/${roomId}/participants/`, { user_ids: userIds }),
    removeParticipant: (roomId: string, userId: string): Promise<AxiosResponse<void>> =>
      client.delete(`/chat/rooms/${roomId}/participants/${userId}/`),
  },
  analytics: {
    getUserStats: (days?: number): Promise<AxiosResponse<UserStats>> =>
      client.get('/analytics/user-stats/', { params: { days } }),
    getTrending: (days?: number, limit?: number): Promise<AxiosResponse<any>> =>
      client.get('/analytics/trending/', { params: { days, limit } }),
    recordView: (data: {
      content_type: string;
      object_id: number;
      duration: number;
      progress: number;
    }): Promise<AxiosResponse<any>> =>
      client.post('/analytics/record-view/', data),
  }
};

// Update existing type definitions with more specific types
export interface UserPreferences {
  favorite_genres: string[];
  preferred_content_types: string[];
  mood_preferences: string[];
}

export interface WatchHistoryItem {
  id: number;
  content_type: 'movie' | 'series' | 'video';
  content_id: number;
  watched_at: string;
  progress: number;
}

export interface RecommendationResponse {
  items: Array<{
    id: number;
    title: string;
    type: string;
    poster_url: string;
    rating: number;
    match_score: number;
  }>;
  total: number;
}

// Add type for the entire API client
export type ApiClient = typeof api;

interface Content {
  id: number | string;
  title: string;
  type: string;
  status: 'published' | 'draft' | 'pending';
  genres: string[];
  views: number;
  rating: number;
  // ...other content fields
}

interface CreateContentDTO {
  title: string;
  type: string;
  genres: string[];
  // ...other required fields for content creation
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

interface TMDBSearchResponse {
  results: Array<{
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
  }>;
  page: number;
  total_pages: number;
  total_results: number;
}
