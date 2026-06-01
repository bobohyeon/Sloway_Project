import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, EmptyState } from '../../../pay_shared/components';
import { findSettleByHostNo } from '../../api/settlementApi';

const HOST_NO = 1;

const POLICY_ITEMS = [
  { title: '발행 주기', description: '정산 회차마다 4일 단위로 자동 발행됩니다.' },
  { title: '발행 시점', description: '정산 완료 후 세금계산서가 발행됩니다.' },
  { title: '발행 대상', description: '사업자 등록을 마친 호스트에 한해 발행됩니다.' },
];

const won = (n) => `${Number(n ?? 0).toLocaleString()}원`;
const fmtDate = (d) => (d ? String(d) : '—');
const fmtDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

export default function TaxInvoice() {
  const nav = useNavigate();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    // 정산 중 세금계산서 발행(INVOICE) 상태만 추림
    findSettleByHostNo(HOST_NO)
      .then((list) => setInvoices(list.filter((s) => s.status === 'INVOICE')))
      .catch((err) => console.error('세금계산서 내역 조회 실패', err));
  }, []);

  return (
    <PageLayout
      title="세금계산서"
      description="정산 회차별 세금계산서 발행 내역"
      maxWidth={1000}
    >
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

      <Section title="발행 내역">
        <ListCard padded>
          <TableHeader>
            <Col>정산 번호</Col>
            <Col>정산 회차</Col>
            <Col>발행 일자</Col>
            <Col>정산 금액</Col>
            <Col>상태</Col>
          </TableHeader>

          {invoices.length === 0 ? (
            <EmptyWrap>
              <EmptyState
                icon="🧾"
                title="발행 내역이 없습니다"
                description="정산 완료 → 세금계산서 발행(INVOICE) 후 노출됩니다."
              />
            </EmptyWrap>
          ) : (
            invoices.map((s) => (
              <RowItem
                key={s.no}
                onClick={() => nav(`/host/settlement/history/${s.no}`)}
              >
                <Col>#{s.no}</Col>
                <Col>
                  {fmtDate(s.settleStartDate)} ~ {fmtDate(s.settleEndDate)}
                </Col>
                <Col>{fmtDateTime(s.invoicedAt)}</Col>
                <Col>
                  <Strong>{won(s.payoutAmt)}</Strong>
                </Col>
                <Col>
                  <Badge>발행 완료</Badge>
                </Col>
              </RowItem>
            ))
          )}
        </ListCard>
      </Section>
    </PageLayout>
  );
}

const PolicyCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;
const PolicyRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--gray-100);
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;
const PolicyTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-800);
`;
const PolicyDesc = styled.span`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`;
const ListCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;
const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 90px 1.5fr 1fr 1fr 100px;
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
  grid-template-columns: 90px 1.5fr 1fr 1fr 100px;
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
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: #0064ff;
  color: var(--white);
  border-radius: var(--radius-full);
  font-size: 0.74rem;
  font-weight: 600;
`;
const EmptyWrap = styled.div`
  padding: var(--space-8) var(--space-5);
`;
