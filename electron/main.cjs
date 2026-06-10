'use strict';

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// ── 환경 감지 ────────────────────────────────────────────────────────────────
const isDev = !app.isPackaged;
const DEV_URL = 'http://localhost:5173';

// ── 창 참조 ──────────────────────────────────────────────────────────────────
/** @type {BrowserWindow | null} */
let mainWindow = null;

/** @type {Map<string, BrowserWindow>} roomId → BrowserWindow */
const chatWindows = new Map();

// ── 헬퍼 ─────────────────────────────────────────────────────────────────────
function preloadPath() {
  return path.join(__dirname, 'preload.cjs');
}

/**
 * BrowserWindow에 URL을 로드합니다.
 * - 개발: Vite dev server (http://localhost:5173)
 * - 프로덕션: 빌드된 정적 파일 (file://)
 * roomId가 있으면 hash로 전달해 standalone 채팅 모드를 활성화합니다.
 */
function loadWindow(win, roomId = null) {
  if (isDev) {
    const url = roomId
      ? `${DEV_URL}/#roomId=${encodeURIComponent(roomId)}`
      : DEV_URL;
    win.loadURL(url);
  } else {
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    if (roomId) {
      win.loadFile(indexPath, { hash: `roomId=${encodeURIComponent(roomId)}` });
    } else {
      win.loadFile(indexPath);
    }
  }
}

// ── 메인 창 생성 ─────────────────────────────────────────────────────────────
// 카카오톡 PC 앱과 유사한 좁고 긴 레이아웃
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 720,
    minWidth: 380,
    minHeight: 500,
    title: '사내 메신저',
    webPreferences: {
      preload: preloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  loadWindow(mainWindow, null);

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ── 채팅 창 생성 / 포커스 ────────────────────────────────────────────────────
function openChatWindow(roomId, roomName) {
  // 이미 열려 있으면 포커스만 이동
  const existing = chatWindows.get(roomId);
  if (existing) {
    if (existing.isMinimized()) existing.restore();
    existing.focus();
    return;
  }

  const win = new BrowserWindow({
    width: 450,
    height: 720,
    minWidth: 380,
    minHeight: 500,
    title: roomName,
    webPreferences: {
      preload: preloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  loadWindow(win, roomId);

  chatWindows.set(roomId, win);

  // 창이 닫히면 Map에서 제거
  win.on('closed', () => {
    chatWindows.delete(roomId);
  });
}

// ── IPC 핸들러 ───────────────────────────────────────────────────────────────
ipcMain.on('open-chat-room', (_event, { roomId, roomName }) => {
  openChatWindow(roomId, roomName);
});

// ── 앱 수명주기 ──────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createMainWindow();

  // macOS: Dock 클릭 시 창이 없으면 재생성
  app.on('activate', () => {
    if (mainWindow === null) createMainWindow();
  });
});

// Windows / Linux: 마지막 창이 닫히면 앱 종료
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
