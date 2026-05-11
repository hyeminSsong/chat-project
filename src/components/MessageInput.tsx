import { useState, useRef, KeyboardEvent } from 'react';
import './MessageInput.css';

interface Props {
  roomName: string;
  onSend: (content: string) => void;
}

export default function MessageInput({ roomName, onSend }: Props) {
  const [value, setValue] = useState('');
  const [isBold, setIsBold] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    setIsBold(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  }

  return (
    <div className="message-input-container">
      <div className="input-toolbar">
        <button className={`toolbar-btn${isBold ? ' active' : ''}`} onClick={() => setIsBold(b => !b)} title="굵게"><b>B</b></button>
        <button className="toolbar-btn" title="기울임"><i>I</i></button>
        <button className="toolbar-btn" title="취소선"><s>S</s></button>
        <div className="toolbar-divider" />
        <button className="toolbar-btn" title="링크">&#128279;</button>
        <button className="toolbar-btn" title="코드">&#60;/&#62;</button>
        <button className="toolbar-btn" title="목록">&#9776;</button>
      </div>
      <div className="input-row">
        <button className="attach-btn" title="파일 첨부">+</button>
        <textarea
          ref={textareaRef}
          className={`message-textarea${isBold ? ' bold-text' : ''}`}
          placeholder={`${roomName}에 메시지 보내기`}
          value={value}
          onChange={e => { setValue(e.target.value); autoResize(); }}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <div className="input-right-actions">
          <button className="emoji-btn" title="이모지">😊</button>
          <button
            className={`send-btn${value.trim() ? ' active' : ''}`}
            onClick={handleSend}
            disabled={!value.trim()}
            title="메시지 보내기 (Enter)"
          >
            &#9658;
          </button>
        </div>
      </div>
    </div>
  );
}
