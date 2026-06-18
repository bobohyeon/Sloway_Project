import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { hostLogin } from '../api/authApi';
import { login, setProfileImage } from '../store/authSlice';

/**
 * 호스트 로그인 폼 훅.
 *
 * <p>useLoginForm과 거의 동일. 차이는:
 * <ul>
 *   <li>API: hostLogin (/api/host/auth/login)</li>
 *   <li>이동 경로: /host/dashboard</li>
 * </ul>
 *
 * <p>JWT에 role='H'가 박혀있어 authSlice가 알아서 호스트로 인식.
 */
export function useHostLoginForm() {
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
      const result = await hostLogin(email, password);

      localStorage.setItem('refreshToken', result.refreshToken);
      dispatch(login(result.accessToken));
      dispatch(setProfileImage(result.imgUrl)); // 로그인 직후 헤더에 프로필 사진 반영

      navigate('/host/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요';

      if (err.response?.data?.suspended === true) {
        alert(msg + '\n\n문의: support@sloway.com');
      } else {
        setError(msg);
      }
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
