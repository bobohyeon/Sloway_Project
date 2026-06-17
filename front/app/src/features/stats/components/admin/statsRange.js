export const RANGE_PRESETS = [
  { value: 1, label: '이번 달' },
  { value: 3, label: '3개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '1년' },
];

export function rangeLabel(months) {
  return months === 1 ? '이번 달' : `최근 ${months}개월`;
}

// 통계 기준 시점 — 실제 오늘(PC 시계) 기준. 달이 바뀌면 "이번 달"도 자동으로 따라감.
// ※ 옛 시드 데이터(2025-06~2026-05)는 현재 달이 그 범위를 벗어나면 "이번 달" 뷰에서 안 보임
//   → 포폴/운영 시 시드를 현재 기준으로 재적재 필요.
const DEMO_NOW = new Date();

// 통계 기준 시점 — 진행 중인 "이번 달(당월)" {year, month(1-base)} 반환
export function getAnchorMonth() {
  const d = new Date(DEMO_NOW);
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}
