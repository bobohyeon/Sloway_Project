import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { readyPay, prepareTossPay } from '../../api/payApi';
import { requestTossPayment } from '../../lib/tossSdk';
import { toPayMethod } from '../../constants/payMethod';
import { findCouponsByMemberNo } from '../../../coupon/api/couponApi';
import { findPointBalanceByMemberNo } from '../../../point/api/pointApi';
import { useAuth } from '../../../auth/hooks/useAuth';
import { findOneRsvn } from '../../../rsvn/api/rsvnApi';

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

const LoadErrorBanner = styled.div`
  margin-bottom: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: #fff4ec;
  border: 1px solid #f0c9a8;
  border-radius: var(--radius-md);
  color: #b5651d;
  font-size: 0.88rem;
`;

const CenterText = styled.div`
  text-align: center;
  padding: var(--space-10) var(--space-4);
  color: var(--gray-600);
  font-size: 0.95rem;
`;

const toCouponForUI = (resDto) => {
  const daysLeft = resDto.expiredAt
    ? Math.ceil((new Date(resDto.expiredAt) - new Date()) / 86400000)
    : null;
  // 유효기간이 지나면(daysLeft < 0) 만료 처리 — status가 AVAILABLE이어도 선택 불가
  const expired = daysLeft !== null && daysLeft < 0;
  return {
    no: resDto.no,
    id: resDto.no,
    name: resDto.couponName,
    discount: resDto.dcValue,
    type: resDto.dcType === 'RATE' ? 'percent' : 'amount',
    minAmount: 0,
    expiresIn: Math.max(0, daysLeft ?? 0),
    expired,
    available: resDto.status === 'AVAILABLE' && !expired,
    scope: '전체',
  };
};

export default function BookingPaymentPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const memberNo = user?.memberNo;
  const rsvnNo = location.state?.rsvnNo;

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

  const [rsvn, setRsvn] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [heldPoints, setHeldPoints] = useState(0);
  const [paying, setPaying] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // 결제는 로그인 필수 — 비로그인 진입 시 로그인 페이지로 돌려보냄
    if (!memberNo) {
      nav('/login', { replace: true });
      return;
    }
    // 예약 없이 직접 진입 차단 — 예약(rsvnNo)을 들고 와야 결제 가능
    if (!rsvnNo) {
      nav('/user/reservation', { replace: true });
      return;
    }
    const loadData = async () => {
      // 예약 정보는 필수 — 실패 시 결제 진행 불가
      try {
        const rsvnData = await findOneRsvn(rsvnNo);
        setRsvn(rsvnData);
      } catch (err) {
        console.error('예약 정보 조회 실패', err);
        setLoadError('예약 정보를 불러오지 못했어요. 예약을 다시 확인해주세요.');
        return;
      }
      // 쿠폰·포인트는 선택 — 실패해도 할인 없이 결제 가능
      try {
        const [couponList, balanceResDto] = await Promise.all([
          findCouponsByMemberNo(memberNo),
          findPointBalanceByMemberNo(memberNo),
        ]);
        setCoupons(couponList.map(toCouponForUI));
        setHeldPoints(balanceResDto.balance);
      } catch (err) {
        console.error('쿠폰·포인트 로드 실패', err);
        setLoadError(
          '쿠폰·포인트 정보를 불러오지 못했어요. 할인 없이 결제는 진행할 수 있어요.'
        );
      }
    };
    loadData();
  }, [memberNo, rsvnNo, nav]);

  const nights = rsvn
    ? Math.max(
        1,
        Math.round(
          (new Date(rsvn.checkOut) - new Date(rsvn.checkIn)) / 86400000
        )
      )
    : 0;

  const booking = rsvn && {
    emoji: '🏠',
    type: rsvn.spaceType,
    name: rsvn.spaceName,
    loc: '',
    dates: `${rsvn.checkIn?.slice(0, 10)} ~ ${rsvn.checkOut?.slice(0, 10)}`,
    guests: `${rsvn.count}명`,
    nights,
  };

  const { subtotal, couponDiscount, total, earnPoints, canPay } =
    useCheckoutCalc({
      baseAmt: rsvn?.amt,
      selectedCoupon,
      points,
      agrees,
    });

  const onPayClick = async () => {
    if (!canPay || paying) return;
    // 프론트 'kakao'/'toss' → 백엔드 PayMethod enum(KAKAOPAY 등) 변환
    const method = toPayMethod(paymentMethod);
    if (!method) return;
    setPaying(true);

    const reqDto = {
      rsvnNo,
      ucNo: selectedCoupon?.no ?? null,
      usedPoint: points,
      method,
      baseAmt: subtotal,
      addAmt: 0,
    };

    try {
      if (method === 'TOSSPAY') {
        const { orderId, amount, orderName } = await prepareTossPay(reqDto);
        await requestTossPayment({
          orderId,
          amount,
          orderName,
          customerKey: `MEMBER_${memberNo}`,
        });
      } else {
        const { nextRedirectPcUrl } = await readyPay(reqDto);
        window.location.href = nextRedirectPcUrl;
      }
    } catch (err) {
      console.error('결제 처리 실패', err);
      setPaying(false);
      if (method !== 'TOSSPAY') {
        nav('/user/payment/fail');
      }
    }
  };

  if (!rsvn) {
    return (
      <PageLayout maxWidth={1200}>
        <PaymentSteps current={2} />
        <CenterText>{loadError ?? '예약 정보를 불러오는 중…'}</CenterText>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth={1200}>
      <PaymentSteps current={2} />
      {loadError && <LoadErrorBanner>{loadError}</LoadErrorBanner>}

      <Layout>
        <Main>
          <BookingSummaryCard booking={booking} />

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
            subtotal={subtotal}
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
