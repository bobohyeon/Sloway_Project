export const useCheckoutCalc = ({
  pricePerNight,
  nights,
  serviceFee,
  selectedCoupon,
  points,
  agrees,
}) => {
  const subtotal = pricePerNight * nights;

  const couponDiscount = selectedCoupon
    ? selectedCoupon.type === 'percent'
      ? Math.floor((subtotal * selectedCoupon.discount) / 100)
      : selectedCoupon.discount
    : 0;

  const total = subtotal + serviceFee - couponDiscount - points;
  const earnPoints = Math.floor(total * 0.01);

  const canPay = Object.values(agrees).every(Boolean);

  return { subtotal, couponDiscount, total, earnPoints, canPay };
};
