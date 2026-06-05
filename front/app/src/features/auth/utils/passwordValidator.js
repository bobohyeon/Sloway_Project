// 비밀번호 정책: 8자 이상 + 영문 + 숫자 + 특수문자 각 1개 이상
// 백엔드 PasswordValidator와 동일 정책 (프론트는 사전 안내용, 최종 검증은 서버)
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=]).{8,}$/;

export const PASSWORD_GUIDE = '8자 이상, 영문·숫자·특수문자를 포함해주세요.';

/**
 * 비밀번호 정책 검증.
 * @returns {boolean} 정책 통과 여부
 */
export const isValidPassword = (password) => {
  return PASSWORD_PATTERN.test(password ?? '');
};
