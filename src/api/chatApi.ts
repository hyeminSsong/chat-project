import { ChatRoom } from '../types';

// ★ DB users 테이블의 실제 user_id로 설정 (현재 로그인 사용자)
export const MY_USER_ID = 'U001';

// Spring Boot API가 반환하는 JSON 형태
interface ChatRoomApiItem {
  roomId: string;
  roomName: string | null;
  roomTypeCd: string;
  lastMessageId: string | null;
  lastSenderId: string | null;
  lastSendDtm: string | null; // "2026-06-15T10:30:00"
}

// API 응답 → 프론트엔드 ChatRoom 타입으로 변환
function toFrontendRoom(item: ChatRoomApiItem): ChatRoom {
  return {
    id: item.roomId,
    name: item.roomName ?? '(이름 없음)',
    type: (item.roomTypeCd === 'DIRECT' || item.roomTypeCd === 'DM') ? 'direct' : 'group',
    members: [],     // 추후 멤버 조회 API 연결 시 채울 예정
    unreadCount: 0,  // 추후 읽음 처리 API 연결 시 채울 예정
    lastMessage: item.lastSendDtm
      ? {
          content: '',  // 마지막 메시지 내용은 추후 메시지 조회 API에서 제공
          timestamp: new Date(item.lastSendDtm),
          userId: item.lastSenderId ?? '',
        }
      : undefined,
  };
}

export async function fetchChatRooms(userId: string): Promise<ChatRoom[]> {
  const res = await fetch(`http://localhost:8080/api/chatLists/room?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) {
    throw new Error(`채팅방 목록 조회 실패 (HTTP ${res.status})`);
  }
  const data: ChatRoomApiItem[] = await res.json();
  return data.map(toFrontendRoom);
}
