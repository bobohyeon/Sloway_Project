import styled from 'styled-components';
import { FaInfoCircle, FaCalendarCheck, FaUndo, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const KPIS = [
  { key: 'total', label: '예약 건수', unit: '건', icon: <FaCalendarCheck /> },
  { key: 'confirmed', label: '확정', unit: '건', icon: <FaCheckCircle /> },
  { key: 'canceled', label: '취소', unit: '건', icon: <FaTimesCircle /> },
  { key: 'refunded', label: '환불 연결', unit: '건', icon: <FaUndo /> },
];

export default function BookingStats() {
  return (
    <PageLayout title="예약 통계" description="예약 발생 추이와 상태 분포" maxWidth={1200}>
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          예약 통계는 3번 도메인(예약·리뷰) Repository 합류 후 적재 파이프라인이 연결됩니다.
          Pay 도메인 Stats와 별개로, 예약 상태(확정/취소) 기반 집계가 필요합니다.
        </NoticeText>
      </NoticeCard>

      <KPIGrid>
        {KPIS.map((k) => (
          <StatCard key={k.key} label={k.label} value="—" unit={k.unit} icon={k.icon} />
        ))}
      </KPIGrid>

      <Section title="예약 추이" action={<Badge>예약 도메인 통합 대기</Badge>}>
        <EmptyCard padded>
          <EmptyState
            icon="📅"
            title="예약 통계 통합 대기"
            description="3번 도메인 예약·리뷰 Repository 및 통계 적재 파이프라인 합류 후 노출됩니다."
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
