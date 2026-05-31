import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaInfoCircle, FaMoneyBillWave, FaCheckCircle, FaFileInvoice, FaHourglassHalf } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const STATUS_KPI = [
  { key: 'waiting', label: '정산 대기', unit: '건', icon: <FaHourglassHalf /> },
  { key: 'complete', label: '정산 완료', unit: '건', icon: <FaCheckCircle /> },
  { key: 'invoice', label: '세금계산서 발행', unit: '건', icon: <FaFileInvoice /> },
  { key: 'monthAmt', label: '이번 회차 총액', unit: '원', icon: <FaMoneyBillWave /> },
];

const FILTER_TABS = [
  { value: 'all', label: '전체' },
  { value: 'WAITING', label: '대기' },
  { value: 'COMPLETE', label: '완료' },
  { value: 'INVOICE', label: '세금계산서 발행' },
];

export default function AdminSettlementList() {
  const nav = useNavigate();

  return (
    <PageLayout
      title="정산 관리"
      description="호스트 정산 내역을 모니터링합니다"
      maxWidth={1200}
    >
      <NoticeCard padded>
        <NoticeIcon>
          <FaInfoCircle />
        </NoticeIcon>
        <NoticeText>
          정산 자동집계 기능을 준비 중입니다. 이용 완료 건을 4일 단위로 집계해
          호스트 정산 내역을 제공할 예정입니다.
        </NoticeText>
      </NoticeCard>

      <KPIGrid>
        {STATUS_KPI.map((k) => (
          <StatCard key={k.key} label={k.label} value="—" unit={k.unit} icon={k.icon} />
        ))}
      </KPIGrid>

      <FilterBar>
        {FILTER_TABS.map((tab) => (
          <FilterBtn key={tab.value} disabled>
            {tab.label}
          </FilterBtn>
        ))}
        <Spacer />
        <Badge>준비 중</Badge>
      </FilterBar>

      <ListCard padded>
        <TableHeader>
          <Col>정산 번호</Col>
          <Col>호스트</Col>
          <Col>회차 기간</Col>
          <Col>총매출</Col>
          <Col>최종 정산액</Col>
          <Col>상태</Col>
        </TableHeader>
        <EmptyWrap>
          <EmptyState
            title="정산 데이터가 없습니다"
            description="정산 자동집계 기능 준비 후 노출됩니다."
            action={
              <DummyBtn onClick={() => nav('/admin/commission-policy')}>
                수수료 정책 관리로 이동
              </DummyBtn>
            }
          />
        </EmptyWrap>
      </ListCard>
    </PageLayout>
  );
}

const NoticeCard = styled(Card)`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
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

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-5);

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
`;

const FilterBtn = styled.button`
  padding: 6px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  color: var(--gray-400);
  cursor: not-allowed;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Spacer = styled.div`
  flex: 1;
`;

const ListCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 1.5fr 1fr 1fr 100px;
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

const Col = styled.div``;

const EmptyWrap = styled.div`
  padding: var(--space-8) var(--space-5);
`;

const DummyBtn = styled.button`
  padding: 8px 16px;
  background: var(--white);
  border: 1px solid var(--sage);
  border-radius: var(--radius-md);
  color: var(--sage);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    background: var(--cream);
  }
`;
