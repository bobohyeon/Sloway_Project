import styled from 'styled-components';
import { FaReceipt, FaInfoCircle, FaMobileAlt, FaBuilding } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const POLICY_ITEMS = [
  {
    icon: <FaInfoCircle />,
    title: '자동 발급 기준',
    description: '실제 결제 금액(쿠폰·포인트 차감 후)이 1원 이상인 결제 건에 대해 자동 발급됩니다.',
  },
  {
    icon: <FaMobileAlt />,
    title: '개인 소득공제',
    description: '휴대폰 번호로 발급되며, 국세청 홈택스에서 연말정산 자료로 활용할 수 있습니다.',
  },
  {
    icon: <FaBuilding />,
    title: '사업자 지출증빙',
    description: '사업자등록번호 기준으로 발급되며, 부가가치세 매입세액 공제 자료로 활용됩니다.',
  },
];

export default function CashReceipt() {
  return (
    <PageLayout
      title="현금영수증"
      description="현금영수증 발급 정책과 발급 내역을 확인하세요"
      maxWidth={900}
    >
      <Section title="현금영수증 정책">
        <PolicyCard padded>
          {POLICY_ITEMS.map((item, i) => (
            <PolicyRow key={i}>
              <PolicyIcon>{item.icon}</PolicyIcon>
              <PolicyText>
                <PolicyTitle>{item.title}</PolicyTitle>
                <PolicyDesc>{item.description}</PolicyDesc>
              </PolicyText>
            </PolicyRow>
          ))}
        </PolicyCard>
      </Section>

      <Section
        title="발급 내역"
        action={<Badge>준비 중</Badge>}
      >
        <EmptyCard padded>
          <EmptyState
            icon="🧾"
            title="발급 내역이 없습니다"
            description="아직 발급된 현금영수증이 없습니다."
          />
        </EmptyCard>
      </Section>

      <Section title="발급 신청">
        <EmptyCard padded>
          <EmptyState
            icon="📱"
            title="발급 신청 준비 중"
            description="결제 시점에 휴대폰 번호 또는 사업자등록번호를 입력해 발급 신청하는 기능을 준비 중입니다."
          />
        </EmptyCard>
      </Section>
    </PageLayout>
  );
}

const PolicyCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const PolicyRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
`;

const PolicyIcon = styled.div`
  font-size: 1.2rem;
  color: var(--sage);
  flex-shrink: 0;
  margin-top: 2px;
`;

const PolicyText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const PolicyTitle = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
`;

const PolicyDesc = styled.span`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`;

const EmptyCard = styled(Card)`
  padding: var(--space-6) var(--space-5);
`;
