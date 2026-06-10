export const RANGE_PRESETS = [
  { value: 1, label: '이번 달' },
  { value: 3, label: '3개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '1년' },
];

export function rangeLabel(months) {
  return months === 1 ? '이번 달' : `최근 ${months}개월`;
}

// 통계 기준 시점 — 시드 더미(2025-06~2026-05)에 맞춘 고정 앵커. PC 시계와 무관.
// 운영 전환 시 이 한 줄만 `const DEMO_NOW = new Date();` 로 바꾸면 됨.
const DEMO_NOW = new Date(2026, 5, 5); // 2026-06-05 (month는 0-base라 5=6월)

// 통계 기준 시점 — 진행 중인 "이번 달(당월)" {year, month(1-base)} 반환
export function getAnchorMonth() {
  const d = new Date(DEMO_NOW);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}
