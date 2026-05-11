import { useRef, useEffect } from 'react';
import { ChatRoom, Message, User } from '../types';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';
import './ChatWindow.css';

interface Props {
  room: ChatRoom;
  messages: Message[];
  users: User[];
  currentUser: User;
  onSendMessage: (content: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onClose: () => void;
}

function GroupIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function stringToColor(str: string): string {
  const palette = ['#6366f1','#8b5cf6','#ec4899','#14b8a6','#f59e0b','#ef4444','#0ea5e9'];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

export default function ChatWindow({ room, messages, users, currentUser, onSendMessage, onAddReaction, onClose }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getUser = (id: string) => users.find(u => u.id === id);

  const otherUser = room.type === 'direct'
    ? getUser(room.members.find(id => id !== currentUser.id) ?? '')
    : undefined;

  // Group messages by date
  const grouped: { date: string; msgs: Message[] }[] = [];
  for (const msg of messages) {
    const d = msg.timestamp.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    const last = grouped[grouped.length - 1];
    if (last?.date === d) last.msgs.push(msg);
    else grouped.push({ date: d, msgs: [msg] });
  }

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="cw-header">
        <div className="cw-header-left">
          <div className="cw-avatar">
            {room.type === 'direct' && otherUser ? (
              <div className="cw-avatar-user" style={{ background: stringToColor(otherUser.id) }}>
                {otherUser.avatar}
                <span className={`cw-status-dot status-${otherUser.status}`} />
              </div>
            ) : (
              <div className="cw-avatar-group"><GroupIcon /></div>
            )}
          </div>
          <div>
            <div className="cw-room-name">
              {room.type === 'direct' && otherUser ? otherUser.name : room.name}
            </div>
            <div className="cw-room-meta">
              {room.type === 'direct' && otherUser
                ? `${otherUser.department ?? ''} · ${otherUser.position ?? ''}`
                : `${room.members.length}명 참여`}
            </div>
          </div>
        </div>
        <div className="cw-header-right">
          <button className="cw-action-btn" title="멤버 보기">
            <GroupIcon />
          </button>
          <button className="cw-action-btn cw-close-btn" onClick={onClose} title="닫기">
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="cw-messages">
        {messages.length === 0 ? (
          <div className="cw-empty">
            <div className="cw-empty-icon">
              {room.type === 'group' ? '👥' : '💬'}
            </div>
            <h3>{room.type === 'direct' && otherUser ? otherUser.name : room.name}</h3>
            <p>{room.description ?? '대화를 시작해보세요!'}</p>
          </div>
        ) : (
          grouped.map(group => (
            <div key={group.date}>
              <div className="cw-date-divider"><span>{group.date}</span></div>
              {group.msgs.map((msg, i) => {
                const prev = group.msgs[i - 1];
                const isContinuation =
                  !!prev &&
                  prev.userId === msg.userId &&
                  msg.timestamp.getTime() - prev.timestamp.getTime() < 5 * 60 * 1000;
                return (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    user={getUser(msg.userId)}
                    isCurrentUser={msg.userId === currentUser.id}
                    isContinuation={isContinuation}
                    onAddReaction={onAddReaction}
                  />
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <MessageInput roomName={room.name} onSend={onSendMessage} />
    </div>
  );
}
