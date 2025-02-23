export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  avatar?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
}
