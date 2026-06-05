import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaCoins,
  FaReceipt,
  FaUndo,
  FaChartLine,
  FaPlus,
  FaClipboardList,
  FaComments,
  FaChartBar,
  FaHome,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState } from '../../../pay_shared/components';
import { VerticalBarChart } from '../../../stats/components/admin/VerticalBarChart';
import { findHostSalesStats } from '../../../stats/api/statsApi';
import { findHostSpaces, findHostRsvns } from '../../../rsvn/api/rsvnApi';
import { getAnchorMonth } from '../../../stats/components/admin/statsRange';

const QUICK_ACTIONS = [
  {
    id: 1,
    icon: <FaPlus />,
    title: '공간 등록',
    description: '새로운 공간을 등록합니다',
    path: '/host/space',
  },
  {
    id: 2,
    icon: <FaClipboardList />,
    title: '예약 관리',
    description: '예약 현황 및 일정',
    path: '/host/reservation/list',
  },
  {
    id: 3,
    icon: <FaComments />,
    title: '메시지',
    description: '게스트 문의 답변',
    path: '/host/chat',
  },
  {
    id: 4,
    icon: <FaCoins />,
    title: '정산 보기',
    description: '매출과 정산 내역',
    path: '/host/settlement/dashboard',
  },
  {
    id: 5,
    icon: <FaChartBar />,
    title: '매출 통계',
    description: '상세 매출 분석',
    path: '/host/stats/sales',
  },
  {
    id: 6,
    icon: <FaHome />,
    title: '내 공간 관리',
    description: '공간 정보 수정',
    path: '/host/space/list',
  },
];

function formatMan(value) {
  return `${Math.floor(Number(value ?? 0) / 10000).toLocaleString()}만`;
}

function spaceName(s, idx) {
  return s.placeName ?? s.title ?? s.name ?? `공간 #${s.placeNo ?? idx + 1}`;
}

export default function HostDashboard() {
  const nav = useNavigate();
  const { year, month } = useMemo(() => getAnchorMonth(), []);

  const [sales, setSales] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [rsvns, setRsvns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [s, sp, rs] = await Promise.all([
          findHostSalesStats(year, month, 6),
          findHostSpaces().catch(() => []),
          findHostRsvns().catch(() => []),
        ]);
        if (!alive) return;
        setSales(s);
        setSpaces(Array.isArray(sp) ? sp : []);
        setRsvns(Array.isArray(rs) ? rs : []);
      } catch (e) {
        if (alive)
          setError(e?.response?.data?.message ?? '대시보드 데이터를 불러오지 못했습니다.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [year, month]);

  const trendData = (sales?.trend ?? []).map((row) => ({
    label: row.yearMonth?.slice(5) ?? '',
    value: Number(row.totalAmt ?? 0),
  }));

  return (
    <PageLayout maxWidth={1200}>
      <Greeting>
        <GreetingTitle>
          안녕하세요, <Highlight>호스트</Highlight>님
        </GreetingTitle>
        <GreetingSub>최근 6개월 매출·예약 요약입니다.</GreetingSub>
        {loading && <StatusText>불러오는 중...</StatusText>}
        {error && <ErrorText>{error}</ErrorText>}
      </Greeting>

      <KPIGrid>
        <StatCard
          label="최근 6개월 매출"
          value={Number(sales?.totalAmt ?? 0).toLocaleString()}
          unit="원"
          icon={<FaCoins />}
          highlight
        />
        <StatCard
          label="결제 건수"
          value={Number(sales?.payCount ?? 0).toLocaleString()}
          unit="건"
          icon={<FaReceipt />}
        />
        <StatCard
          label="환불액"
          value={Number(sales?.refundAmt ?? 0).toLocaleString()}
          unit="원"
          icon={<FaUndo />}
        />
        <StatCard
          label="평균 결제금"
          value={Number(sales?.avgAmt ?? 0).toLocaleString()}
          unit="원"
          icon={<FaChartLine />}
        />
      </KPIGrid>

      {trendData.length > 0 ? (
        <VerticalBarChart
          title="최근 6개월 매출 추이"
          data={trendData}
          formatValue={formatMan}
        />
      ) : (
        <Section title="최근 6개월 매출 추이">
          <EmptyCard padded>
            <EmptyState
              title="매출 데이터가 없습니다"
              description="결제가 쌓이면 추이가 노출됩니다."
            />
          </EmptyCard>
        </Section>
      )}

      <Section title="내 공간 현황">
        {spaces.length > 0 ? (
          <Card padded>
            <SectionMeta>등록 공간 {spaces.length}개</SectionMeta>
            <ChipRow>
              {spaces.slice(0, 12).map((s, i) => (
                <Chip key={s.placeNo ?? i}>{spaceName(s, i)}</Chip>
              ))}
            </ChipRow>
          </Card>
        ) : (
          <EmptyCard padded>
            <EmptyState
              title="등록된 공간이 없습니다"
              description="공간을 등록하면 여기에 표시됩니다."
            />
          </EmptyCard>
        )}
      </Section>

      <Section title="예약 현황">
        {rsvns.length > 0 ? (
          <Card padded>
            <SectionMeta>전체 예약 {rsvns.length.toLocaleString()}건</SectionMeta>
            <MutedNote>최근 예약 상세는 '예약 관리'에서 확인하세요.</MutedNote>
          </Card>
        ) : (
          <EmptyCard padded>
            <EmptyState title="예약 내역이 없습니다" />
          </EmptyCard>
        )}
      </Section>

      <Section title="빠른 액션">
        <QuickGrid>
          {QUICK_ACTIONS.map((a) => (
            <QuickCard key={a.id} onClick={() => nav(a.path)}>
              <QuickIcon>{a.icon}</QuickIcon>
              <QuickTitle>{a.title}</QuickTitle>
              <QuickDesc>{a.description}</QuickDesc>
            </QuickCard>
          ))}
        </QuickGrid>
      </Section>
    </PageLayout>
  );
}

const Greeting = styled.div`
  margin-bottom: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const GreetingTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin: 0 0 6px 0;
`;

const Highlight = styled.span`
  color: var(--sage);
`;

const GreetingSub = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
`;

const StatusText = styled.span`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const ErrorText = styled.span`
  font-size: 0.82rem;
  color: #c0392b;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-6);

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyCard = styled(Card)`
  padding: var(--space-6) var(--space-5);
`;

const SectionMeta = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.span`
  padding: 6px 12px;
  background: var(--cream);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-full);
  font-size: 0.82rem;
  color: var(--gray-800);
`;

const MutedNote = styled.p`
  font-size: 0.8rem;
  color: var(--gray-500);
  margin: 0;
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const QuickCard = styled.button`
  text-align: left;
  padding: var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 200ms ease;
  font-family: 'Noto Sans KR', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
    transform: translateY(-1px);
  }
`;

const QuickIcon = styled.span`
  font-size: 1.2rem;
  color: var(--sage);
`;

const QuickTitle = styled.span`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
`;

const QuickDesc = styled.span`
  font-size: 0.78rem;
  color: var(--gray-600);
  line-height: 1.4;
`;
