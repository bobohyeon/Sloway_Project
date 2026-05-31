import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { confirmTossPay } from '../../api/payApi';

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: 80px 0;
  color: var(--gray-600);
  font-size: 1rem;
`;

export default function TossSuccess() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const paymentKey = params.get('paymentKey');
    const orderId = params.get('orderId');
    const amount = params.get('amount');

    if (!paymentKey || !orderId || !amount) {
      nav('/user/payment/fail', { replace: true });
      return;
    }

    confirmTossPay({ paymentKey, orderId, amount: Number(amount) })
      .then((payResDto) => {
        nav(`/user/payment/complete?payNo=${payResDto.no}`, { replace: true });
      })
      .catch(() => nav('/user/payment/fail', { replace: true }));
  }, [params, nav]);

  return (
    <PageLayout maxWidth={800}>
      <Center>결제를 확정하고 있어요…</Center>
    </PageLayout>
  );
}
