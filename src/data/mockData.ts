import { User, ChatRoom, Message } from '../types';

export const currentUser: User = {
  id: 'u1',
  name: '김민준',
  avatar: 'KM',
  status: 'online',
  department: '개발팀',
  position: '시니어 개발자',
};

export const users: User[] = [
  currentUser,
  { id: 'u2', name: '이서연', avatar: 'LS', status: 'online',  department: '개발팀',  position: '프론트엔드 개발자' },
  { id: 'u3', name: '박지훈', avatar: 'PJ', status: 'away',    department: '개발팀',  position: '백엔드 개발자' },
  { id: 'u4', name: '최예린', avatar: 'CY', status: 'offline', department: '디자인팀', position: 'UI/UX 디자이너' },
  { id: 'u5', name: '정도윤', avatar: 'JD', status: 'online',  department: '기획팀',  position: '프로덕트 매니저' },
  { id: 'u6', name: '한소희', avatar: 'HS', status: 'online',  department: '인사팀',  position: 'HR 매니저' },
];

const now = new Date();
const mins = (n: number) => new Date(now.getTime() - n * 60 * 1000);

export const chatRooms: ChatRoom[] = [
  {
    id: 'r1',
    type: 'group',
    name: '개발팀 전체',
    members: ['u1', 'u2', 'u3'],
    unreadCount: 3,
    description: '개발팀 공용 채널',
    lastMessage: { content: '핫픽스 배포 완료됐습니다! 확인 부탁드려요.', timestamp: mins(5), userId: 'u3' },
  },
  {
    id: 'r2',
    type: 'group',
    name: '프로젝트 알파',
    members: ['u1', 'u2', 'u3', 'u5'],
    unreadCount: 0,
    description: '알파 프로젝트 채널',
    lastMessage: { content: '다음 스프린트 계획 공유드릴게요 📋', timestamp: mins(30), userId: 'u5' },
  },
  {
    id: 'r3',
    type: 'group',
    name: '전사 공지',
    members: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    unreadCount: 1,
    description: '전사 공지 채널',
    lastMessage: { content: '이번 주 금요일 워크샵 공지입니다.', timestamp: mins(120), userId: 'u6' },
  },
  {
    id: 'r4',
    type: 'group',
    name: '디자인 리뷰',
    members: ['u1', 'u2', 'u4'],
    unreadCount: 0,
    description: 'UI/UX 디자인 리뷰',
    lastMessage: { content: '새 온보딩 화면 시안 올렸어요!', timestamp: mins(200), userId: 'u4' },
  },
  {
    id: 'dm-u2',
    type: 'direct',
    name: '이서연',
    members: ['u1', 'u2'],
    unreadCount: 1,
    lastMessage: { content: 'PR 리뷰 부탁드려요! 😊', timestamp: mins(15), userId: 'u2' },
  },
  {
    id: 'dm-u3',
    type: 'direct',
    name: '박지훈',
    members: ['u1', 'u3'],
    unreadCount: 0,
    lastMessage: { content: '오늘 점심 같이 먹을까요?', timestamp: mins(80), userId: 'u1' },
  },
  {
    id: 'dm-u5',
    type: 'direct',
    name: '정도윤',
    members: ['u1', 'u5'],
    unreadCount: 0,
    lastMessage: { content: '스프린트 회고 자료 공유드립니다.', timestamp: mins(240), userId: 'u5' },
  },
];

export const messages: Record<string, Message[]> = {
  r1: [
    { id: 'm1', userId: 'u2', roomId: 'r1', content: '안녕하세요! 오늘 스탠드업 미팅은 오전 10시에 진행됩니다 👋', timestamp: mins(120), reactions: [{ emoji: '👍', count: 3, userIds: ['u1','u3','u4'] }] },
    { id: 'm2', userId: 'u3', roomId: 'r1', content: '확인했습니다! 잠깐 늦을 수도 있을 것 같아요.', timestamp: mins(110), reactions: [] },
    { id: 'm3', userId: 'u1', roomId: 'r1', content: '괜찮아요! 시작하고 합류해주세요 😊', timestamp: mins(108), reactions: [] },
    { id: 'm4', userId: 'u2', roomId: 'r1', content: '어제 배포된 버전에서 로그인 이슈가 발생했습니다. 긴급 확인 부탁드려요!', timestamp: mins(60), reactions: [{ emoji: '🚨', count: 3, userIds: ['u1','u2','u3'] }] },
    { id: 'm5', userId: 'u1', roomId: 'r1', content: '지금 바로 확인할게요. 어떤 환경에서 발생하는 건가요?', timestamp: mins(58), reactions: [] },
    { id: 'm6', userId: 'u2', roomId: 'r1', content: '크롬, 사파리 모두 동일하게 발생해요. 에러는 "Cannot read properties of undefined"입니다.', timestamp: mins(55), reactions: [] },
    { id: 'm7', userId: 'u3', roomId: 'r1', content: '원인 파악했습니다. null check가 빠져있었네요. 핫픽스 올릴게요!', timestamp: mins(20), reactions: [{ emoji: '🙏', count: 2, userIds: ['u1','u2'] }, { emoji: '💪', count: 1, userIds: ['u4'] }], isEdited: true },
    { id: 'm8', userId: 'u3', roomId: 'r1', content: '핫픽스 배포 완료됐습니다! 확인 부탁드려요.', timestamp: mins(5), reactions: [] },
  ],
  r2: [
    { id: 'r2m1', userId: 'u5', roomId: 'r2', content: '프로젝트 알파 1차 마일스톤 달성 축하드립니다! 🎉', timestamp: mins(300), reactions: [{ emoji: '🎉', count: 4, userIds: ['u1','u2','u3','u5'] }] },
    { id: 'r2m2', userId: 'u1', roomId: 'r2', content: '수고하셨습니다! 다음 스프린트도 잘 부탁드려요.', timestamp: mins(290), reactions: [] },
    { id: 'r2m3', userId: 'u2', roomId: 'r2', content: '테스트 커버리지도 85%로 올렸어요 💪', timestamp: mins(280), reactions: [{ emoji: '👍', count: 2, userIds: ['u1','u5'] }] },
    { id: 'r2m4', userId: 'u5', roomId: 'r2', content: '다음 스프린트 계획 공유드릴게요 📋', timestamp: mins(30), reactions: [] },
  ],
  r3: [
    { id: 'r3m1', userId: 'u6', roomId: 'r3', content: '안녕하세요! 이번 주 금요일 오후 2시에 전사 워크샵이 있습니다. 많이 참석해주세요!', timestamp: mins(120), reactions: [{ emoji: '👍', count: 5, userIds: ['u1','u2','u3','u4','u5'] }] },
  ],
  r4: [
    { id: 'r4m1', userId: 'u4', roomId: 'r4', content: '새 온보딩 화면 시안 올렸어요! 피드백 부탁드립니다.', timestamp: mins(200), reactions: [] },
    { id: 'r4m2', userId: 'u2', roomId: 'r4', content: '전반적으로 깔끔한데 버튼 색상이 브랜드 가이드와 살짝 다른 것 같아요!', timestamp: mins(190), reactions: [] },
    { id: 'r4m3', userId: 'u4', roomId: 'r4', content: '아 맞아요! 수정해서 다시 올릴게요 😅', timestamp: mins(185), reactions: [] },
  ],
  'dm-u2': [
    { id: 'dm2m1', userId: 'u2', roomId: 'dm-u2', content: '안녕하세요 민준님! 오늘 코드 리뷰 시간 괜찮으세요?', timestamp: mins(60), reactions: [] },
    { id: 'dm2m2', userId: 'u1', roomId: 'dm-u2', content: '네! 오후 3시 이후로 가능해요 😊', timestamp: mins(55), reactions: [] },
    { id: 'dm2m3', userId: 'u2', roomId: 'dm-u2', content: '좋아요! 그때 봐요. PR 리뷰 부탁드려요! 😊', timestamp: mins(15), reactions: [] },
  ],
  'dm-u3': [
    { id: 'dm3m1', userId: 'u1', roomId: 'dm-u3', content: '지훈님, API 문서 업데이트됐나요?', timestamp: mins(90), reactions: [] },
    { id: 'dm3m2', userId: 'u3', roomId: 'dm-u3', content: '네! 방금 Confluence에 올렸어요.', timestamp: mins(85), reactions: [] },
    { id: 'dm3m3', userId: 'u1', roomId: 'dm-u3', content: '오늘 점심 같이 먹을까요?', timestamp: mins(80), reactions: [] },
  ],
  'dm-u5': [
    { id: 'dm5m1', userId: 'u5', roomId: 'dm-u5', content: '민준님, 이번 스프린트 목표 조율 필요할 것 같아요.', timestamp: mins(260), reactions: [] },
    { id: 'dm5m2', userId: 'u1', roomId: 'dm-u5', content: '동의해요. 내일 미팅에서 얘기해봐요.', timestamp: mins(250), reactions: [] },
    { id: 'dm5m3', userId: 'u5', roomId: 'dm-u5', content: '스프린트 회고 자료 공유드립니다.', timestamp: mins(240), reactions: [] },
  ],
};
