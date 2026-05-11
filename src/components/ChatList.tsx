import { useState } from 'react';
import { ChatRoom, User } from '../types';
import './ChatList.css';

interface Props {
  rooms: ChatRoom[];
  users: User[];
  currentUser: User;
  selectedRoomId: string | null;
  onSelectRoom: (id: string) => void;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return '방금';
  if (diffMins < 60) return `${diffMins}분 전`;

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const msgStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  if (msgStart === todayStart) {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  if (msgStart === todayStart - 86400000) return '어제';

  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

function GroupAvatar({ name }: { name: string }) {
  const initials = name
    .split(/[\s\-]+/)
    .slice(0, 2)
    .map(w => w[0])
    .join('');
  return <div className="room-avatar-group">{initials}</div>;
}

function SearchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

export default function ChatList({ rooms, users, currentUser, selectedRoomId, onSelectRoom }: Props) {
  const [search, setSearch] = useState('');

  const getUser = (id: string) => users.find(u => u.id === id);
  const getOtherUser = (room: ChatRoom) => {
    const otherId = room.members.find(id => id !== currentUser.id);
    return otherId ? getUser(otherId) : undefined;
  };

  const filtered = search.trim()
    ? rooms.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : rooms;

  const groupRooms = filtered.filter(r => r.type === 'group');
  const dmRooms = filtered.filter(r => r.type === 'direct');

  function renderRoom(room: ChatRoom) {
    const isActive = room.id === selectedRoomId;
    const otherUser = room.type === 'direct' ? getOtherUser(room) : undefined;
    const displayName = room.type === 'direct' && otherUser ? otherUser.name : room.name;
    const lastSender = room.lastMessage ? getUser(room.lastMessage.userId) : undefined;
    const isOwn = room.lastMessage?.userId === currentUser.id;

    return (
      <button
        key={room.id}
        className={`room-item${isActive ? ' active' : ''}${room.unreadCount > 0 ? ' unread' : ''}`}
        onClick={() => onSelectRoom(room.id)}
      >
        <div className="room-avatar-wrap">
          {room.type === 'direct' && otherUser ? (
            <>
              <div className="room-avatar-user avatar"
                style={{ background: stringToColor(otherUser.id) }}>
                {otherUser.avatar}
              </div>
              <span className={`status-dot status-${otherUser.status}`} />
            </>
          ) : (
            <GroupAvatar name={room.name} />
          )}
        </div>

        <div className="room-info">
          <div className="room-top">
            <span className="room-name">{displayName}</span>
            {room.lastMessage && (
              <span className="room-time">{formatTime(room.lastMessage.timestamp)}</span>
            )}
          </div>
          <div className="room-bottom">
            <span className="room-preview">
              {room.lastMessage
                ? (room.type === 'group'
                    ? `${isOwn ? '나' : lastSender?.name ?? ''}: ${room.lastMessage.content}`
                    : room.lastMessage.content)
                : '메시지가 없습니다'}
            </span>
            {room.unreadCount > 0 && (
              <span className="unread-badge">{room.unreadCount}</span>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="chat-list">
      <div className="cl-header">
        <h2 className="cl-title">메시지</h2>
        <button className="cl-compose-btn" title="새 메시지">
          <EditIcon />
        </button>
      </div>

      <div className="cl-search">
        <SearchIcon />
        <input
          type="text"
          placeholder="채팅방 검색"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button className="cl-search-clear" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      <div className="cl-rooms">
        {groupRooms.length > 0 && (
          <div className="cl-section">
            <div className="cl-section-label">그룹 채팅</div>
            {groupRooms.map(renderRoom)}
          </div>
        )}
        {dmRooms.length > 0 && (
          <div className="cl-section">
            <div className="cl-section-label">다이렉트 메시지</div>
            {dmRooms.map(renderRoom)}
          </div>
        )}
        {filtered.length === 0 && (
          <div className="cl-empty">검색 결과가 없습니다</div>
        )}
      </div>
    </div>
  );
}

function stringToColor(str: string): string {
  const palette = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#ef4444','#0ea5e9'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}
