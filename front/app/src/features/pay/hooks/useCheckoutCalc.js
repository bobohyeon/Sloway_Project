export const useCheckoutCalc = ({
  baseAmt,
  selectedCoupon,
  points,
  agrees,
  heldPoints = 0,
}) => {
  // 예약 금액(amt)이 서비스피 포함 총액 — 별도 serviceFee 없음
  const subtotal = baseAmt ?? 0;

  const couponDiscount = selectedCoupon
    ? selectedCoupon.type === 'percent'
      ? Math.floor((subtotal * selectedCoupon.discount) / 100)
      : selectedCoupon.discount
    : 0;

  // 포인트 사용 최대치 = min(보유, 쿠폰 차감 후 결제액의 30%) — 백엔드 한도와 동일 기준
  const pointBase = Math.max(0, subtotal - couponDiscount);
  const maxUsablePoint = Math.min(heldPoints, Math.floor(pointBase * 0.3));

  const total = subtotal - couponDiscount - points;
  const earnPoints = Math.floor(total * 0.01);

  // 포인트는 0이거나, 최소 1,000P 이상 & 한도 이내일 때만 유효(백엔드 정책과 일치)
  const pointValid = points === 0 || (points >= 1000 && points <= maxUsablePoint);
  const canPay = Object.values(agrees).every(Boolean) && pointValid;

  return { subtotal, couponDiscount, total, earnPoints, canPay, maxUsablePoint, pointValid };
};
