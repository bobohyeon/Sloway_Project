import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaCoins, FaCalendarCheck, FaUndo, FaHourglassHalf } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState } from '../../../pay_shared/components';
import { findSettleByHostNo } from '../../api/settlementApi';

const STATUS_META = {
  WAITING: { label: '정산 대기', color: 'var(--gray-400)' },
  COMPLETE: { label: '정산 완료', color: 'var(--sage)' },
  INVOICE: { label: '세금계산서 발행', color: '#0064FF' },
  CARRIED: { label: '이월', color: '#E8804D' },
};

const won = (n) => `${Number(n ?? 0).toLocaleString()}원`;
const fmtDate = (d) => (d ? String(d) : '—');

export default function SettlementDashboard() {
  const nav = useNavigate();
  const [settles, setSettles] = useState([]);

  useEffect(() => {
    findSettleByHostNo()
      .then(setSettles)
      .catch((err) => console.error('호스트 정산 조회 실패', err));
  }, []);

  // 백엔드 최근순(no desc) 정렬 가정
  const latest = settles[0];
  const prev = settles[1];

  return (
    <PageLayout
      title="정산 대시보드"
      description="이번 회차 정산 현황과 이력을 확인합니다"
      maxWidth={1200}
    >
      <KPIGrid>
        <StatCard
          label="이번 회차 정산액"
          value={won(latest?.payoutAmt)}
          icon={<FaCoins />}
        />
        <StatCard
          label="직전 회차"
          value={won(prev?.payoutAmt)}
          icon={<FaCalendarCheck />}
        />
        <StatCard
          label="환불 차감"
          value={won(latest?.refundAmt)}
          icon={<FaUndo />}
        />
        <StatCard
          label="이월 대기액"
          value={won(latest?.carryOver)}
          icon={<FaHourglassHalf />}
        />
      </KPIGrid>

      <Section
        title="최근 회차 요약"
        action={
          <HistoryLink onClick={() => nav('/host/settlement/history')}>
            정산 이력 보기 →
          </HistoryLink>
        }
      >
        {latest ? (
          <SummaryCard padded>
            <Row>
              <Label>회차 기간</Label>
              <Value>
                {fmtDate(latest.settleStartDate)} ~ {fmtDate(latest.settleEndDate)}
              </Value>
            </Row>
            <Row>
              <Label>총 매출</Label>
              <Value>{won(latest.totalAmt)}</Value>
            </Row>
            <Row>
              <Label>수수료</Label>
              <Value>- {won(latest.feeAmt)}</Value>
            </Row>
            <Row>
              <Label>환불 차감</Label>
              <Value>- {won(latest.refundAmt)}</Value>
            </Row>
            <Row $highlight>
              <Label>최종 정산액</Label>
              <Value>{won(latest.payoutAmt)}</Value>
            </Row>
            <Row>
              <Label>상태</Label>
              <Value>
                <StatusBadge $color={STATUS_META[latest.status]?.color}>
                  {STATUS_META[latest.status]?.label ?? latest.status}
                </StatusBadge>
              </Value>
            </Row>
          </SummaryCard>
        ) : (
          <EmptyCard padded>
            <EmptyState
              icon="💰"
              title="정산 내역이 없습니다"
              description="이용 완료 건이 4일 단위로 자동집계되면 여기에 표시됩니다."
            />
          </EmptyCard>
        )}
      </Section>
    </PageLayout>
  );
}

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const HistoryLink = styled.button`
  background: none;
  border: none;
  color: var(--sage);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
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

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: ${(p) => p.$color ?? 'var(--gray-400)'};
  color: var(--white);
  border-radius: var(--radius-full);
  font-size: 0.74rem;
  font-weight: 600;
`;

const EmptyCard = styled(Card)`
  padding: var(--space-6) var(--space-5);
`;
