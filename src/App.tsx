import { useState, useRef } from 'react';
import { Message, SidebarView } from './types';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import OrgChart from './components/OrgChart';
import { chatRooms as initialRooms, messages as initialMessages, users, currentUser } from './data/mockData';
import './index.css';

// ── 환경 감지 ─────────────────────────────────────────────────────────────────
const isElectron = typeof window !== 'undefined' && 'electronAPI' in window;

/** URL hash에서 roomId를 읽습니다 (Electron 창 간 파라미터 전달 방식). */
function getRoomIdFromHash(): string | null {
  const hash = window.location.hash.slice(1); // '#roomId=xxx' → 'roomId=xxx'
  return new URLSearchParams(hash).get('roomId');
}

// ── 패널 리사이즈 상수 ─────────────────────────────────────────────────────────
const MIN_LIST_WIDTH = 400;
const MAX_LIST_WIDTH = 560;
const DEFAULT_LIST_WIDTH = 500;

// ── 최상위 라우터 ──────────────────────────────────────────────────────────────
export default function App() {
  const standaloneRoomId = getRoomIdFromHash();

  // hash에 roomId가 있으면 standalone 채팅 창 모드
  if (standaloneRoomId) {
    return <StandaloneChatApp roomId={standaloneRoomId} />;
  }

  // 메인 창 모드
  return <MainApp />;
}

// ── Standalone 채팅 창 ─────────────────────────────────────────────────────────
// Electron에서 채팅방 클릭 시 별도 BrowserWindow로 뜨는 화면
function StandaloneChatApp({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState(initialMessages);

  const room = initialRooms.find(r => r.id === roomId);

  function sendMessage(content: string) {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      roomId,
      content,
      timestamp: new Date(),
      reactions: [],
    };
    setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] ?? []), newMsg] }));
  }

  function addReaction(messageId: string, emoji: string) {
    setMessages(prev => {
      const msgs = prev[roomId] ?? [];
      return {
        ...prev,
        [roomId]: msgs.map(msg => {
          if (msg.id !== messageId) return msg;
          const existing = msg.reactions.find(r => r.emoji === emoji);
          if (existing) {
            const already = existing.userIds.includes(currentUser.id);
            return {
              ...msg,
              reactions: msg.reactions
                .map(r => r.emoji !== emoji ? r : already
                  ? { ...r, count: r.count - 1, userIds: r.userIds.filter(id => id !== currentUser.id) }
                  : { ...r, count: r.count + 1, userIds: [...r.userIds, currentUser.id] }
                )
                .filter(r => r.count > 0),
            };
          }
          return { ...msg, reactions: [...msg.reactions, { emoji, count: 1, userIds: [currentUser.id] }] };
        }),
      };
    });
  }

  if (!room) {
    return (
      <div className="not-found">
        <p>채팅방을 찾을 수 없습니다</p>
        <button onClick={() => window.close()}>닫기</button>
      </div>
    );
  }

  return (
    <div className="standalone-app">
      <ChatWindow
        room={room}
        messages={messages[roomId] ?? []}
        users={users}
        currentUser={currentUser}
        onSendMessage={sendMessage}
        onAddReaction={addReaction}
        onClose={() => window.close()}
      />
    </div>
  );
}

// ── 메인 앱 ───────────────────────────────────────────────────────────────────
// 사이드바 + 채팅 리스트 + (브라우저 모드에서는 인라인 채팅 창)
function MainApp() {
  const [sidebarView, setSidebarView] = useState<SidebarView>('chat');
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState(initialMessages);
  const [listWidth, setListWidth] = useState(DEFAULT_LIST_WIDTH);
  const resizerRef = useRef<HTMLDivElement>(null);

  // 최신 lastMessage를 반영한 rooms 목록
  const rooms = initialRooms.map(room => {
    const msgs = messages[room.id];
    if (!msgs?.length) return room;
    const last = msgs[msgs.length - 1];
    return { ...room, lastMessage: { content: last.content, timestamp: last.timestamp, userId: last.userId } };
  });

  // 채팅방 선택 시:
  // - Electron 모드 → 새 BrowserWindow 오픈 (또는 포커스)
  // - 브라우저 모드 → 인라인 ChatWindow
  function handleSelectRoom(roomId: string) {
    if (isElectron) {
      const room = rooms.find(r => r.id === roomId);
      window.electronAPI!.openChatRoom(roomId, room?.name ?? '채팅');
    } else {
      setSelectedRoomId(roomId);
    }
  }

  function sendMessage(roomId: string, content: string) {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      roomId,
      content,
      timestamp: new Date(),
      reactions: [],
    };
    setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] ?? []), newMsg] }));
  }

  function addReaction(roomId: string, messageId: string, emoji: string) {
    setMessages(prev => {
      const msgs = prev[roomId] ?? [];
      return {
        ...prev,
        [roomId]: msgs.map(msg => {
          if (msg.id !== messageId) return msg;
          const existing = msg.reactions.find(r => r.emoji === emoji);
          if (existing) {
            const already = existing.userIds.includes(currentUser.id);
            return {
              ...msg,
              reactions: msg.reactions
                .map(r => r.emoji !== emoji ? r : already
                  ? { ...r, count: r.count - 1, userIds: r.userIds.filter(id => id !== currentUser.id) }
                  : { ...r, count: r.count + 1, userIds: [...r.userIds, currentUser.id] }
                )
                .filter(r => r.count > 0),
            };
          }
          return { ...msg, reactions: [...msg.reactions, { emoji, count: 1, userIds: [currentUser.id] }] };
        }),
      };
    });
  }

  function handleResizerMouseDown(e: React.MouseEvent) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = listWidth;
    resizerRef.current?.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    function onMove(e: MouseEvent) {
      setListWidth(Math.max(MIN_LIST_WIDTH, Math.min(MAX_LIST_WIDTH, startWidth + e.clientX - startX)));
    }
    function onUp() {
      resizerRef.current?.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }

  // Electron 모드에서는 인라인 ChatWindow를 쓰지 않음 (별도 창에서 열림)
  const selectedRoom = !isElectron ? (rooms.find(r => r.id === selectedRoomId) ?? null) : null;

  return (
    <div className="app">
      <Sidebar view={sidebarView} onViewChange={setSidebarView} currentUser={currentUser} />

      <div className="main-area">
        {sidebarView === 'chat' ? (
          <>
            <div
              className={`list-panel${selectedRoom ? '' : ' full'}`}
              style={selectedRoom ? { width: listWidth } : undefined}
            >
              <ChatList
                rooms={rooms}
                users={users}
                currentUser={currentUser}
                selectedRoomId={isElectron ? null : selectedRoomId}
                onSelectRoom={handleSelectRoom}
              />
            </div>

            {selectedRoom && (
              <>
                <div
                  ref={resizerRef}
                  className="panel-resizer"
                  onMouseDown={handleResizerMouseDown}
                />
                <div className="window-panel">
                  <ChatWindow
                    room={selectedRoom}
                    messages={messages[selectedRoom.id] ?? []}
                    users={users}
                    currentUser={currentUser}
                    onSendMessage={content => sendMessage(selectedRoom.id, content)}
                    onAddReaction={(msgId, emoji) => addReaction(selectedRoom.id, msgId, emoji)}
                    onClose={() => setSelectedRoomId(null)}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <OrgChart users={users} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
}
