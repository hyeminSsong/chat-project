import { useState } from 'react';
import { ChatRoom, User } from '../types';
import './NewChatModal.css';

interface Props {
  users: User[];
  onClose : () => void
}

export default function NewChatModal({
  users,
  onClose
} :Props) {
return (
  <div className="modal-overlay">
    <div className="modal-box">
      <h2>새 대화</h2>

      <button onClick={onClose}>
        닫기
      </button>
    </div>
  </div>
);
}