import { createSlice } from '@reduxjs/toolkit';

function parseToken(token) {
  if (!token) return null;

  try {
    // 'Bearer xxx.yyy.zzz' → 'xxx.yyy.zzz'
    const raw = token.startsWith('Bearer ') ? token.slice(7) : token;
    const payload = JSON.parse(atob(raw.split('.')[1]));

    // 만료 확인 (exp는 초 단위, Date.now()는 ms 단위)
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null; // 만료된 토큰
    }

    return {
      memberNo: payload.memberNo,
      email: payload.email,
      role: payload.role,
    };
  } catch (e) {
    // 토큰 형식 잘못됐거나 Base64 디코딩 실패
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
