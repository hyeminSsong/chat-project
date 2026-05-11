import { useState } from 'react';
import { Message, User } from '../types';
// roomId field exists on Message but is not used directly in this component
import './MessageItem.css';

interface Props {
  message: Message;
  user: User | undefined;
  isCurrentUser: boolean;
  isContinuation: boolean | undefined;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '🎉', '🔥', '👀', '🙏', '💯'];

export default function MessageItem({ message, user, isCurrentUser, isContinuation, onAddReaction }: Props) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const timeStr = message.timestamp.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className={`message-row ${isContinuation ? 'continuation' : ''} ${isCurrentUser ? 'own' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowEmojiPicker(false); }}
    >
      {!isContinuation ? (
        <div className="avatar">{user?.avatar ?? '?'}</div>
      ) : (
        <div className="avatar-placeholder">
          {showActions && <span className="hover-time">{timeStr}</span>}
        </div>
      )}

      <div className="message-content">
        {!isContinuation && (
          <div className="message-meta">
            <span className="message-author">{user?.name ?? '알 수 없음'}</span>
            <span className="message-time">{timeStr}</span>
            {message.isEdited && <span className="edited-tag">(수정됨)</span>}
          </div>
        )}

        <div className="message-bubble">
          <span className="message-text">{message.content}</span>
        </div>

        {message.reactions.length > 0 && (
          <div className="reactions">
            {message.reactions.map(r => (
              <button
                key={r.emoji}
                className="reaction-btn"
                onClick={() => onAddReaction(message.id, r.emoji)}
                title={`${r.count}명이 반응했습니다`}
              >
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}
      </div>

      {showActions && (
        <div className="message-actions">
          <div className="actions-bar">
            <button
              className="action-btn"
              title="이모지 반응"
              onClick={() => setShowEmojiPicker(p => !p)}
            >
              😊
            </button>
            <button className="action-btn" title="스레드에서 답장">&#128172;</button>
            <button className="action-btn" title="더보기">&#8942;</button>
          </div>
          {showEmojiPicker && (
            <div className="emoji-picker">
              {QUICK_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  className="emoji-option"
                  onClick={() => { onAddReaction(message.id, emoji); setShowEmojiPicker(false); }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
