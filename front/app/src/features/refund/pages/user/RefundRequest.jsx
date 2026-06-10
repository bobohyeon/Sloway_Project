import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button } from '../../../pay_shared/components';
import { CancelReasonSelector } from '../../components/user/CancelReasonSelector';
import { RefundAgreement } from '../../components/user/RefundAgreement';
import { RefundMethodCard } from '../../components/user/RefundMethodCard';
import { RefundSummaryCard } from '../../components/user/RefundSummaryCard';

import { findPayByNo } from '../../../pay/api/payApi';
import { createRefund } from '../../api/refundApi';

const REASON_ID_TO_ENUM = {
  schedule: 'SCHEDULE',
  other_space: 'SPACE',
  health: 'HEALTH',
  personal: 'PERSONAL',
  price: 'PRICE',
  etc: 'ETC',
};

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

  useEffect(() => {
    // payNo 없이 진입(예: 예약 화면 환불 버튼) 시 백지 대신 결제 내역으로 안내
    if (!payNo) {
      alert('환불할 결제를 먼저 선택해주세요.');
      navigate('/user/payment', { replace: true });
      return;
    }
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

  // 환불 금액은 프론트에서 계산하지 않는다 — 백엔드가 예약 일정 기준 SSOT로 산정.
  const canSubmit =
    pay &&
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

  if (!pay) return null;

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
        <RefundSummaryCard paidAmount={pay.finalAmt ?? 0} />
      </Section>

      <CancelReasonSelector
        selected={reason}
        onChange={setReason}
        detail={reasonDetail}
        onDetailChange={setReasonDetail}
      />

      <RefundMethodCard method={refundMethod} />

      <RefundAgreement agreed={agreed} onChange={() => setAgreed(!agreed)} />

      <Actions>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          유지하기
        </Button>
        <Button
          variant={canSubmit ? 'danger' : 'secondary'}
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {submitting ? '처리 중...' : '환불 신청하기'}
        </Button>
      </Actions>
    </PageLayout>
  );
}

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
