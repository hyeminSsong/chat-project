// preload.cjs에서 contextBridge로 노출하는 API에 대한 TypeScript 타입 선언
export {};

declare global {
  interface Window {
    electronAPI?: {
      openChatRoom: (roomId: string, roomName: string) => void;
    };
  }
}
