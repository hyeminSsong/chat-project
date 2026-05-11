'use strict';

const { contextBridge, ipcRenderer } = require('electron');

/**
 * contextBridge를 통해 renderer(React)에 안전한 API를 노출합니다.
 * nodeIntegration이 꺼져 있어도 ipcRenderer를 직접 노출하지 않고
 * 필요한 메서드만 래핑해서 노출합니다.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * 채팅방 창을 엽니다 (이미 열려있으면 포커스).
   * @param {string} roomId
   * @param {string} roomName
   */
  openChatRoom: (roomId, roomName) => {
    ipcRenderer.send('open-chat-room', { roomId, roomName });
  },
});
