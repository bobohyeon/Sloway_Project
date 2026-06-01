import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaPlus,
  FaCheckCircle,
  FaFileInvoice,
  FaHourglassHalf,
  FaMoneyBillWave,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, EmptyState } from '../../../pay_shared/components';
import { findSettleAll, createSettle } from '../../api/settlementApi';

const STATUS_META = {
  WAITING: { label: '정산 대기', color: 'var(--gray-400)' },
  COMPLETE: { label: '정산 완료', color: 'var(--sage)' },
  INVOICE: { label: '세금계산서 발행', color: '#0064FF' },
};

const FILTER_TABS = [
  { value: 'all', label: '전체' },
  { value: 'WAITING', label: '대기' },
  { value: 'COMPLETE', label: '완료' },
  { value: 'INVOICE', label: '세금계산서 발행' },
];

const won = (n) => `${Number(n ?? 0).toLocaleString()}원`;
const fmtDate = (d) => (d ? String(d) : '—');

export default function AdminSettlementList() {
  const nav = useNavigate();
  const [settles, setSettles] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    hostNo: '',
    settleStartDate: '',
    settleEndDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    try {
      const list = await findSettleAll();
      setSettles(list);
    } catch (err) {
      console.error('정산 목록 조회 실패', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  // 상태별 건수 + 총 정산액 집계 (클라이언트 사이드)
  const kpi = useMemo(() => {
    const k = { waiting: 0, complete: 0, invoice: 0, totalPayout: 0 };
    settles.forEach((s) => {
      if (s.status === 'WAITING') k.waiting += 1;
      if (s.status === 'COMPLETE') k.complete += 1;
      if (s.status === 'INVOICE') k.invoice += 1;
      k.totalPayout += s.payoutAmt ?? 0;
    });
    return k;
  }, [settles]);

  const filtered = useMemo(() => {
    if (filter === 'all') return settles;
    return settles.filter((s) => s.status === filter);
  }, [settles, filter]);

  const handleCreate = async () => {
    if (!form.hostNo || !form.settleStartDate || !form.settleEndDate) {
      alert('호스트 번호와 정산 기간을 모두 입력하세요.');
      return;
    }
    setSubmitting(true);
    try {
      const created = await createSettle({
        hostNo: Number(form.hostNo),
        settleStartDate: form.settleStartDate,
        settleEndDate: form.settleEndDate,
      });
      // 백엔드가 매출 0이면 null 반환(0원 스킵)
      if (created == null) {
        alert('해당 기간 매출이 0원이라 정산이 생성되지 않았습니다.');
      }
      setModalOpen(false);
      setForm({ hostNo: '', settleStartDate: '', settleEndDate: '' });
      await load();
    } catch (err) {
      console.error('정산 생성 실패', err);
      alert('정산 생성에 실패했습니다. (수수료 정책/데이터를 확인하세요)');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="정산 관리"
      description="호스트 정산 내역을 모니터링하고 수동 정산을 생성합니다"
      maxWidth={1200}
      actions={
        <CreateBtn onClick={() => setModalOpen(true)}>
          <FaPlus /> 정산 생성
        </CreateBtn>
      }
    >
      <KPIGrid>
        <StatCard
          label="정산 대기"
          value={kpi.waiting}
          unit="건"
          icon={<FaHourglassHalf />}
        />
        <StatCard
          label="정산 완료"
          value={kpi.complete}
          unit="건"
          icon={<FaCheckCircle />}
        />
        <StatCard
          label="세금계산서 발행"
          value={kpi.invoice}
          unit="건"
          icon={<FaFileInvoice />}
        />
        <StatCard
          label="총 정산액"
          value={kpi.totalPayout.toLocaleString()}
          unit="원"
          icon={<FaMoneyBillWave />}
        />
      </KPIGrid>

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
          <Col>호스트</Col>
          <Col>회차 기간</Col>
          <Col>총매출</Col>
          <Col>최종 정산액</Col>
          <Col>상태</Col>
        </TableHeader>

        {filtered.length === 0 ? (
          <EmptyWrap>
            <EmptyState
              title="정산 내역이 없습니다"
              description="상단 '정산 생성'으로 수동 정산을 만들거나, 자동배치(4일마다)가 생성합니다."
            />
          </EmptyWrap>
        ) : (
          filtered.map((s) => (
            <Row key={s.no} onClick={() => nav(`/admin/settlement/host/${s.no}`)}>
              <Col>#{s.no}</Col>
              <Col>호스트 #{s.hostNo}</Col>
              <Col>
                {fmtDate(s.settleStartDate)} ~ {fmtDate(s.settleEndDate)}
              </Col>
              <Col>{won(s.totalAmt)}</Col>
              <Col>
                <Strong>{won(s.payoutAmt)}</Strong>
              </Col>
              <Col>
                <StatusBadge $color={STATUS_META[s.status]?.color}>
                  {STATUS_META[s.status]?.label ?? s.status}
                </StatusBadge>
              </Col>
            </Row>
          ))
        )}
      </ListCard>

      {modalOpen && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>정산 생성 (수동)</ModalTitle>
            <ModalDesc>
              호스트와 기간을 지정해 해당 기간의 결제·환불을 집계합니다.
            </ModalDesc>
            <Field>
              <label>호스트 번호</label>
              <input
                type="number"
                value={form.hostNo}
                onChange={(e) => setForm({ ...form, hostNo: e.target.value })}
                placeholder="예: 1"
              />
            </Field>
            <Field>
              <label>정산 시작일</label>
              <input
                type="date"
                value={form.settleStartDate}
                onChange={(e) =>
                  setForm({ ...form, settleStartDate: e.target.value })
                }
              />
            </Field>
            <Field>
              <label>정산 종료일</label>
              <input
                type="date"
                value={form.settleEndDate}
                onChange={(e) =>
                  setForm({ ...form, settleEndDate: e.target.value })
                }
              />
            </Field>
            <ModalActions>
              <CancelBtn onClick={() => setModalOpen(false)}>취소</CancelBtn>
              <SubmitBtn onClick={handleCreate} disabled={submitting}>
                {submitting ? '생성 중…' : '생성'}
              </SubmitBtn>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageLayout>
  );
}

const CreateBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--sage);
  border: none;
  border-radius: var(--radius-md);
  color: var(--white);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    filter: brightness(0.95);
  }
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
  grid-template-columns: 90px 1fr 1.6fr 1fr 1fr 110px;
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

const Row = styled.div`
  display: grid;
  grid-template-columns: 90px 1fr 1.6fr 1fr 1fr 110px;
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

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  width: 100%;
  max-width: 420px;
  background: var(--white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
`;

const ModalTitle = styled.h3`
  margin: 0 0 var(--space-2);
  font-size: 1.1rem;
  color: var(--gray-900);
`;

const ModalDesc = styled.p`
  margin: 0 0 var(--space-4);
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: var(--space-3);

  label {
    font-size: 0.82rem;
    color: var(--gray-700);
  }

  input {
    padding: 8px 12px;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-4);
`;

const CancelBtn = styled.button`
  padding: 8px 16px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  color: var(--gray-600);
  font-size: 0.85rem;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
`;

const SubmitBtn = styled.button`
  padding: 8px 16px;
  background: var(--sage);
  border: none;
  border-radius: var(--radius-md);
  color: var(--white);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
