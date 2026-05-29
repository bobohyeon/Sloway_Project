import { createSlice } from '@reduxjs/toolkit';

function parseToken(token) {
  if (!token) return null;

  try {
    const raw = token.startsWith('Bearer ') ? token.slice(7) : token;

    // JWT는 base64url(-, _ 사용, 패딩 생략)이라 표준 base64로 먼저 변환
    const base64 = raw.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');

    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );

    const payload = JSON.parse(json);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null; // 만료된 토큰
    }

    return {
      memberNo: payload.memberNo,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  } catch (e) {
    return null;
  }
}
// ─── 초기 상태 ────────────────────────────────────────────
// 새로고침 시 localStorage 토큰 → user 정보 복구
const token = localStorage.getItem('accessToken');
const initialUser = parseToken(token);

const initialState = {
  isAuthenticated: !!initialUser,
  user: initialUser, // { memberNo, email, role } 또는 null
};

// ─── 슬라이스 정의 ────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const accessToken = action.payload;
      const user = parseToken(accessToken);

      if (!user) {
        // 토큰 파싱 실패 — 잘못된 호출. 무시.
        return;
      }

      state.isAuthenticated = true;
      state.user = user;

      localStorage.setItem('accessToken', accessToken);
    },

    /**
     * 로그아웃 — Redux + localStorage 클리어.
     */
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
