import styled from 'styled-components';
import { FaInfoCircle, FaPlus } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, Badge } from '../../../pay_shared/components';

const SUPPORTED_METHODS = [
  {
    code: 'KAKAOPAY',
    label: '카카오페이',
    emoji: '🟡',
    color: '#FEE500',
    note: '카카오 인증 후 결제 즉시 승인',
  },
  {
    code: 'TOSSPAY',
    label: '토스페이',
    emoji: '🔵',
    color: '#0064FF',
    note: '토스 인증 후 결제 즉시 승인',
  },
];

export default function PaymentMethods() {
  return (
    <PageLayout
      title="결제 수단 관리"
      description="결제 가능한 수단과 등록 현황을 확인하세요"
      maxWidth={900}
    >
      <NoticeCard padded>
        <NoticeIcon>
          <FaInfoCircle />
        </NoticeIcon>
        <NoticeText>
          결제 수단은 결제 진행 시점에 선택합니다. 별도 등록 절차 없이 카카오·토스 인증으로
          간편하게 결제할 수 있습니다.
        </NoticeText>
      </NoticeCard>

      <Section title="지원 결제 수단">
        <MethodGrid>
          {SUPPORTED_METHODS.map((method) => (
            <MethodCard key={method.code} padded $color={method.color}>
              <MethodHeader>
                <MethodEmoji>{method.emoji}</MethodEmoji>
                <MethodLabel>{method.label}</MethodLabel>
              </MethodHeader>
              <MethodNote>{method.note}</MethodNote>
              <MethodFooter>
                <Badge variant="sage">사용 가능</Badge>
              </MethodFooter>
            </MethodCard>
          ))}
        </MethodGrid>
      </Section>

      <Section title="결제 수단 등록">
        <RegisterCard padded>
          <RegisterIcon>
            <FaPlus />
          </RegisterIcon>
          <RegisterText>
            <RegisterTitle>현재 별도 등록은 지원하지 않습니다</RegisterTitle>
            <RegisterDesc>
              결제 시점에 수단을 선택하는 단건 결제 방식입니다. 정기 결제·간편 등록은
              추후 제공될 예정입니다.
            </RegisterDesc>
          </RegisterText>
        </RegisterCard>
      </Section>
    </PageLayout>
  );
}

const NoticeCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  background: var(--cream);
  border-color: var(--sage);
`;

const NoticeIcon = styled.div`
  font-size: 1.1rem;
  color: var(--sage);
  flex-shrink: 0;
  margin-top: 2px;
`;

const NoticeText = styled.p`
  font-size: 0.85rem;
  color: var(--gray-800);
  line-height: 1.6;
  margin: 0;
`;

const MethodGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const MethodCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  border-left: 4px solid ${(p) => p.$color};
`;

const MethodHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const MethodEmoji = styled.span`
  font-size: 1.4rem;
`;

const MethodLabel = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  flex: 1;
`;

const MethodCode = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--gray-400);
  background: var(--gray-100);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
`;

const MethodNote = styled.p`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
  margin: 0;
  flex: 1;
`;

const MethodFooter = styled.div`
  display: flex;
`;

const RegisterCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
`;

const RegisterIcon = styled.div`
  font-size: 1.4rem;
  color: var(--gray-400);
  flex-shrink: 0;
  margin-top: 2px;
`;

const RegisterText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RegisterTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
`;

const RegisterDesc = styled.span`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`;
