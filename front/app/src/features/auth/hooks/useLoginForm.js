import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../api/authApi';
import { login, setProfileImage } from '../store/authSlice';

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
  const [suspended, setSuspended] = useState(false); // 정지 계정 여부
  const [loading, setLoading] = useState(false);

  /**
   * 폼 제출 처리.
   * form의 onSubmit에 직접 연결 — preventDefault 내부 처리.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuspended(false); // 재시도 시 초기화

    // 입력값 사전 검증 (백엔드도 검증하지만 빠른 피드백)
    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      const result = await userLogin(email, password);

      localStorage.setItem('refreshToken', result.refreshToken);

      dispatch(login(result.accessToken));
      dispatch(setProfileImage(result.imgUrl)); // 로그인 직후 헤더에 프로필 사진 반영
      navigate('/user/mypage');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요';

      // 정지 계정이면 사유 + 고객센터 안내를 알람으로
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
    suspended,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
  };
}
