/**
 * JWT role 값 정규화.
 * 백엔드가 role을 단일문자(U/H/A)로 발급함 → 표준 역할명으로 변환.
 * (ApprovalState P/A/R/V 와 같은 단일문자 컨벤션)
 *
 * ROLE_ prefix·소문자·MEMBER 표기까지 흡수해서, 백엔드 표기가 바뀌어도 안전.
 * 가드·헤더·사이드바·리다이렉트 등 role 비교가 필요한 모든 곳에서 이 함수를 쓸 것.
 */
export const normalizeRole = (role) => {
  const r = (role ?? '').toUpperCase().replace(/^ROLE_/, '');
  if (r.startsWith('A')) return 'ADMIN';
  if (r.startsWith('H')) return 'HOST';
  if (r.startsWith('U') || r === 'MEMBER' || r === 'M') return 'USER';
  return r;
};
