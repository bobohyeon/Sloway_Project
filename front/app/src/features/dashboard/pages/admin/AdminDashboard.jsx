import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import PageLayout from '../../../../app/layouts/page/PageLayout'
import {
  FaExclamationTriangle,
  FaHome,
  FaFlag,
  FaUsers,
  FaPlusCircle,
  FaCoins,
  FaChartBar,
  FaFileAlt,
  FaBullhorn,
} from 'react-icons/fa'

import { AlertBanner } from '../../components/admin/AlertBanner'
import { AdminKPICard } from '../../components/admin/AdminKPICard'
import { DailyTransactionChart } from '../../components/admin/DailyTransactionChart'
import { DonutChart } from '../../components/admin/DonutChart'
import { AdminQuickAction } from '../../components/admin/AdminQuickAction'

const ALERTS = [
  {
    id: 1,
    icon: <FaExclamationTriangle />,
    title: '환불 이상 감지',
    description: 'PG사 송금 실패 또는 호스트 거절 케이스가 발생했어요',
    count: 2,
    path: '/admin/refund',
  },
  {
    id: 2,
    icon: <FaHome />,
    title: '신규 공간 승인 대기',
    description: '호스트가 등록한 공간을 검토해주세요',
    count: 5,
    path: '/admin/space/review',
  },
  {
    id: 3,
    icon: <FaFlag />,
    title: '신고된 리뷰',
    description: '리뷰 신고가 접수됐어요. 검토 후 처리해주세요',
    count: 1,
    path: '/admin/review/report',
  },
]

const DAILY_DATA = [
  { date: '2026-05-02', revenue: 8200000, bookings: 24 },
  { date: '2026-05-03', revenue: 12500000, bookings: 38 },
  { date: '2026-05-04', revenue: 9800000, bookings: 29 },
  { date: '2026-05-05', revenue: 14200000, bookings: 41 },
  { date: '2026-05-06', revenue: 11500000, bookings: 33 },
  { date: '2026-05-07', revenue: 13800000, bookings: 40 },
  { date: '2026-05-08', revenue: 15200000, bookings: 45 },
]

const CATEGORY_SALES = [
  { label: '워크앤스테이', value: 42500000, color: '#7A8B71' },
  { label: '숙소', value: 28300000, color: '#A8B89F' },
  { label: '코워킹오피스', value: 13400000, color: '#C5D1BD' },
]

const PAYMENT_METHODS = [
  { label: '카카오페이', value: 38500000, color: '#FEE500' },
  { label: '신용카드', value: 25200000, color: '#7A8B71' },
  { label: '네이버페이', value: 12800000, color: '#03C75A' },
  { label: '토스페이', value: 7700000, color: '#0064FF' },
]

const QUICK_ACTIONS = [
  {
    id: 1,
    icon: <FaUsers />,
    title: '회원 관리',
    description: '회원 조회 및 권한 설정',
    path: '/admin/members',
  },
  {
    id: 2,
    icon: <FaHome />,
    title: '공간 승인',
    description: '신규 등록 공간 검토',
    count: 5,
    path: '/admin/space/review',
  },
  {
    id: 3,
    icon: <FaCoins />,
    title: '환불 관리',
    description: '환불 요청 모니터링',
    count: 2,
    path: '/admin/refund',
  },
  {
    id: 4,
    icon: <FaFlag />,
    title: '신고 처리',
    description: '리뷰·게시글 신고 처리',
    count: 1,
    path: '/admin/review/report',
  },
  {
    id: 5,
    icon: <FaFileAlt />,
    title: '수수료 정책',
    description: '카테고리별 수수료 관리',
    path: '/admin/settlement/fee',
  },
  {
    id: 6,
    icon: <FaBullhorn />,
    title: '공지사항 관리',
    description: '플랫폼 공지 작성·발행',
    path: '/admin/notice',
  },
]

export default function AdminDashboard() {
  const nav = useNavigate()

  return (
    <PageLayout
      title="관리자 대시보드"
      description="플랫폼 운영 현황을 한눈에 확인하세요"
      maxWidth={1200}
    >

      <AlertSection>
        <AlertBanner
          alerts={ALERTS}
          onClickAlert={(alert) => nav(alert.path)}
        />
      </AlertSection>

      <KPIGrid>
        <AdminKPICard
          label="총 회원수"
          value="12,458"
          unit="명"
          icon={<FaUsers />}
          subText="전체 누적"
        />
        <AdminKPICard
          label="신규 가입"
          value="142"
          unit="명"
          icon={<FaPlusCircle />}
          delta="18%"
          deltaType="up"
          subText="전월 대비"
        />
        <AdminKPICard
          label="활성 호스트"
          value="348"
          unit="명"
          icon={<FaHome />}
          delta="5%"
          deltaType="up"
          subText="이번 주"
        />
        <AdminKPICard
          label="이번 달 매출"
          value="8,420"
          unit="만원"
          icon={<FaCoins />}
          delta="12.5%"
          deltaType="up"
          subText="전월 대비"
          highlight
        />
      </KPIGrid>

      <ChartSection>
        <DailyTransactionChart data={DAILY_DATA} />
      </ChartSection>

      <DonutGrid>
        <DonutChart
          title="카테고리별 매출"
          data={CATEGORY_SALES}
          totalLabel="이번 달 매출"
          totalUnit="원"
          formatTotal={(v) => `${Math.floor(v / 10000).toLocaleString()}만`}
        />
        <DonutChart
          title="결제 수단별 비율"
          data={PAYMENT_METHODS}
          totalLabel="이번 달 결제"
          totalUnit="원"
          formatTotal={(v) => `${Math.floor(v / 10000).toLocaleString()}만`}
        />
      </DonutGrid>

      <QuickSection>
        <QuickTitle>빠른 액션</QuickTitle>
        <QuickGrid>
          {QUICK_ACTIONS.map((action) => (
            <AdminQuickAction
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
    </PageLayout>
  )
}
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

const ChartSection = styled.div`
  margin-bottom: var(--space-5);
`

const DonutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`

const QuickSection = styled.div``

const QuickTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: var(--space-3);
`

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`
