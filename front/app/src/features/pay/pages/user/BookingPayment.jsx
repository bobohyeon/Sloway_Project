import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { PaymentSteps } from '../../components/user/PaymentSteps';
import { BookingSummaryCard } from '../../components/user/BookingSummaryCard';
import { CouponSection } from '../../components/user/CouponSection';
import { CouponModal } from '../../components/user/CouponModal';
import { PointSection } from '../../components/user/PointSection';
import { PaymentMethodList } from '../../components/user/PaymentMethodList';
import { TermsAgreement } from '../../components/user/TermsAgreement';
import { PaymentSummary } from '../../components/user/PaymentSummary';

const BOOKING = {
  bookingId: 'SW-20260508-000847',
  name: '청평 숲속 파인뷰 스테이',
  type: '워크앤스테이',
  loc: '경기 가평',
  emoji: '🌲',
  dates: '5월 8일 (목) ~ 5월 10일 (토)',
  nights: 2,
  guests: '성인 2명',
  pricePerNight: 185000,
};

const COUPONS = [
  {
    id: 1,
    name: '봄맞이 워케이션 15% 할인',
    discount: 15,
    type: 'percent',
    minAmount: 100000,
    expiresIn: 7,
    available: true,
    scope: '워크앤스테이',
  },
  {
    id: 2,
    name: '신규 회원 첫 예약 20,000원 할인',
    discount: 20000,
    type: 'amount',
    minAmount: 50000,
    expiresIn: 3,
    available: true,
    scope: '전체',
  },
  {
    id: 3,
    name: '5월 카카오페이 결제 5% 할인',
    discount: 5,
    type: 'percent',
    minAmount: 0,
    expiresIn: 14,
    available: false,
    scope: '카카오페이 결제 시',
  },
];

const HELD_POINTS = 2450;
const SERVICE_FEE = 12000;

export default function BookingPaymentPage() {
  const nav = useNavigate();

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('kakao');
  const [agrees, setAgrees] = useState({
    terms: false,
    privacy: false,
    refund: false,
  });

  const subtotal = BOOKING.pricePerNight * BOOKING.nights;
  const couponDiscount = selectedCoupon
    ? selectedCoupon.type === 'percent'
      ? Math.floor((subtotal * selectedCoupon.discount) / 100)
      : selectedCoupon.discount
    : 0;
  const total = subtotal + SERVICE_FEE - couponDiscount - points;
  const earnPoints = Math.floor(total * 0.01);
  const canPay = Object.values(agrees).every(Boolean);

  const handlePay = () => {
    if (!canPay) return;
    const success = Math.random() > 0.1;
    nav(success ? '/user/payment/complete' : '/user/payment/fail');
  };

  return (
    <Page>
      <PaymentSteps current={2} />

      <Layout>
        <Main>
          <BookingSummaryCard booking={BOOKING} />

          <CouponSection
            coupons={COUPONS}
            selected={selectedCoupon}
            onRemove={() => setSelectedCoupon(null)}
            onOpenModal={() => setCouponModalOpen(true)}
          />

          <PointSection
            heldPoints={HELD_POINTS}
            points={points}
            onChange={setPoints}
          />

          <PaymentMethodList
            selected={paymentMethod}
            onChange={setPaymentMethod}
          />

          <TermsAgreement agrees={agrees} onChange={setAgrees} />
        </Main>

        <Sidebar>
          <PaymentSummary
            pricePerNight={BOOKING.pricePerNight}
            nights={BOOKING.nights}
            serviceFee={SERVICE_FEE}
            couponDiscount={couponDiscount}
            usePoints={points}
            total={total}
            earnPoints={earnPoints}
            canPay={canPay}
            onPay={handlePay}
          />
        </Sidebar>
      </Layout>

      {couponModalOpen && (
        <CouponModal
          coupons={COUPONS}
          selectedId={selectedCoupon?.id}
          onSelect={(c) => {
            setSelectedCoupon(c);
            setCouponModalOpen(false);
          }}
          onClose={() => setCouponModalOpen(false)}
        />
      )}
    </Page>
  );
}

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  animation: fadeInUp 480ms ease-out both;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-8);
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Main = styled.div`
  min-width: 0;
`;

const Sidebar = styled.aside`
  position: sticky;
  top: var(--space-8);

  @media (max-width: 960px) {
    position: static;
  }
`;
