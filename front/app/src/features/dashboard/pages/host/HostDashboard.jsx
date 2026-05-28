import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaCalendarAlt,
  FaCoins,
  FaStar,
  FaComments,
  FaPlus,
  FaClipboardList,
  FaChartBar,
  FaHome,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { StatCard } from '../../../pay_shared/components/StatCard';
import { Card, Section, EmptyState } from '../../../pay_shared/components';

const HOST_NAME = '김우영';

const PENDING_KPIS = [
  {
    key: 'todayRsvn',
    label: '오늘 예약',
    unit: '건',
    icon: <FaCalendarAlt />,
    note: '예약 도메인 통합 대기',
  },
  {
    key: 'monthRevenue',
    label: '이번 달 매출',
    unit: '원',
    icon: <FaCoins />,
    note: '정산 도메인 통합 대기',
  },
  {
    key: 'avgRating',
    label: '평균 평점',
    unit: '/ 5.0',
    icon: <FaStar />,
    note: '리뷰 도메인 통합 대기',
  },
  {
    key: 'newInquiry',
    label: '신규 문의',
    unit: '건',
    icon: <FaComments />,
    note: '메시지 도메인 통합 대기',
  },
];

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

export default function HostDashboard() {
  const nav = useNavigate();

  return (
    <PageLayout maxWidth={1200}>
      <Greeting>
        <GreetingTitle>
          안녕하세요, <Highlight>{HOST_NAME}</Highlight> 호스트님
        </GreetingTitle>
        <GreetingSub>
          예약·리뷰·공간 도메인이 다른 팀원 영역이라, 본 페이지는 통합 단계
          진입까지 빠른 액션 위주로 동작합니다.
        </GreetingSub>
      </Greeting>

      <KPIGrid>
        {PENDING_KPIS.map((k) => (
          <PendingCard key={k.key}>
            <StatCard label={k.label} value="—" unit={k.unit} icon={k.icon} />
            <PendingNote>{k.note}</PendingNote>
          </PendingCard>
        ))}
      </KPIGrid>

      <Section title="오늘 일정 · 최근 리뷰">
        <EmptyCard padded>
          <EmptyState
            title="예약·리뷰 통합 대기"
            description="3번 도메인(예약·리뷰) API 합류 후 노출됩니다."
          />
        </EmptyCard>
      </Section>

      <Section title="내 공간 현황">
        <EmptyCard padded>
          <EmptyState
            title="공간 도메인 통합 대기"
            description="2번 도메인(공간) API 합류 후 노출됩니다."
          />
        </EmptyCard>
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

const PendingCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PendingNote = styled.span`
  font-size: 0.72rem;
  color: var(--gray-400);
  padding-left: 4px;
`;

const EmptyCard = styled(Card)`
  padding: var(--space-6) var(--space-5);
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
