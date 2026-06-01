import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, EmptyState } from '../../../pay_shared/components';
import { findSettleByHostNo } from '../../api/settlementApi';

const HOST_NO = 1;

const STATUS_META = {
  WAITING: { label: '정산 대기', color: 'var(--gray-400)' },
  COMPLETE: { label: '정산 완료', color: 'var(--sage)' },
  INVOICE: { label: '세금계산서 발행', color: '#0064FF' },
  CARRIED: { label: '이월', color: '#E8804D' },
};

const FILTER_TABS = [
  { value: 'all', label: '전체' },
  { value: 'WAITING', label: '대기' },
  { value: 'COMPLETE', label: '완료' },
  { value: 'INVOICE', label: '세금계산서 발행' },
  { value: 'CARRIED', label: '이월' },
];

const won = (n) => `${Number(n ?? 0).toLocaleString()}원`;
const fmtDate = (d) => (d ? String(d) : '—');

export default function SettlementHistory() {
  const nav = useNavigate();
  const [settles, setSettles] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    findSettleByHostNo(HOST_NO)
      .then(setSettles)
      .catch((err) => console.error('호스트 정산 이력 조회 실패', err));
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return settles;
    return settles.filter((s) => s.status === filter);
  }, [settles, filter]);

  return (
    <PageLayout
      title="정산 이력"
      description="회차별 정산 내역을 조회합니다"
      backTo="/host/settlement/dashboard"
      backLabel="정산 대시보드"
      maxWidth={1100}
    >
      <FilterBar>
        {FILTER_TABS.map((tab) => (
          <FilterBtn
            key={tab.value}
            $active={filter === tab.value}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
          </FilterBtn>
        ))}
      </FilterBar>

      <ListCard padded>
        <TableHeader>
          <Col>정산 번호</Col>
          <Col>회차 기간</Col>
          <Col>총매출</Col>
          <Col>환불 차감</Col>
          <Col>최종 정산액</Col>
          <Col>상태</Col>
        </TableHeader>

        {filtered.length === 0 ? (
          <EmptyWrap>
            <EmptyState
              title="정산 이력이 없습니다"
              description="이용 완료 건이 4일 단위로 자동집계되면 회차별로 표시됩니다."
            />
          </EmptyWrap>
        ) : (
          filtered.map((s) => (
            <RowItem
              key={s.no}
              onClick={() => nav(`/host/settlement/history/${s.no}`)}
            >
              <Col>#{s.no}</Col>
              <Col>
                {fmtDate(s.settleStartDate)} ~ {fmtDate(s.settleEndDate)}
              </Col>
              <Col>{won(s.totalAmt)}</Col>
              <Col>- {won(s.refundAmt)}</Col>
              <Col>
                <Strong>{won(s.payoutAmt)}</Strong>
              </Col>
              <Col>
                <StatusBadge $color={STATUS_META[s.status]?.color}>
                  {STATUS_META[s.status]?.label ?? s.status}
                </StatusBadge>
              </Col>
            </RowItem>
          ))
        )}
      </ListCard>
    </PageLayout>
  );
}

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: 6px 14px;
  background: ${(p) => (p.$active ? 'var(--sage)' : 'var(--white)')};
  border: 1px solid ${(p) => (p.$active ? 'var(--sage)' : 'var(--gray-200)')};
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  color: ${(p) => (p.$active ? 'var(--white)' : 'var(--gray-600)')};
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
`;

const ListCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 90px 1.5fr 1fr 1fr 1fr 110px;
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100);
  border-bottom: 1px solid var(--gray-200);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-600);

  @media (max-width: 720px) {
    display: none;
  }
`;

const RowItem = styled.div`
  display: grid;
  grid-template-columns: 90px 1.5fr 1fr 1fr 1fr 110px;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-100);
  font-size: 0.85rem;
  color: var(--gray-800);
  cursor: pointer;

  &:hover {
    background: var(--cream);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-1);
  }
`;

const Col = styled.div``;

const Strong = styled.strong`
  font-weight: 700;
  color: var(--gray-900);
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

const EmptyWrap = styled.div`
  padding: var(--space-8) var(--space-5);
`;
