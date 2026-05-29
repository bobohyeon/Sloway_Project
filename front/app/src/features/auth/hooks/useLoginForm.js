import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../api/authApi';
import { login } from '../store/authSlice';

/**
 * 일반회원 로그인 폼 훅.
 *
 * <p>폼 상태(email, password) + 비동기 제출(handleSubmit) + 에러/로딩 상태를
 * 한 자리에서 관리. 페이지 컴포넌트는 화면 조립에만 집중.
 *
 * <h3>제공 값/함수</h3>
 * <ul>
 *   <li>email, password — 입력값</li>
 *   <li>setEmail, setPassword — 입력 변경 핸들러</li>
 *   <li>error — 에러 메시지 (없으면 빈 문자열)</li>
 *   <li>loading — 제출 중 여부</li>
 *   <li>handleSubmit — 폼 제출 함수 (form onSubmit에 연결)</li>
 * </ul>
 *
 * <h3>성공 시</h3>
 * <ul>
 *   <li>refreshToken을 localStorage에 저장</li>
 *   <li>accessToken을 Redux login 액션에 디스패치 (JWT 파싱 + localStorage 저장)</li>
 *   <li>마이페이지로 이동</li>
 * </ul>
 */
export function useLoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ─── 폼 상태 ────────────────────────────────────────
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * 폼 제출 처리.
   * form의 onSubmit에 직접 연결 — preventDefault 내부 처리.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 입력값 사전 검증 (백엔드도 검증하지만 빠른 피드백)
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const result = await userLogin(email, password);

      // refreshToken은 별도 저장 (자동 갱신 시 사용 예정)
      localStorage.setItem('refreshToken', result.refreshToken);

      // accessToken은 Redux 액션이 localStorage 저장 + JWT 파싱 + state 갱신 모두 처리
      dispatch(login(result.accessToken));

      navigate('/user/mypage');
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
