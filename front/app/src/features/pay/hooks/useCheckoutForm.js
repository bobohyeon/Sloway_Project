import { useState } from 'react';

export const useCheckoutForm = () => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('kakao');
  const [agrees, setAgrees] = useState({
    terms: false,
    privacy: false,
    refund: false,
  });

  return {
    selectedCoupon,
    setSelectedCoupon,
    couponModalOpen,
    setCouponModalOpen,
    points,
    setPoints,
    paymentMethod,
    setPaymentMethod,
    agrees,
    setAgrees,
  };
};
