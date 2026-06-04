export const useCheckoutCalc = ({
  baseAmt,
  selectedCoupon,
  points,
  agrees,
}) => {
  // 예약 금액(amt)이 서비스피 포함 총액 — 별도 serviceFee 없음
  const subtotal = baseAmt ?? 0;

  const couponDiscount = selectedCoupon
    ? selectedCoupon.type === 'percent'
      ? Math.floor((subtotal * selectedCoupon.discount) / 100)
      : selectedCoupon.discount
    : 0;

  const total = subtotal - couponDiscount - points;
  const earnPoints = Math.floor(total * 0.01);

  const canPay = Object.values(agrees).every(Boolean);

  return { subtotal, couponDiscount, total, earnPoints, canPay };
};
