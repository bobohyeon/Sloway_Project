import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button } from '../../../pay_shared/components';
import { ResultHeader } from '../../components/user/ResultHeader';
import { ErrorReasonCard } from '../../components/user/ErrorReasonCard';
import { SolutionGuide } from '../../components/user/SolutionGuide';
import { CustomerCenterBox } from '../../components/user/CustomerCenterBox';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-6);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-6);

  & > button:first-child {
    flex: 0 0 auto;

    min-width: 120px;
  }

  & > button:last-child {
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;

    & > button:first-child {
      width: 100%;
    }
  }
`;

const formatAttemptedAt = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mi = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};

export default function PaymentFail() {
  const nav = useNavigate();
  const error = useSelector((state) => state.pay.error);

  useEffect(() => {
    if (!error) nav('/user/payment/checkout');
  }, [error, nav]);

  const attemptedAt = useMemo(() => formatAttemptedAt(new Date()), []);

  if (!error) return null;

  const errorInfo = {
    reason: '결제 처리 실패',
    code: '-',
    message: error,
    attemptedAt,
  };

  return (
    <PageLayout maxWidth={800}>
      <ResultHeader
        variant="fail"
        title="결제를 완료하지 못했어요"
        description="걱정하지 마세요. 결제 금액은 출금되지 않았으니 아래 안내에 따라 다시 시도해보세요."
      />

      <Content>
        <ErrorReasonCard error={errorInfo} />
        <SolutionGuide notice="결제 금액은 출금되지 않았습니다. 혹시 결제 내역에 보인다면 영업일 기준 3~5일 내 자동 환불 처리됩니다." />
      </Content>

      <Actions>
        <Button variant="secondary" size="lg" onClick={() => nav('/')}>
          메인으로
        </Button>
        <Button
          variant="primary"
          size="lg"
          full
          onClick={() => nav('/user/payment/checkout')}
        >
          다시 결제하기
        </Button>
      </Actions>

      <CustomerCenterBox />
    </PageLayout>
  );
}
