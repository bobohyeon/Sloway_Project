import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { normalizeRole } from '../utils/role';

/**
 * 역할 기반 라우트 가드.
 * - 미인증 → 로그인 페이지로
 * - 역할 불일치 → 자기 홈으로 (호스트가 어드민 URL 치면 호스트 대시보드로 튕김)
 *
 * 백엔드(SecurityConfig)가 데이터는 이미 막음. 이건 "화면 진입" 차단용.
 */
const RoleRoute = ({ allow }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const role = normalizeRole(user?.role);

  // 1) 미인증 → 로그인으로 (allow에 맞는 로그인 화면으로)
  if (!isAuthenticated) {
    const loginPath =
      allow === 'ADMIN'
        ? '/admin/login'
        : allow === 'HOST'
          ? '/host/login'
          : '/login';
    return <Navigate to={loginPath} replace />;
  }

  // 2) 역할 불일치 → 자기 홈으로 (진입 차단)
  if (role !== allow) {
    const home =
      role === 'ADMIN'
        ? '/admin/dashboard'
        : role === 'HOST'
          ? '/host/dashboard'
          : '/';
    return <Navigate to={home} replace />;
  }

  // 3) 통과
  return <Outlet />;
};

export default RoleRoute;
