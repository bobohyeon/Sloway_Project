import { useState } from 'react';
import { createPay } from '../api/payApi';

export const usePay = () => {
  const [status, setStatus] = useState('init');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const requestPay = async (reqDto) => {
    setStatus('loading');
    setError(null);

    try {
      const payResDto = await createPay(reqDto);
      setResult(payResDto);
      setStatus('succeeded');
      return payResDto;
    } catch (err) {
      setError(err);
      setStatus('failed');
      throw err;
    }
  };

  return { status, result, error, requestPay };
};
