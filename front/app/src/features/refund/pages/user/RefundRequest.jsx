// 환불 요청 페이지 — 도메인: Refund / 역할: USER
// 백엔드 API: ✅ POST /api/payment/refund (시연 종결) + ✅ GET /api/payment/pay/{no}
// 진입 경로: PaymentDetail 의 "환불 요청" 버튼 → /user/refund/request?payNo=N
// 환불율 계산: 백엔드 정책표(7+/4~6/2~3/1/DDAY)가 SSOT — 프론트 useRefundCalculation 은 사용자 안내용 추정값

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button } from '../../../pay_shared/components';
import { CancelReasonSelector } from '../../components/user/CancelReasonSelector';
import { RefundAgreement } from '../../components/user/RefundAgreement';
import { RefundMethodCard } from '../../components/user/RefundMethodCard';
import { RefundSummaryCard } from '../../components/user/RefundSummaryCard';
import { useRefundCalculation } from '../../hooks/useRefundCalculation';

import { findPayByNo } from '../../../pay/api/payApi';
import { createRefund } from '../../api/refundApi';

// 프론트 CancelReasonSelector ID → 백엔드 RefundReason enum 매핑
const REASON_ID_TO_ENUM = {
  schedule: 'SCHEDULE',
  other_space: 'SPACE',
  health: 'HEALTH',
  personal: 'PERSONAL',
  price: 'PRICE',
  etc: 'ETC',
};

// 결제수단 → 환불 안내 카드 정보
const REFUND_METHOD_BY_PAY = {
  KAKAOPAY: {
    name: '카카오페이',
    icon: '💬',
    bg: '#FEE500',
    color: '#191919',
    desc: '결제 시 사용한 카카오페이 계정으로 자동 환불됩니다',
    processingType: '즉시 처리',
    duration: '카드사 정책에 따라 영업일 기준 3 ~ 7일',
  },
  TOSSPAY: {
    name: '토스페이',
    icon: '🅣',
    bg: '#0064FF',
    color: '#FFFFFF',
    desc: '결제 시 사용한 토스페이 계정으로 자동 환불됩니다',
    processingType: '즉시 처리',
    duration: '카드사 정책에 따라 영업일 기준 3 ~ 7일',
  },
  NAVERPAY: {
    name: '네이버페이',
    icon: '🇳',
    bg: '#03C75A',
    color: '#FFFFFF',
    desc: '결제 시 사용한 네이버페이 계정으로 자동 환불됩니다',
    processingType: '즉시 처리',
    duration: '카드사 정책에 따라 영업일 기준 3 ~ 7일',
  },
};

export default function RefundRequest() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const payNo = searchParams.get('payNo');

  const [pay, setPay] = useState(null);
  const [reason, setReason] = useState(null);
  const [reasonDetail, setReasonDetail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 결제 정보 조회
  useEffect(() => {
    if (!payNo) return;
    const load = async () => {
      try {
        const resDto = await findPayByNo(payNo);
        setPay(resDto);
      } catch (err) {
        console.error('결제 정보 조회 실패', err);
        alert('결제 정보를 불러올 수 없습니다.');
        navigate(-1);
      }
    };
    load();
  }, [payNo, navigate]);

  // 체크인 날짜 — Rsvn API 미연동 (김보현 도메인), 시연용 placeholder
  // 추후 findRsvnByNo(pay.rsvnNo) 호출해서 실제 체크인 날짜 가져와야 함
  const checkInDate = useMemo(() => {
    if (!pay) return null;
    const d = new Date();
    d.setDate(d.getDate() + 5); // 임시: 오늘+5일 (5일 전 = 50% 환불 안내)
    return d.toISOString();
  }, [pay]);

  const refund = useRefundCalculation({
    amount: pay?.finalAmt ?? 0,
    checkInDate: checkInDate ?? new Date().toISOString(),
  });

  // 제출 가능 조건
  const canSubmit =
    pay &&
    refund.canRefund &&
    agreed &&
    reason !== null &&
    (reason !== 'etc' || (reasonDetail && reasonDetail.length >= 10)) &&
    !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const reqDto = {
        payNo: pay.no,
        rsvnNo: pay.rsvnNo,
        refundReason: REASON_ID_TO_ENUM[reason],
      };
      const refundResDto = await createRefund(reqDto);
      // 결과 객체 + 결제 정보 + 사용자가 적은 상세사유까지 state 로 전달
      navigate('/user/refund/complete', {
        state: { refund: refundResDto, pay, reasonDetail },
      });
    } catch (err) {
      console.error('환불 요청 실패', err);
      const msg = err?.response?.data?.msg ?? err.message;
      alert(`환불 요청에 실패했습니다.\n${msg}`);
      setSubmitting(false);
    }
  };

  if (!pay) return null; // 결제 로딩 영역

  const refundMethod = REFUND_METHOD_BY_PAY[pay.method] ?? REFUND_METHOD_BY_PAY.KAKAOPAY;

  return (
    <PageLayout
      title="예약 취소·환불 신청"
      description="신중하게 결정해주세요"
      backTo={`/user/payment/${pay.no}`}
      backLabel="결제 상세"
      maxWidth={800}
    >
      <Section>
        <RefundSummaryCard
          paidAmount={pay.finalAmt ?? 0}
          refundAmount={refund.refundAmount}
          rate={refund.rate}
          daysUntilCheckIn={refund.daysUntilCheckIn}
          policyText={refund.policyText}
          canRefund={refund.canRefund}
        />
        <Note>
          ⓘ 표시된 환불 금액은 안내용입니다. 실제 환불 금액은 정책 기준에 따라
          서버에서 정확히 계산됩니다.
        </Note>
      </Section>

      <CancelReasonSelector
        selected={reason}
        onChange={setReason}
        detail={reasonDetail}
        onDetailChange={setReasonDetail}
      />

      <RefundMethodCard method={refundMethod} />

      <RefundAgreement
        agreed={agreed}
        onChange={() => setAgreed(!agreed)}
        refundAmount={refund.refundAmount}
      />

      <Actions>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          유지하기
        </Button>
        <Button
          variant={canSubmit ? 'danger' : 'secondary'}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {submitting
            ? '처리 중...'
            : refund.canRefund
              ? '환불 신청하기'
              : '환불 불가'}
        </Button>
      </Actions>
    </PageLayout>
  );
}

const Section = styled.div`
  margin-bottom: var(--space-5);
`;

const Note = styled.div`
  margin-top: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: var(--gray-600);
  line-height: 1.5;
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
