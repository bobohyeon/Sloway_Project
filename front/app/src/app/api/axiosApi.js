import axios from 'axios';

const api = axios.create({
  // 로컬 개발(npm run dev)은 로컬 백엔드, 배포 빌드는 운영 서버로 자동 분기
  baseURL: import.meta.env.DEV
    ? 'http://localhost:8080/api'
    : 'https://api.sloway.store/api',
});
// ─── 요청 인터셉터 ─────────────────────────────────────────
// 모든 API 호출 시 토큰을 자동으로 헤더에 박는다.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    // 백엔드 LoginFilter가 응답할 때 이미 'Bearer xxx' 형태로 박혀있어 그대로 사용
    config.headers.Authorization = token;
  }
  return config;
});

// ─── 응답 인터셉터 ─────────────────────────────────────────
// 401(인증 실패/토큰 만료) 발생 시 자동 로그아웃.
// 로그인 페이지에서 발생한 401은 컴포넌트가 처리하게 둠 (메시지 표시).
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // 로그인 시도 자체의 401은 컴포넌트가 처리하게 통과
      const isLoginRequest = err.config?.url?.includes('/auth/login');

      if (!isLoginRequest) {
        // 보호된 API 호출에서 401 = 토큰 무효 → 클리어 + 로그인 페이지로
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // 무한 루프 방지 — 이미 로그인 페이지면 이동 안 함
        const path = window.location.pathname;
        if (
          !path.startsWith('/login') &&
          !path.startsWith('/host/login') &&
          !path.startsWith('/admin/login')
        ) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
