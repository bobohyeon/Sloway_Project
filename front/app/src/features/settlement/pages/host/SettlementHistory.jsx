import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const FILTER_TABS = [
  { value: 'all', label: '전체' },
  { value: 'WAITING', label: '대기' },
  { value: 'COMPLETE', label: '완료' },
  { value: 'INVOICE', label: '세금계산서 발행' },
];

export default function SettlementHistory() {
  return (
    <PageLayout
      title="정산 이력"
      description="회차별 정산 내역을 조회합니다"
      backTo="/host/settlement/dashboard"
      backLabel="정산 대시보드"
      maxWidth={1100}
    >
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          정산 자동집계 기능을 준비 중입니다. 준비 완료 후 회차별 이력이 노출됩니다.
        </NoticeText>
      </NoticeCard>

      <FilterBar>
        {FILTER_TABS.map((tab) => (
          <FilterBtn key={tab.value} disabled>{tab.label}</FilterBtn>
        ))}
        <Spacer />
        <Badge>준비 중</Badge>
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
        <EmptyWrap>
          <EmptyState
            title="정산 이력이 없습니다"
            description="이용 완료 건 4일 자동집계 진입 후 노출됩니다."
          />
        </EmptyWrap>
      </ListCard>
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
const FilterBar = styled.div`
  display: flex; align-items: center; gap: var(--space-2);
  margin-bottom: var(--space-4); flex-wrap: wrap;
`;
const FilterBtn = styled.button`
  padding: 6px 14px; background: var(--white); border: 1px solid var(--gray-200);
  border-radius: var(--radius-full); font-size: 0.82rem; color: var(--gray-400);
  cursor: not-allowed; font-family: 'Noto Sans KR', sans-serif;
`;
const Spacer = styled.div`flex: 1;`;
const ListCard = styled(Card)`padding: 0; overflow: hidden;`;
const TableHeader = styled.div`
  display: grid; grid-template-columns: 100px 1.5fr 1fr 1fr 1fr 100px;
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100); border-bottom: 1px solid var(--gray-200);
  font-size: 0.78rem; font-weight: 600; color: var(--gray-600);
  @media (max-width: 720px) { display: none; }
`;
const Col = styled.div``;
const EmptyWrap = styled.div`padding: var(--space-8) var(--space-5);`;
