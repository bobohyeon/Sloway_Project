import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { PaymentSteps } from '../../components/user/PaymentSteps';
import { BookingSummaryCard } from '../../components/user/BookingSummaryCard';
import { CouponSection } from '../../components/user/CouponSection';
import { CouponModal } from '../../components/user/CouponModal';
import { PointSection } from '../../components/user/PointSection';
import { PaymentMethodList } from '../../components/user/PaymentMethodList';
import { TermsAgreement } from '../../components/user/TermsAgreement';
import { PaymentSummary } from '../../components/user/PaymentSummary';
import { useCheckoutForm } from '../../hooks/useCheckoutForm';
import { useCheckoutCalc } from '../../hooks/useCheckoutCalc';
import { readyPay } from '../../api/payApi';
import { toPayMethod } from '../../constants/payMethod';
import { findCouponsByMemberNo } from '../../../coupon/api/couponApi';
import { findPointBalanceByMemberNo } from '../../../point/api/pointApi';

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

const MEMBER_NO = 1;
const RSVN_NO = 2;
const PRICE_PER_NIGHT = 185000;
const NIGHTS = 2;
const SERVICE_FEE = 12000;

const BOOKING = {
  bookingId: 'SW-20260508-000847',
  name: '청평 숲속 파인뷰 스테이',
  type: '워크앤스테이',
  loc: '경기 가평',
  emoji: '🌲',
  dates: '5월 8일 (목) ~ 5월 10일 (토)',
  nights: NIGHTS,
  guests: '성인 2명',
  pricePerNight: PRICE_PER_NIGHT,
};

const toCouponForUI = (resDto) => ({
  no: resDto.no,
  id: resDto.no,
  name: resDto.couponName,
  discount: resDto.dcValue,
  type: resDto.dcType === 'RATE' ? 'percent' : 'amount',
  minAmount: 0,
  expiresIn: Math.max(
    0,
    Math.ceil((new Date(resDto.expiredAt) - new Date()) / 86400000)
  ),
  available: resDto.status === 'AVAILABLE',
  scope: '전체',
});

export default function BookingPaymentPage() {
  const nav = useNavigate();

  const {
    selectedCoupon,
    setSelectedCoupon,
    couponModalOpen,
    setCouponModalOpen,
    points,
    setPoints,
    paymentMethod,
    setPaymentMethod,
    agrees,
    setAgrees,
  } = useCheckoutForm();

  const [coupons, setCoupons] = useState([]);
  const [heldPoints, setHeldPoints] = useState(0);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [couponList, balanceResDto] = await Promise.all([
          findCouponsByMemberNo(MEMBER_NO),
          findPointBalanceByMemberNo(MEMBER_NO),
        ]);
        setCoupons(couponList.map(toCouponForUI));
        setHeldPoints(balanceResDto.balance);
      } catch (err) {
        console.error('결제 페이지 데이터 로드 실패', err);
      }
    };
    loadData();
  }, []);

  const { subtotal, couponDiscount, total, earnPoints, canPay } =
    useCheckoutCalc({
      pricePerNight: PRICE_PER_NIGHT,
      nights: NIGHTS,
      serviceFee: SERVICE_FEE,
      selectedCoupon,
      points,
      agrees,
    });

  const onPayClick = async () => {
    if (!canPay || paying) return;
    // 프론트 'kakao'/'toss'/'naver' → 백엔드 PayMethod enum(KAKAOPAY 등) 변환
    const method = toPayMethod(paymentMethod);
    if (!method) return;
    setPaying(true);
    try {
      const { nextRedirectPcUrl } = await readyPay({
        rsvnNo: RSVN_NO,
        ucNo: selectedCoupon?.no ?? null,
        usedPoint: points,
        method,
        baseAmt: subtotal,
        addAmt: SERVICE_FEE,
      });
      window.location.href = nextRedirectPcUrl;
    } catch (err) {
      console.error('결제 준비 실패', err);
      setPaying(false);
      nav('/user/payment/fail');
    }
  };

  return (
    <PageLayout maxWidth={1200}>
      <PaymentSteps current={2} />

      <Layout>
        <Main>
          <BookingSummaryCard booking={BOOKING} />

          <CouponSection
            coupons={coupons}
            selected={selectedCoupon}
            onRemove={() => setSelectedCoupon(null)}
            onOpenModal={() => setCouponModalOpen(true)}
          />

          <PointSection
            heldPoints={heldPoints}
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
            canPay={canPay && !paying}
            onPay={onPayClick}
          />
        </Sidebar>
      </Layout>

      {couponModalOpen && (
        <CouponModal
          coupons={coupons}
          selectedId={selectedCoupon?.id}
          onSelect={(c) => {
            setSelectedCoupon(c);
            setCouponModalOpen(false);
          }}
          onClose={() => setCouponModalOpen(false)}
        />
      )}
    </PageLayout>
  );
}
