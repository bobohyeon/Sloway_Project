import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';

import { Button } from '../../../pay_shared/components';
import { BookingSummaryCard } from '../../../pay/components/user/BookingSummaryCard';
import { RefundSummaryCard } from '../../components/user/RefundSummaryCard';
import { CancelReasonSelector } from '../../components/user/CancelReasonSelector';
import { RefundMethodCard } from '../../components/user/RefundMethodCard';
import { RefundAgreement } from '../../components/user/RefundAgreement';
import { useRefundCalculation } from '../../hooks/useRefundCalculation';

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
  paidAmount: 326500,
  checkInDate: '2026-05-22',
};

const REFUND_METHOD = {
  name: '카카오페이',
  icon: '💬',
  bg: '#FEE500',
  color: '#191919',
  desc: '결제 시 사용한 카카오페이 계정으로 자동 환불됩니다',
  processingType: '즉시 처리',
  duration: '카드사 정책에 따라 영업일 기준 3 ~ 7일',
};

export default function BookingCancel() {
  const nav = useNavigate();

  const [reason, setReason] = useState(null);
  const [reasonDetail, setReasonDetail] = useState('');
  const [agreed, setAgreed] = useState(false);

  const refund = useRefundCalculation({
    amount: BOOKING.paidAmount,
    checkInDate: BOOKING.checkInDate,
  });

  const canSubmit =
    refund.canRefund &&
    agreed &&
    reason !== null &&
    (reason !== 'etc' || (reasonDetail && reasonDetail.length >= 10));

  const handleSubmit = () => {
    if (!canSubmit) return;
    alert('환불이 완료됐어요. 영업일 3~7일 내 입금됩니다.');
    nav('/user/refund/complete');
  };
  return (
    <PageLayout
      title="예약 취소·환불 신청"
      description="신중하게 결정해주세요"
      backTo="/user/reservation"
      backLabel="예약 내역"
      maxWidth={800}
    >

      <BackLink onClick={() => nav(-1)}>← 예약 상세</BackLink>

      <Section>
        <BookingSummaryCard booking={BOOKING} />
      </Section>

      <Section>
        <RefundSummaryCard
          paidAmount={BOOKING.paidAmount}
          refundAmount={refund.refundAmount}
          rate={refund.rate}
          daysUntilCheckIn={refund.daysUntilCheckIn}
          policyText={refund.policyText}
          canRefund={refund.canRefund}
        />
      </Section>

      <CancelReasonSelector
        selected={reason}
        onChange={setReason}
        detail={reasonDetail}
        onDetailChange={setReasonDetail}
      />

      <RefundMethodCard method={REFUND_METHOD} />

      <RefundAgreement
        agreed={agreed}
        onChange={() => setAgreed(!agreed)}
        refundAmount={refund.refundAmount}
      />

      <Actions>
        <Button variant="secondary" onClick={() => nav(-1)}>
          유지하기
        </Button>
        <Button
          variant={canSubmit ? 'danger' : 'secondary'}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {refund.canRefund ? '취소 신청하기' : '환불 불가'}
        </Button>
      </Actions>
    </PageLayout>
  );
}
;
;
;
;
;

const Section = styled.div`
  margin-bottom: var(--space-5);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);

  & > button:first-child {
    flex: 0 0 auto;
    min-width: 120px;
  }

  & > button:last-child {
    flex: 1;
  }

  @media (max-width: 480px) {
    flex-direction: column;

    & > button {
      width: 100%;
    }
  }
`;
