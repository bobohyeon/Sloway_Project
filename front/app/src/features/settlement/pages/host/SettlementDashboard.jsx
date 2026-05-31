import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCoins, FaCalendarCheck, FaUndo, FaFileInvoice, FaInfoCircle } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const KPIS = [
  { key: 'thisRound', label: '이번 회차 정산액', unit: '원', icon: <FaCoins /> },
  { key: 'lastRound', label: '직전 회차', unit: '원', icon: <FaCalendarCheck /> },
  { key: 'refundOffset', label: '환불 차감', unit: '원', icon: <FaUndo /> },
  { key: 'invoiceStatus', label: '세금계산서', unit: '', icon: <FaFileInvoice /> },
];

export default function SettlementDashboard() {
  const nav = useNavigate();
  return (
    <PageLayout
      title="정산 대시보드"
      description="이번 회차 정산 현황과 이력을 확인합니다"
      maxWidth={1200}
    >
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          정산은 이용 완료 건만 4일 단위로 자동집계되며, 환불은 다음 회차에서 차감됩니다.
          자동집계 기능을 준비 중입니다.
        </NoticeText>
      </NoticeCard>

      <KPIGrid>
        {KPIS.map((k) => (
          <StatCard key={k.key} label={k.label} value="—" unit={k.unit} icon={k.icon} />
        ))}
      </KPIGrid>

      <Section title="이번 회차 요약" action={<Badge>준비 중</Badge>}>
        <EmptyCard padded>
          <EmptyState
            icon="💰"
            title="집계 데이터가 없습니다"
            description="정산 자동집계 기능 준비 후 노출됩니다."
            action={
              <ActionBtn onClick={() => nav('/host/settlement/history')}>
                정산 이력 보기
              </ActionBtn>
            }
          />
        </EmptyCard>
      </Section>
    </PageLayout>
  );
}

const NoticeCard = styled(Card)`
  display: flex; align-items: flex-start; gap: var(--space-3);
  margin-bottom: var(--space-5);
  background: var(--cream); border-color: var(--sage);
`;
const NoticeIcon = styled.div`font-size: 1.1rem; color: var(--sage); flex-shrink: 0; margin-top: 2px;`;
const NoticeText = styled.p`font-size: 0.85rem; color: var(--gray-800); line-height: 1.6; margin: 0;`;
const KPIGrid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3); margin-bottom: var(--space-5);
  @media (max-width: 960px) { grid-template-columns: repeat(2, 1fr); }
`;
const EmptyCard = styled(Card)`padding: var(--space-6) var(--space-5);`;
const ActionBtn = styled.button`
  padding: 8px 16px; background: var(--white); border: 1px solid var(--sage); color: var(--sage);
  border-radius: var(--radius-md); font-size: 0.85rem; font-weight: 600; cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  &:hover { background: var(--cream); }
`;
