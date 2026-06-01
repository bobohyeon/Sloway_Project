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

export default function SettlementDetail() {
  const { no } = useParams();
  const [settle, setSettle] = useState(null);

  useEffect(() => {
    findSettleByNo(no)
      .then(setSettle)
      .catch((err) => console.error('정산 상세 조회 실패', err));
  }, [no]);

  if (!settle) {
    return (
      <PageLayout
        title={`정산 #${no}`}
        backTo="/host/settlement/history"
        backLabel="정산 이력"
        maxWidth={900}
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
      description="회차 정산 내역 상세"
      backTo="/host/settlement/history"
      backLabel="정산 이력"
      maxWidth={900}
    >
      <StatusBar>
        <StatusLabel>현재 상태</StatusLabel>
        <StatusBadge $color={meta.color}>{meta.label}</StatusBadge>
      </StatusBar>

      <Section title="정산 내역">
        <SummaryCard padded>
          <Row>
            <Label>회차 기간</Label>
            <Value>
              {settle.settleStartDate} ~ {settle.settleEndDate}
            </Value>
          </Row>
          <Row>
            <Label>총 매출</Label>
            <Value>{won(settle.totalAmt)}</Value>
          </Row>
          <Row>
            <Label>수수료 (정책 적용)</Label>
            <Value>- {won(settle.feeAmt)}</Value>
          </Row>
          <Row>
            <Label>환불 차감</Label>
            <Value>- {won(settle.refundAmt)}</Value>
          </Row>
          <Row>
            <Label>이월 대기액</Label>
            <Value>{won(settle.carryOver)}</Value>
          </Row>
          <Row $highlight>
            <Label>최종 정산액</Label>
            <Value>{won(settle.payoutAmt)}</Value>
          </Row>
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

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-100);
  background: ${(p) => (p.$highlight ? 'var(--cream)' : 'transparent')};

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`;

const Value = styled.span`
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
