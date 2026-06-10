import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Electron의 file:// 프로토콜에서 정적 에셋이 올바른 상대 경로를 가지도록
  // 프로덕션 빌드 시에만 './' 사용
  base: process.env.ELECTRON_BUILD ? './' : '/chat-project/',
});
