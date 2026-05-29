import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction } from '../store/authSlice';

/**
 * 인증 상태 읽기 + 로그아웃을 한 곳에서 제공하는 훅.
 *
 * 헤더(MainHeader/Header)처럼 "로그인 여부에 따라 화면이 갈리는" 컴포넌트가
 * useSelector/useDispatch/navigate를 각자 복붙하지 않도록 모아둔다.
 */
const MYPAGE_PATH = {
  U: '/user/mypage',
  H: '/host/profile',
  A: '/admin/dashboard',
};

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  /**
   * 로그아웃: Redux state + localStorage 토큰 정리 후 이동.
   * @param {string} redirectTo 이동할 경로 (기본: 메인)
   */
  const handleLogout = (redirectTo = '/') => {
    dispatch(logoutAction()); // state 초기화 + accessToken/refreshToken 제거 (authSlice가 처리)
    navigate(redirectTo);
  };

  return {
    isAuthenticated,
    user,
    role: user?.role ?? null, // user가 null이어도 안전하게 (옵셔널 체이닝)
    myPagePath: MYPAGE_PATH[user?.role] ?? '/user/mypage',
    handleLogout,
  };
}
