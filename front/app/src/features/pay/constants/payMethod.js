export const PAY_METHOD_MAP = {
  kakao: 'KAKAOPAY',
  toss: 'TOSSPAY',
};

export const toPayMethod = (id) => PAY_METHOD_MAP[id] ?? null;
