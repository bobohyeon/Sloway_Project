import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createPay } from '../api/payApi';
import { setStatus, setResult, setError } from '../store/paySlice';
import { toPayMethod } from '../constants/payMethod';

export const usePayAction = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePay = async ({
    rsvnNo,
    ucNo,
    usedPoint,
    paymentMethod,
    baseAmt,
    addAmt,
  }) => {
    setLoading(true);
    dispatch(setStatus('loading'));
    dispatch(setError(null));

    try {
      const method = toPayMethod(paymentMethod);
      if (!method) throw new Error('지원하지 않는 결제 수단입니다.');

      const payResDto = await createPay({
        rsvnNo,
        ucNo,
        usedPoint,
        method,
        baseAmt,
        addAmt,
      });

      dispatch(setResult(payResDto));
      dispatch(setStatus('succeeded'));
      nav('/user/payment/complete');
      return payResDto;
    } catch (err) {
      const msg = err?.response?.data?.msg ?? err.message;
      dispatch(setError(msg));
      dispatch(setStatus('failed'));
      nav('/user/payment/fail');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, handlePay };
};
