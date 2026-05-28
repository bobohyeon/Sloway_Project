import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const POLICY_ITEMS = [
  { title: '발행 주기', description: '정산 회차마다 4일 단위로 자동 발행됩니다.' },
  { title: '발행 시점', description: '정산 완료(COMPLETE) 후 세금계산서 발행(INVOICE)으로 전이됩니다.' },
  { title: '발행 대상', description: '사업자 등록을 마친 호스트에 한해 발행됩니다.' },
];

export default function TaxInvoice() {
  return (
    <PageLayout
      title="세금계산서"
      description="정산 회차별 세금계산서 발행 내역"
      maxWidth={1000}
    >
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          세금계산서는 정산 회차 완료 후 4일 단위 자동 발행입니다.
          Settle 도메인 본인(4번) 보류 영역 — 정산 본체 구현 후 활성화됩니다.
        </NoticeText>
      </NoticeCard>

      <Section title="발행 정책">
        <PolicyCard padded>
          {POLICY_ITEMS.map((item, i) => (
            <PolicyRow key={i}>
              <PolicyTitle>{item.title}</PolicyTitle>
              <PolicyDesc>{item.description}</PolicyDesc>
            </PolicyRow>
          ))}
        </PolicyCard>
      </Section>

      <Section title="발행 내역" action={<Badge>Settle 통합 대기</Badge>}>
        <ListCard padded>
          <TableHeader>
            <Col>발행 번호</Col>
            <Col>정산 회차</Col>
            <Col>발행 일자</Col>
            <Col>금액</Col>
            <Col>상태</Col>
          </TableHeader>
          <EmptyWrap>
            <EmptyState
              icon="🧾"
              title="발행 내역이 없습니다"
              description="정산 완료 → 세금계산서 발행 전이 후 노출됩니다."
            />
          </EmptyWrap>
        </ListCard>
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
const PolicyCard = styled(Card)`display: flex; flex-direction: column; gap: var(--space-3);`;
const PolicyRow = styled.div`
  display: flex; flex-direction: column; gap: 4px;
  padding-bottom: var(--space-3); border-bottom: 1px solid var(--gray-100);
  &:last-child { border-bottom: none; padding-bottom: 0; }
`;
const PolicyTitle = styled.span`font-size: 0.9rem; font-weight: 600; color: var(--gray-800);`;
const PolicyDesc = styled.span`font-size: 0.82rem; color: var(--gray-600); line-height: 1.5;`;
const ListCard = styled(Card)`padding: 0; overflow: hidden;`;
const TableHeader = styled.div`
  display: grid; grid-template-columns: 100px 1fr 1fr 1fr 100px;
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100); border-bottom: 1px solid var(--gray-200);
  font-size: 0.78rem; font-weight: 600; color: var(--gray-600);
  @media (max-width: 720px) { display: none; }
`;
const Col = styled.div``;
const EmptyWrap = styled.div`padding: var(--space-8) var(--space-5);`;
