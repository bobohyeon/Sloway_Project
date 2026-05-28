import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaInfoCircle, FaCheckCircle, FaFileInvoice } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, Badge } from '../../../pay_shared/components';

const STATUS_META = {
  WAITING: { label: '정산 대기', color: 'var(--gray-400)' },
  COMPLETE: { label: '정산 완료', color: 'var(--sage)' },
  INVOICE: { label: '세금계산서 발행', color: '#0064FF' },
};

const SUMMARY_FIELDS = [
  { key: 'hostName', label: '호스트' },
  { key: 'period', label: '회차 기간' },
  { key: 'totalSales', label: '총 매출' },
  { key: 'commission', label: '수수료 (정책 적용)' },
  { key: 'refundOffset', label: '환불 차감' },
  { key: 'finalAmount', label: '최종 정산액' },
];

const TIMELINE = [
  { key: 'created', label: '정산 생성', status: '—' },
  { key: 'completed', label: '정산 완료', status: '—' },
  { key: 'invoiced', label: '세금계산서 발행', status: '—' },
];

export default function AdminSettlementDetail() {
  const { no } = useParams();
  const currentStatus = STATUS_META.WAITING;

  return (
    <PageLayout
      title={`정산 #${no ?? '—'}`}
      description="정산 회차 상세 정보와 상태를 확인합니다"
      backTo="/admin/settlement"
      backLabel="정산 관리"
      maxWidth={1000}
    >
      <NoticeCard padded>
        <NoticeIcon>
          <FaInfoCircle />
        </NoticeIcon>
        <NoticeText>
          Settle 도메인 본인 보류 영역입니다. 자동집계 본체(SettleService.createSettle) 구현 +
          4일 배치 진입 후 실제 데이터가 노출됩니다.
        </NoticeText>
      </NoticeCard>

      <StatusBar>
        <StatusLabel>현재 상태</StatusLabel>
        <StatusBadge $color={currentStatus.color}>{currentStatus.label}</StatusBadge>
      </StatusBar>

      <Section title="정산 요약">
        <SummaryCard padded>
          {SUMMARY_FIELDS.map((field) => (
            <SummaryRow key={field.key}>
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
              <TimelineStatus>{step.status}</TimelineStatus>
            </TimelineRow>
          ))}
        </TimelineCard>
      </Section>

      <ActionRow>
        <ActionBtn disabled>
          <FaCheckCircle /> 정산 완료 처리
        </ActionBtn>
        <ActionBtn disabled>
          <FaFileInvoice /> 세금계산서 발행
        </ActionBtn>
        <Badge>Settle 통합 대기</Badge>
      </ActionRow>
    </PageLayout>
  );
}

const NoticeCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
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

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  padding: var(--space-3) var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
`;

const StatusLabel = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: ${(p) => p.$color};
  color: var(--white);
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 600;
`;

const SummaryCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-100);

  &:last-child {
    border-bottom: none;
    background: var(--cream);
  }
`;

const SummaryLabel = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`;

const SummaryValue = styled.span`
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
`;

const TimelineCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const TimelineRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const TimelineDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--gray-200);
  flex-shrink: 0;
`;

const TimelineLabel = styled.span`
  flex: 1;
  font-size: 0.88rem;
  color: var(--gray-800);
`;

const TimelineStatus = styled.span`
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-400);
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-5);
  flex-wrap: wrap;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--gray-400);
  cursor: not-allowed;
  font-family: 'Noto Sans KR', sans-serif;
`;
