import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { FaInfoCircle } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, Badge } from '../../../pay_shared/components';
import { findFeeAll } from '../../api/feeApi';

// 백엔드 PlaceType enum 영영 camelCase 소문자
const PLACE_TYPE_LABEL = {
  station: '숙소',
  workStay: '워크앤스테이',
  office: '오피스',
};

export default function CommissionPolicy() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    findFeeAll()
      .then((data) => { if (alive) setFees(data ?? []); })
      .catch((e) => {
        if (alive) setError(e?.response?.data?.message ?? '수수료 정책을 불러오지 못했습니다.');
      })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  // 적용 중 정책만 노출 — startAt <= NOW <= endAt (endAt null 영영 무기한)
  const activeFees = useMemo(() => {
    const now = Date.now();
    return fees
      .filter((f) => f.delYn !== 'Y')
      .filter((f) => {
        const start = f.startAt ? new Date(f.startAt).getTime() : 0;
        const end = f.endAt ? new Date(f.endAt).getTime() : Infinity;
        return start <= now && now <= end;
      });
  }, [fees]);

  return (
    <PageLayout
      title="수수료 정책"
      description="공간 타입별 수수료율을 확인합니다"
      maxWidth={900}
    >
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          수수료 정책은 어드민이 등록·수정하며, 호스트는 조회만 가능합니다.
          정산 시 가장 최근 회차의 정책을 따릅니다.
        </NoticeText>
      </NoticeCard>

      <Section
        title="공간 타입별 수수료"
        action={loading ? <Badge>불러오는 중</Badge> : null}
      >
        {error ? (
          <ErrorCard padded>{error}</ErrorCard>
        ) : (
          <PolicyCard padded>
            <TableHeader>
              <Col>공간 타입</Col>
              <Col>수수료율</Col>
              <Col>적용 시작</Col>
            </TableHeader>
            {activeFees.length === 0 && !loading ? (
              <EmptyRow>등록된 정책이 없습니다.</EmptyRow>
            ) : (
              activeFees.map((fee) => (
                <TableRow key={fee.no}>
                  <Col>{PLACE_TYPE_LABEL[fee.placeType] ?? fee.placeType}</Col>
                  <Col><Rate>{Number(fee.rate ?? 0)}%</Rate></Col>
                  <Col>
                    <DateText>
                      {fee.startAt
                        ? new Date(fee.startAt).toLocaleDateString()
                        : '—'}
                    </DateText>
                  </Col>
                </TableRow>
              ))
            )}
          </PolicyCard>
        )}
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
const PolicyCard = styled(Card)`padding: 0; overflow: hidden;`;
const TableHeader = styled.div`
  display: grid; grid-template-columns: 1.5fr 1fr 1fr;
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100); border-bottom: 1px solid var(--gray-200);
  font-size: 0.78rem; font-weight: 600; color: var(--gray-600);
`;
const TableRow = styled.div`
  display: grid; grid-template-columns: 1.5fr 1fr 1fr;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--gray-100);
  font-size: 0.88rem; color: var(--gray-800);
  &:last-child { border-bottom: none; }
`;
const Col = styled.div``;
const Rate = styled.span`font-family: var(--font-mono); font-weight: 600; color: var(--sage);`;
const DateText = styled.span`font-family: var(--font-mono); color: var(--gray-600);`;
const EmptyRow = styled.div`
  padding: var(--space-6) var(--space-5); text-align: center;
  color: var(--gray-400); font-size: 0.85rem;
`;
const ErrorCard = styled(Card)`color: #c0392b; text-align: center; font-size: 0.85rem;`;
