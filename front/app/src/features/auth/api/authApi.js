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
  const response = await api.post('/auth/signup', data);
  return response.data;
};
