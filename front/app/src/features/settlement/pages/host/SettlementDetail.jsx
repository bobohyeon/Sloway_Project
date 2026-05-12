import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Card, Section, Button } from '../../../pay_shared/components';
import { SettlementDetailHeader } from '../../components/host/SettlementDetailHeader';
import { SettlementBookingsList } from '../../components/host/SettlementBookingsList';

const SETTLEMENTS = [
  {
    id: 1,
    settlementId: 'STL-202606-00892',
    status: 'scheduled',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 4856250,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.06.05',
    completedAt: null,
    periodStart: '2026.05.01',
    periodEnd: '2026.05.31',
    feeRate: 12.5,
    feeAmount: 693750,
    totalSales: 5550000,
    bookings: [
      {
        id: 1,
        bookingId: 'SW-...0921',
        customerName: '이재현 고객',
        guests: 2,
        nights: 2,
        checkInDate: '2026.05.05 ~ 05.07',
        amount: 540000,
      },
      {
        id: 2,
        bookingId: 'SW-...0918',
        customerName: '박지수 고객',
        guests: 4,
        nights: 3,
        checkInDate: '2026.05.10 ~ 05.13',
        amount: 810000,
      },
      {
        id: 3,
        bookingId: 'SW-...0917',
        customerName: '김도현 고객',
        guests: 2,
        nights: 2,
        checkInDate: '2026.05.14 ~ 05.16',
        amount: 540000,
      },
      {
        id: 4,
        bookingId: 'SW-...0912',
        customerName: '최민서 고객',
        guests: 3,
        nights: 4,
        checkInDate: '2026.05.18 ~ 05.22',
        amount: 1080000,
      },
      {
        id: 5,
        bookingId: 'SW-...0905',
        customerName: '정유나 고객',
        guests: 2,
        nights: 3,
        checkInDate: '2026.05.23 ~ 05.26',
        amount: 810000,
      },
      {
        id: 6,
        bookingId: 'SW-...0898',
        customerName: '한승원 고객',
        guests: 2,
        nights: 2,
        checkInDate: '2026.05.26 ~ 05.28',
        amount: 540000,
      },
      {
        id: 7,
        bookingId: 'SW-...0885',
        customerName: '강하늘 고객',
        guests: 4,
        nights: 2,
        checkInDate: '2026.05.28 ~ 05.30',
        amount: 720000,
      },
      {
        id: 8,
        bookingId: 'SW-...0876',
        customerName: '윤서준 고객',
        guests: 2,
        nights: 1,
        checkInDate: '2026.05.30 ~ 05.31',
        amount: 270000,
      },
      {
        id: 9,
        bookingId: 'SW-...0867',
        customerName: '서지호 고객',
        guests: 2,
        nights: 1,
        checkInDate: '2026.05.31 ~ 06.01',
        amount: 240000,
      },
    ],
  },
  {
    id: 2,
    settlementId: 'STL-202604-00847',
    status: 'completed',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 3657500,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.04.05',
    completedAt: '2026.04.05 09:30',
    periodStart: '2026.04.01',
    periodEnd: '2026.04.30',
    feeRate: 12.5,
    feeAmount: 522500,
    totalSales: 4180000,
    bookings: [
      {
        id: 1,
        bookingId: 'SW-...0847',
        customerName: '이재현 고객',
        guests: 2,
        nights: 2,
        checkInDate: '2026.04.05 ~ 04.07',
        amount: 540000,
      },
      {
        id: 2,
        bookingId: 'SW-...0723',
        customerName: '박지수 고객',
        guests: 4,
        nights: 3,
        checkInDate: '2026.04.10 ~ 04.13',
        amount: 720000,
      },
      {
        id: 3,
        bookingId: 'SW-...0689',
        customerName: '김도현 고객',
        guests: 2,
        nights: 1,
        checkInDate: '2026.04.15 ~ 04.16',
        amount: 290000,
      },
      {
        id: 4,
        bookingId: 'SW-...0612',
        customerName: '최민서 고객',
        guests: 3,
        nights: 2,
        checkInDate: '2026.04.18 ~ 04.20',
        amount: 510000,
      },
      {
        id: 5,
        bookingId: 'SW-...0588',
        customerName: '정유나 고객',
        guests: 2,
        nights: 4,
        checkInDate: '2026.04.20 ~ 04.24',
        amount: 880000,
      },
      {
        id: 6,
        bookingId: 'SW-...0523',
        customerName: '한승원 고객',
        guests: 2,
        nights: 1,
        checkInDate: '2026.04.25 ~ 04.26',
        amount: 290000,
      },
      {
        id: 7,
        bookingId: 'SW-...0489',
        customerName: '윤서준 고객',
        guests: 4,
        nights: 2,
        checkInDate: '2026.04.27 ~ 04.29',
        amount: 510000,
      },
      {
        id: 8,
        bookingId: 'SW-...0456',
        customerName: '강하늘 고객',
        guests: 2,
        nights: 1,
        checkInDate: '2026.04.30 ~ 05.01',
        amount: 440000,
      },
    ],
  },
  {
    id: 3,
    settlementId: 'STL-202603-00689',
    status: 'completed',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 2772000,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.03.05',
    completedAt: '2026.03.05 09:30',
    periodStart: '2026.02.01',
    periodEnd: '2026.02.28',
    feeRate: 12.5,
    feeAmount: 396000,
    totalSales: 3168000,
    bookings: [
      {
        id: 1,
        bookingId: 'SW-...0412',
        customerName: '이수진 고객',
        guests: 2,
        nights: 2,
        checkInDate: '2026.02.05 ~ 02.07',
        amount: 540000,
      },
      {
        id: 2,
        bookingId: 'SW-...0398',
        customerName: '조민호 고객',
        guests: 4,
        nights: 3,
        checkInDate: '2026.02.10 ~ 02.13',
        amount: 720000,
      },
      {
        id: 3,
        bookingId: 'SW-...0376',
        customerName: '신예은 고객',
        guests: 2,
        nights: 1,
        checkInDate: '2026.02.14 ~ 02.15',
        amount: 290000,
      },
      {
        id: 4,
        bookingId: 'SW-...0345',
        customerName: '김재현 고객',
        guests: 3,
        nights: 2,
        checkInDate: '2026.02.18 ~ 02.20',
        amount: 510000,
      },
      {
        id: 5,
        bookingId: 'SW-...0312',
        customerName: '박유리 고객',
        guests: 2,
        nights: 2,
        checkInDate: '2026.02.22 ~ 02.24',
        amount: 540000,
      },
      {
        id: 6,
        bookingId: 'SW-...0289',
        customerName: '한지원 고객',
        guests: 2,
        nights: 1,
        checkInDate: '2026.02.26 ~ 02.27',
        amount: 290000,
      },
    ],
  },
  {
    id: 4,
    settlementId: 'STL-202602-00523',
    status: 'completed',
    spaceName: '강릉 바다향 오피스',
    spaceEmoji: '🌊',
    category: '오피스',
    location: '강원 강릉',
    payoutAmount: 1764000,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.02.05',
    completedAt: '2026.02.05 09:30',
    periodStart: '2026.01.01',
    periodEnd: '2026.01.31',
    feeRate: 10,
    feeAmount: 196000,
    totalSales: 1960000,
    bookings: [
      {
        id: 1,
        bookingId: 'SW-...0289',
        customerName: '이재훈 고객',
        guests: 1,
        nights: 0,
        checkInDate: '2026.01.05 (4시간)',
        amount: 28000,
      },
      {
        id: 2,
        bookingId: 'SW-...0276',
        customerName: '강민서 고객',
        guests: 2,
        nights: 0,
        checkInDate: '2026.01.08 (8시간)',
        amount: 56000,
      },
      {
        id: 3,
        bookingId: 'SW-...0265',
        customerName: '서지원 고객',
        guests: 1,
        nights: 0,
        checkInDate: '2026.01.10 (4시간)',
        amount: 28000,
      },
      {
        id: 4,
        bookingId: 'SW-...0254',
        customerName: '윤채영 고객',
        guests: 3,
        nights: 0,
        checkInDate: '2026.01.12 (8시간)',
        amount: 84000,
      },
      {
        id: 5,
        bookingId: 'SW-...0243',
        customerName: '오현우 고객',
        guests: 2,
        nights: 0,
        checkInDate: '2026.01.15 (4시간)',
        amount: 56000,
      },
    ],
  },
  {
    id: 5,
    settlementId: 'STL-202601-00456',
    status: 'completed',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    payoutAmount: 3430000,
    bankName: '국민은행',
    maskedAccount: '1234-****-****',
    scheduledAt: '2026.01.05',
    completedAt: '2026.01.05 09:30',
    periodStart: '2025.12.01',
    periodEnd: '2025.12.31',
    feeRate: 12.5,
    feeAmount: 490000,
    totalSales: 3920000,
    bookings: [
      {
        id: 1,
        bookingId: 'SW-...0234',
        customerName: '김도윤 고객',
        guests: 2,
        nights: 2,
        checkInDate: '2025.12.05 ~ 12.07',
        amount: 540000,
      },
      {
        id: 2,
        bookingId: 'SW-...0218',
        customerName: '박지민 고객',
        guests: 4,
        nights: 3,
        checkInDate: '2025.12.10 ~ 12.13',
        amount: 810000,
      },
      {
        id: 3,
        bookingId: 'SW-...0203',
        customerName: '이서영 고객',
        guests: 2,
        nights: 2,
        checkInDate: '2025.12.15 ~ 12.17',
        amount: 540000,
      },
      {
        id: 4,
        bookingId: 'SW-...0189',
        customerName: '정하늘 고객',
        guests: 3,
        nights: 4,
        checkInDate: '2025.12.20 ~ 12.24',
        amount: 1080000,
      },
      {
        id: 5,
        bookingId: 'SW-...0174',
        customerName: '한지윤 고객',
        guests: 2,
        nights: 3,
        checkInDate: '2025.12.26 ~ 12.29',
        amount: 950000,
      },
    ],
  },
];

export default function SettlementDetail() {
  const nav = useNavigate();
  const { id } = useParams();

  // ID로 정산 찾기 (없으면 첫 번째)
  const settlement =
    SETTLEMENTS.find((s) => String(s.id) === id) || SETTLEMENTS[0];

  return (
    <Page>
      <BackLink onClick={() => nav('/host/settlement/history')}>
        ← 정산 내역으로
      </BackLink>

      <Header>
        <Title>정산 상세</Title>
        <Description>
          이 정산에 포함된 예약과 수수료 내역을 확인하세요
        </Description>
      </Header>

      <SectionWrap>
        <SettlementDetailHeader settlement={settlement} />
      </SectionWrap>

      <Section title="정산 기간">
        <PeriodCard padded>
          <PeriodIcon>📅</PeriodIcon>
          <PeriodText>
            <PeriodMain>
              {settlement.periodStart} ~ {settlement.periodEnd}
            </PeriodMain>
            <PeriodSub>매월 1일~말일 매출이 익월 5일에 정산돼요</PeriodSub>
          </PeriodText>
        </PeriodCard>
      </Section>

      <SettlementBookingsList
        bookings={settlement.bookings}
        totalSales={settlement.totalSales}
        feeRate={settlement.feeRate}
        feeAmount={settlement.feeAmount}
      />

      <Actions>
        <Button
          variant="secondary"
          onClick={() => nav('/host/settlement/history')}
        >
          목록으로
        </Button>
        {settlement.status === 'completed' && (
          <Button
            variant="primary"
            onClick={() => alert(`정산서 다운로드: ${settlement.settlementId}`)}
          >
            📄 정산서 다운로드
          </Button>
        )}
      </Actions>
    </Page>
  );
}

const Page = styled.div`
  width: 100%;
  max-width: 800px;
  padding: var(--space-6) var(--space-5);
  animation: fadeInUp 480ms ease-out both;
`;

const BackLink = styled.button`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);

  &:hover {
    color: var(--gray-800);
  }
`;

const Header = styled.div`
  margin-bottom: var(--space-5);
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
`;

const SectionWrap = styled.div`
  margin-bottom: var(--space-5);
`;

const PeriodCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
`;

const PeriodIcon = styled.div`
  font-size: 1.8rem;
  flex-shrink: 0;
`;

const PeriodText = styled.div`
  flex: 1;
`;

const PeriodMain = styled.div`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`;

const PeriodSub = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-6);

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
