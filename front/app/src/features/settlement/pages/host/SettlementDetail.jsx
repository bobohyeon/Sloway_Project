import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, Badge } from '../../../pay_shared/components';

const SUMMARY_FIELDS = [
  { key: 'period', label: '회차 기간' },
  { key: 'rsvnCount', label: '예약 건수' },
  { key: 'totalSales', label: '총 매출' },
  { key: 'commissionRate', label: '수수료율' },
  { key: 'commission', label: '수수료' },
  { key: 'refundOffset', label: '환불 차감' },
  { key: 'finalAmount', label: '최종 정산액' },
];

const TIMELINE = [
  { key: 'created', label: '정산 생성' },
  { key: 'completed', label: '정산 완료' },
  { key: 'invoiced', label: '세금계산서 발행' },
];

export default function SettlementDetail() {
  const { no } = useParams();
  return (
    <PageLayout
      title={`정산 #${no ?? '—'}`}
      description="회차 정산 내역 상세"
      backTo="/host/settlement/history"
      backLabel="정산 이력"
      maxWidth={900}
    >
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          Settle 도메인 본인(4번) 보류 영역. 자동집계 진입 후 실제 회차 데이터가 노출됩니다.
        </NoticeText>
      </NoticeCard>

      <StatusBar>
        <StatusLabel>현재 상태</StatusLabel>
        <Badge>Settle 통합 대기</Badge>
      </StatusBar>

      <Section title="정산 내역">
        <SummaryCard padded>
          {SUMMARY_FIELDS.map((field) => (
            <SummaryRow key={field.key} $highlight={field.key === 'finalAmount'}>
              <SummaryLabel>{field.label}</SummaryLabel>
              <SummaryValue>—</SummaryValue>
            </SummaryRow>
          ))}
        </SummaryCard>
      </Section>

      <Section title="진행 이력">
        <TimelineCard padded>
          {TIMELINE.map((step) => (
            <TimelineRow key={step.key}>
              <TimelineDot />
              <TimelineLabel>{step.label}</TimelineLabel>
              <TimelineStatus>—</TimelineStatus>
            </TimelineRow>
          ))}
        </TimelineCard>
      </Section>
    </PageLayout>
  );
}

const NoticeCard = styled(Card)`
  display: flex; align-items: flex-start; gap: var(--space-3);
  margin-bottom: var(--space-4);
  background: var(--cream); border-color: var(--sage);
`;
const NoticeIcon = styled.div`font-size: 1.1rem; color: var(--sage); flex-shrink: 0; margin-top: 2px;`;
const NoticeText = styled.p`font-size: 0.85rem; color: var(--gray-800); line-height: 1.6; margin: 0;`;
const StatusBar = styled.div`
  display: flex; align-items: center; gap: var(--space-3);
  margin-bottom: var(--space-5); padding: var(--space-3) var(--space-4);
  background: var(--white); border: 1px solid var(--gray-200); border-radius: var(--radius-md);
`;
const StatusLabel = styled.span`font-size: 0.85rem; color: var(--gray-600);`;
const SummaryCard = styled(Card)`display: flex; flex-direction: column; gap: 0; padding: 0;`;
const SummaryRow = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-100);
  background: ${(p) => (p.$highlight ? 'var(--cream)' : 'transparent')};
  &:last-child { border-bottom: none; }
`;
const SummaryLabel = styled.span`font-size: 0.85rem; color: var(--gray-600);`;
const SummaryValue = styled.span`font-family: var(--font-mono); font-size: 0.95rem; font-weight: 600; color: var(--gray-800);`;
const TimelineCard = styled(Card)`display: flex; flex-direction: column; gap: var(--space-3);`;
const TimelineRow = styled.div`display: flex; align-items: center; gap: var(--space-3);`;
const TimelineDot = styled.span`width: 10px; height: 10px; border-radius: 50%; background: var(--gray-200); flex-shrink: 0;`;
const TimelineLabel = styled.span`flex: 1; font-size: 0.88rem; color: var(--gray-800);`;
const TimelineStatus = styled.span`font-family: var(--font-mono); font-size: 0.82rem; color: var(--gray-400);`;
