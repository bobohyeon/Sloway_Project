import { createSlice } from '@reduxjs/toolkit';

function parseToken(token) {
  if (!token) return null;

  try {
    const raw = token.startsWith('Bearer ') ? token.slice(7) : token;

    // base64url → base64 변환 후 UTF-8 디코딩 (한글 안 깨지게)
    const base64 = raw.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
    );
    const payload = JSON.parse(json);

    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
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

// 토큰엔 프로필 사진이 없으므로 별도 저장해 둔 imgUrl을 머지한다.
// (이게 있어야 새로고침 후에도 헤더에 사진이 유지됨)
if (initialUser) {
  initialUser.imgUrl = localStorage.getItem('profileImgUrl') ?? null;
}

const initialState = {
  isAuthenticated: !!initialUser,
  user: initialUser, // { memberNo, email, role, name, imgUrl } 또는 null
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
     * 프로필 사진 URL 갱신 — 인증과 분리된 단일 경로(SSOT).
     * 로그인 직후·프로필 수정 후 모두 이걸 호출하면 헤더가 함께 갱신된다.
     * 토큰엔 사진이 없으므로 localStorage에도 영속(새로고침 유지).
     */
    setProfileImage(state, action) {
      const imgUrl = action.payload || null; // 빈 문자열/undefined → null (사진 제거)
      if (state.user) {
        state.user.imgUrl = imgUrl;
      }
      if (imgUrl) {
        localStorage.setItem('profileImgUrl', imgUrl);
      } else {
        localStorage.removeItem('profileImgUrl');
      }
    },

    /**
     * 로그아웃 — Redux + localStorage 클리어.
     */
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('profileImgUrl'); // 계정 전환 시 이전 사진 잔류 방지
    },
  },
});

export const { login, logout, setProfileImage } = authSlice.actions;
export default authSlice.reducer;
