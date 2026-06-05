export const RANGE_PRESETS = [
  { value: 1, label: '전월' },
  { value: 3, label: '3개월' },
  { value: 6, label: '6개월' },
  { value: 12, label: '1년' },
];

export function rangeLabel(months) {
  return months === 1 ? '전월' : `최근 ${months}개월`;
}
