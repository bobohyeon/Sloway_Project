export const PAY_METHOD_MAP = {
  kakao: 'KAKAOPAY',
  naver: 'NAVERPAY',
  toss: 'TOSSPAY',
};

export const toPayMethod = (id) => PAY_METHOD_MAP[id] ?? null;
