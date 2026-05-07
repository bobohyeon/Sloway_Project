import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '../../../pay_shared/components';
import { ResultHeader } from '../../components/user/ResultHeader';
import { ErrorReasonCard } from '../../components/user/ErrorReasonCard';
import { SolutionGuide } from '../../components/user/SolutionGuide';
import { CustomerCenterBox } from '../../components/user/CustomerCenterBox';

const Page = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: var(--space-12) var(--space-6);
  animation: fadeInUp 480ms ease-out both;
`;

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

const ERROR = {
  reason: '인증 실패',
  code: 'E-002',
  message: '카드사 인증에 실패했습니다',
  attemptedAt: '2026.04.24 14:32',
};

export default function PaymentFail() {
  const nav = useNavigate();

  return (
    <Page>
      <ResultHeader
        variant="fail"
        title="결제를 완료하지 못했어요"
        description="걱정하지 마세요. 결제 금액은 출금되지 않았으니 아래 안내에 따라 다시 시도해보세요."
      />

      <Content>
        <ErrorReasonCard error={ERROR} />
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
    </Page>
  );
}
