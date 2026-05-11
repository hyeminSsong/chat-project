export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
  department?: string;
  position?: string;
}

export interface Message {
  id: string;
  userId: string;
  roomId: string;
  content: string;
  timestamp: Date;
  reactions: Reaction[];
  isEdited?: boolean;
}

export interface Reaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface ChatRoom {
  id: string;
  type: 'direct' | 'group';
  name: string;
  members: string[];
  lastMessage?: LastMessage;
  unreadCount: number;
  description?: string;
}

export interface LastMessage {
  content: string;
  timestamp: Date;
  userId: string;
}

export type SidebarView = 'org' | 'chat';
