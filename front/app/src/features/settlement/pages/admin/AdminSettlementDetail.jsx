import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section } from '../../../pay_shared/components';
import { findSettleByNo } from '../../api/settlementApi';

const STATUS_META = {
  WAITING: { label: '정산 대기', color: 'var(--gray-400)' },
  COMPLETE: { label: '정산 완료', color: 'var(--sage)' },
  INVOICE: { label: '세금계산서 발행', color: '#0064FF' },
  CARRIED: { label: '이월', color: '#E8804D' },
};

const won = (n) => `${Number(n ?? 0).toLocaleString()}원`;

const fmtDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function AdminSettlementDetail() {
  const { no } = useParams();
  const [settle, setSettle] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await findSettleByNo(no);
        setSettle(data);
      } catch (err) {
        console.error('정산 상세 조회 실패', err);
      }
    };
    load();
  }, [no]);

  if (!settle) {
    return (
      <PageLayout
        title={`정산 #${no}`}
        backTo="/admin/settlement/host"
        backLabel="정산 관리"
        maxWidth={1000}
      >
        <Center>불러오는 중…</Center>
      </PageLayout>
    );
  }

  const meta = STATUS_META[settle.status] ?? {
    label: settle.status,
    color: 'var(--gray-400)',
  };

  return (
    <PageLayout
      title={`정산 #${settle.no}`}
      description="정산 회차 상세 정보와 상태를 확인합니다"
      backTo="/admin/settlement/host"
      backLabel="정산 관리"
      maxWidth={1000}
    >
      <StatusBar>
        <StatusLabel>현재 상태</StatusLabel>
        <StatusBadge $color={meta.color}>{meta.label}</StatusBadge>
      </StatusBar>

      <Section title="정산 요약">
        <SummaryCard padded>
          <SummaryRow>
            <SummaryLabel>호스트</SummaryLabel>
            <SummaryValue>호스트 #{settle.hostNo}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>회차 기간</SummaryLabel>
            <SummaryValue>
              {settle.settleStartDate} ~ {settle.settleEndDate}
            </SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>총 매출</SummaryLabel>
            <SummaryValue>{won(settle.totalAmt)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>수수료 (정책 적용)</SummaryLabel>
            <SummaryValue>- {won(settle.feeAmt)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>환불 차감</SummaryLabel>
            <SummaryValue>- {won(settle.refundAmt)}</SummaryValue>
          </SummaryRow>
          <SummaryRow>
            <SummaryLabel>최종 정산액</SummaryLabel>
            <SummaryValue>{won(settle.payoutAmt)}</SummaryValue>
          </SummaryRow>
        </SummaryCard>
      </Section>

      <Section title="진행 이력">
        <TimelineCard padded>
          <TimelineRow>
            <TimelineDot />
            <TimelineLabel>정산 생성</TimelineLabel>
            <TimelineStatus>{fmtDateTime(settle.createdAt)}</TimelineStatus>
          </TimelineRow>
          <TimelineRow>
            <TimelineDot />
            <TimelineLabel>정산 완료</TimelineLabel>
            <TimelineStatus>{fmtDateTime(settle.settledAt)}</TimelineStatus>
          </TimelineRow>
          <TimelineRow>
            <TimelineDot />
            <TimelineLabel>세금계산서 발행</TimelineLabel>
            <TimelineStatus>{fmtDateTime(settle.invoicedAt)}</TimelineStatus>
          </TimelineRow>
        </TimelineCard>
      </Section>

    </PageLayout>
  );
}

const Center = styled.div`
  padding: 80px 0;
  text-align: center;
  color: var(--gray-600);
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

