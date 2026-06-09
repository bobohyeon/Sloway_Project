import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 전역으로 Buffer와 global 객체 정의
    global: 'window',
    'process.env': {},
  },
  resolve: {
    alias: {
      // buffer 모듈을 브라우저용으로 매핑
      buffer: 'buffer/',
    },
  },
});
