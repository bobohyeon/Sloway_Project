import styled from 'styled-components';
import { FaInfoCircle, FaCoins, FaCalendarCheck, FaUndo, FaChartLine } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const KPIS = [
  { key: 'monthRevenue', label: '이번 달 매출', unit: '원', icon: <FaCoins /> },
  { key: 'bookings', label: '예약 건수', unit: '건', icon: <FaCalendarCheck /> },
  { key: 'refund', label: '환불 차감', unit: '원', icon: <FaUndo /> },
  { key: 'avg', label: '평균 결제금', unit: '원', icon: <FaChartLine /> },
];

export default function SalesStats() {
  return (
    <PageLayout title="매출 통계" description="내 공간 매출 추이와 분석" maxWidth={1200}>
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          매출 통계 기능을 준비 중입니다. 호스트별 매출 집계는 추후 제공될 예정입니다.
        </NoticeText>
      </NoticeCard>

      <KPIGrid>
        {KPIS.map((k) => (
          <StatCard key={k.key} label={k.label} value="—" unit={k.unit} icon={k.icon} />
        ))}
      </KPIGrid>

      <Section title="매출 추이" action={<Badge>준비 중</Badge>}>
        <EmptyCard padded>
          <EmptyState
            icon="📈"
            title="매출 통계 준비 중"
            description="호스트별 매출 통계 기능을 준비 중입니다."
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
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-3);
  margin-bottom: var(--space-5);
  @media (max-width: 960px) { grid-template-columns: repeat(2, 1fr); }
`;
const EmptyCard = styled(Card)`padding: var(--space-6) var(--space-5);`;
