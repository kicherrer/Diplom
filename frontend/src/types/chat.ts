export interface ChatRoom {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  created_by: string;
  admins: string[];
  is_group: boolean;
  participants: Array<{
    id: string;
    username: string;
    avatar?: string;
  }>;
}
