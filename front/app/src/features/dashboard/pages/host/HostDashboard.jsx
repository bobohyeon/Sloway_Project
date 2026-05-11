import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { HostGreeting } from '../../components/host/HostGreeting'
import { HostAlertBanner } from '../../components/host/HostAlertBanner'
import { HostKPICard } from '../../components/host/HostKPICard'
import { TodayCheckInList } from '../../components/host/TodayCheckInList'
import { RecentReviewList } from '../../components/host/RecentReviewList'
import { MySpaceCard } from '../../components/host/MySpaceCard'
import { HostQuickAction } from '../../components/host/HostQuickAction'

const HOST_NAME = '김우영'
const TODAY = '2026.05.11 (월)'

const ALERTS = [
  {
    id: 1,
    icon: '📥',
    title: '신규 예약',
    description: '확인이 필요한 신규 예약이 있어요',
    count: 2,
    path: '/host/reservation/list',
  },
  {
    id: 2,
    icon: '💬',
    title: '새 문의',
    description: '게스트가 보낸 문의에 답변해주세요',
    count: 1,
    path: '/host/chat',
  },
]

const KPIS = [
  {
    label: '오늘 예약',
    value: '3',
    unit: '건',
    icon: '📅',
    subText: '체크인 2 / 체크아웃 1',
  },
  {
    label: '이번 달 매출',
    value: '5,420,000',
    unit: '원',
    icon: '💰',
    delta: '12.5%',
    deltaType: 'up',
    subText: '전월 대비',
    highlight: true,
  },
  {
    label: '평균 평점',
    value: '4.8',
    unit: '/ 5.0',
    icon: '⭐',
    subText: '리뷰 132개',
  },
  {
    label: '신규 문의',
    value: '1',
    unit: '건',
    icon: '💬',
    subText: '답변 대기',
  },
]

const TODAY_CHECKINS = [
  {
    id: 1,
    customerName: '이재현',
    guestCount: 2,
    checkInTime: '14:00',
    spaceEmoji: '🌲',
    spaceName: '청평 숲속 파인뷰 스테이',
    nights: 2,
  },
  {
    id: 2,
    customerName: '박지수',
    guestCount: 4,
    checkInTime: '16:00',
    spaceEmoji: '🌲',
    spaceName: '청평 숲속 파인뷰 스테이',
    nights: 1,
  },
]

const RECENT_REVIEWS = [
  {
    id: 1,
    rating: 5,
    content: '풍경도 너무 좋았고 사장님도 친절하셨어요! 다음에 또 오고 싶은 곳이에요. 일하면서도 충분히 쉴 수 있어서 좋았어요.',
    reviewer: '박지수',
    date: '2026.05.02',
    spaceEmoji: '🌲',
    spaceName: '청평 숲속 파인뷰 스테이',
  },
  {
    id: 2,
    rating: 4,
    content: '깨끗했고 조용해서 집중하기 좋았어요. 다만 WiFi가 가끔 끊기는 게 아쉬웠어요.',
    reviewer: '최민서',
    date: '2026.05.01',
    spaceEmoji: '🌲',
    spaceName: '청평 숲속 파인뷰 스테이',
  },
  {
    id: 3,
    rating: 5,
    content: '바다 바로 앞이라 분위기가 너무 좋네요. 워케이션 추천!',
    reviewer: '정유나',
    date: '2026.04.28',
    spaceEmoji: '🌊',
    spaceName: '강릉 바다향 코워킹',
  },
]

const MY_SPACES = [
  {
    id: 1,
    emoji: '🌲',
    name: '청평 숲속 파인뷰 스테이',
    category: '워크앤스테이',
    location: '경기 가평',
    status: 'active',
    occupancyRate: 73,
    rating: 4.8,
    reviewCount: 132,
    monthRevenue: 4180000,
    monthBookings: 8,
    nextBooking: '5/12 ~ 5/14',
  },
  {
    id: 2,
    emoji: '🌊',
    name: '강릉 바다향 코워킹',
    category: '코워킹오피스',
    location: '강원 강릉',
    status: 'active',
    occupancyRate: 58,
    rating: 4.6,
    reviewCount: 47,
    monthRevenue: 1240000,
    monthBookings: 14,
    nextBooking: '5/13 ~ 5/13',
  },
  {
    id: 3,
    emoji: '🫒',
    name: '남해 올리브 팜스테이',
    category: '숙소',
    location: '경남 남해',
    status: 'paused',
    occupancyRate: 0,
    rating: 4.9,
    reviewCount: 28,
    monthRevenue: 0,
    monthBookings: 0,
    nextBooking: null,
  },
]

const QUICK_ACTIONS = [
  {
    id: 1,
    icon: '➕',
    title: '공간 등록',
    description: '새로운 공간을 등록해보세요',
    path: '/host/space',
  },
  {
    id: 2,
    icon: '📋',
    title: '예약 관리',
    description: '예약 현황 및 일정 관리',
    count: 2,
    path: '/host/reservation/list',
  },
  {
    id: 3,
    icon: '💬',
    title: '메시지',
    description: '게스트 문의 답변',
    count: 1,
    path: '/host/chat',
  },
  {
    id: 4,
    icon: '💰',
    title: '정산 보기',
    description: '매출과 정산 내역 확인',
    path: '/host/settlement/dashboard',
  },
  {
    id: 5,
    icon: '📊',
    title: '매출 통계',
    description: '상세 매출 분석과 트렌드',
    path: '/host/stats/sales',
  },
  {
    id: 6,
    icon: '🏠',
    title: '내 공간 관리',
    description: '공간 정보 수정 및 상태 변경',
    path: '/host/space/list',
  },
]

export default function HostDashboard() {
  const nav = useNavigate()

  return (
    <Page>
      <HostGreeting hostName={HOST_NAME} todayDate={TODAY} />

      <AlertSection>
        <HostAlertBanner
          alerts={ALERTS}
          onClickAlert={(alert) => nav(alert.path)}
        />
      </AlertSection>

      <KPIGrid>
        {KPIS.map((kpi, i) => (
          <HostKPICard key={i} {...kpi} />
        ))}
      </KPIGrid>

      <TwoColumnGrid>
        <TodayCheckInList
          items={TODAY_CHECKINS}
          onSeeAll={() => nav('/host/reservation/list')}
          onClickItem={(item) => nav(`/host/reservation/list/${item.id}`)}
        />
        <RecentReviewList
          reviews={RECENT_REVIEWS}
          onSeeAll={() => nav('/host/review')}
          onClickReview={() => nav('/host/review')}
        />
      </TwoColumnGrid>

      <SpacesSection>
        <SectionHeader>
          <SectionTitle>내 공간 현황</SectionTitle>
          <SectionSubtitle>등록된 공간 {MY_SPACES.length}개</SectionSubtitle>
        </SectionHeader>
        <SpacesList>
          {MY_SPACES.map((space) => (
            <MySpaceCard
              key={space.id}
              space={space}
              onClick={(s) => nav(`/host/space/${s.id}`)}
            />
          ))}
        </SpacesList>
      </SpacesSection>

      <QuickSection>
        <SectionTitle>빠른 액션</SectionTitle>
        <QuickGrid>
          {QUICK_ACTIONS.map((action) => (
            <HostQuickAction
              key={action.id}
              icon={action.icon}
              title={action.title}
              description={action.description}
              count={action.count}
              onClick={() => nav(action.path)}
            />
          ))}
        </QuickGrid>
      </QuickSection>
    </Page>
  )
}

const Page = styled.div`
  width: 100%;
  padding: var(--space-6) var(--space-5);
  animation: fadeInUp 480ms ease-out both;
`

const AlertSection = styled.div`
  margin-bottom: var(--space-5);
`

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
`

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

const SpacesSection = styled.div`
  margin-bottom: var(--space-6);
`

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: var(--space-3);
`

const SectionTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
`

const SectionSubtitle = styled.span`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const SpacesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`

const QuickSection = styled.div``

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-3);
  margin-top: var(--space-3);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`
