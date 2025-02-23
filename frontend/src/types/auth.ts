export interface BaseUser {
  id: number;  // Changed from string to number
  username: string;
  avatar?: string;
}

export interface User extends BaseUser {
  email: string;
  role: UserRole;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}

export type UserRole = 'admin' | 'moderator' | 'user';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;  // Add error field explicitly
}

export interface AuthContextValue extends AuthState {
  loading: boolean;  // Add loading alias for backward compatibility
}
