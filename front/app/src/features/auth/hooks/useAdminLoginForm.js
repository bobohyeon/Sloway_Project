import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { adminLogin } from '../api/authApi';
import { login } from '../store/authSlice';

/**
 * 어드민 로그인 폼 훅.
 *
 * <p>일반회원/호스트와 동일 패턴. 차이:
 * <ul>
 *   <li>API: adminLogin (/api/admin/auth/login)</li>
 *   <li>이동 경로: /admin/dashboard</li>
 * </ul>
 *
 * <p>JWT에 role='A'가 박혀있어 authSlice가 알아서 어드민으로 인식.
 */
export function useAdminLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const result = await adminLogin(email, password);

      localStorage.setItem('refreshToken', result.refreshToken);
      dispatch(login(result.accessToken));

      navigate('/admin/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
