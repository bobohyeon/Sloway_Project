import api from '../../../app/api/axiosApi';

/**
 * 인증 도메인 API 함수 모음.
 *
 * <p>로그인/가입/이메일 인증 등 우리 영역의 백엔드 호출을 한 자리에서 관리.
 * 컴포넌트는 이 함수만 import — axios 직접 호출 금지.
 */

// ─── 일반회원 로그인 ──────────────────────────────────────

export const userLogin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// ─── 호스트 로그인 ────────────────────────────────────────
export const hostLogin = async (email, password) => {
  const response = await api.post('/host/auth/login', { email, password });
  return response.data;
};

// ─── 어드민 로그인 ────────────────────────────────────────
export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/auth/login', { email, password });
  return response.data;
};

// ─── 이메일 중복확인 (공통) ───────────────────────────────
export const checkEmail = async (email) => {
  const response = await api.get('/auth/email/check', { params: { email } });
  return response.data;
};

// ─── 이메일 인증번호 발송 ─────────────────────────────────
export const sendVerifyCode = async (email) => {
  const response = await api.post('/auth/email/send-code', { email });
  return response.data;
};

// ─── 이메일 인증번호 확인 ─────────────────────────────────
export const verifyCode = async (email, code) => {
  const response = await api.post('/auth/email/verify-code', { email, code });
  return response.data;
};

// ─── 일반회원 가입 ────────────────────────────────────────
export const userSignup = async (data) => {
  const response = await api.post('/auth/join', data); // /auth/signup → /auth/join
  return response.data;
};

// ─── 비밀번호 재설정 ────────────────────────────────────────
export const resetPassword = async (email, newPassword) => {
  const response = await api.post('/auth/password/reset', {
    email,
    newPassword,
  });
  return response.data;
};

/**
 * 호스트 신청 (사업자등록증 PDF 포함).
 * 백엔드가 multipart로 받음: dto(JSON) + businessDoc(파일).
 *
 * @param {object} data       가입 정보 (email, password, name, phone, birthDate, businessName, businessNo)
 * @param {File}   businessDoc 사업자등록증 파일
 */
export const hostSignup = async (data, businessDoc) => {
  const formData = new FormData();

  // dto 파트: JSON을 Blob으로 감싸 Content-Type을 application/json으로 명시
  // (그냥 객체를 append하면 "[object Object]" 문자열이 되어 백엔드 파싱 실패)
  formData.append(
    'dto',
    new Blob([JSON.stringify(data)], { type: 'application/json' })
  );

  // businessDoc 파트: 파일 그대로
  formData.append('businessDoc', businessDoc);

  const response = await api.post('/host/join', formData);
  return response.data;
};

// 카카오 로그인 시작 — 카카오 인증 페이지로 이동
export const startKakaoLogin = () => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  if (!clientId) {
    // 환경변수 누락 시 client_id=undefined로 카카오 에러 → 빠르게 막고 안내
    alert('카카오 로그인 설정이 누락됐어요. 잠시 후 다시 시도해주세요.');
    return;
  }
  // axiosApi.js와 동일하게 빌드 환경으로 백엔드 콜백 주소 분기
  const redirectUri = import.meta.env.DEV
    ? 'http://localhost:8080/api/auth/oauth/kakao/callback'
    : 'https://api.sloway.store/api/auth/oauth/kakao/callback';
  const url =
    `https://kauth.kakao.com/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code`;
  window.location.href = url;
};

export const findEmail = async (name, phone) => {
  const response = await api.post('/auth/find-email', { name, phone });
  return response.data; // { maskedEmail }
};
