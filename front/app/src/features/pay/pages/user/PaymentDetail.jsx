// 결제 상세 페이지 — 도메인: Pay / 역할: USER
// 백엔드 API: ✅ GET /api/payment/pay/{no} (기존 종결)
// URL: /user/payment/:no — useParams 활용

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, Card } from '../../../pay_shared/components';
import { PaymentDetailCard } from '../../components/user/PaymentDetailCard';
import { PaymentStatusBadge } from '../../components/user/PaymentStatusBadge';
import { PriceBreakdown } from '../../components/user/PriceBreakdown';

import { findPayByNo } from '../../api/payApi';

// 백엔드 PayStatus → PaymentStatusBadge 키 매핑 (PaymentHistory 와 동일)
const STATUS_TO_UI = {
  READY: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELED: 'refunded',
};

const METHOD_INFO = {
  KAKAOPAY: { label: '카카오페이', icon: '💛', pg: '카카오페이' },
  TOSSPAY: { label: '토스페이', icon: '💙', pg: '토스페이' },
  NAVERPAY: { label: '네이버페이', icon: '💚', pg: '네이버페이' },
};

// "2026.05.22 14:30" 형식
const formatPaidAt = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

// PaymentDetailCard 가 기대하는 형식으로 변환
const toDetailCardPayment = (resDto) => {
  const methodInfo = METHOD_INFO[resDto.method] ?? {
    label: resDto.method,
    icon: '💳',
    pg: '-',
  };
  return {
    paidAt: formatPaidAt(resDto.approvedAt ?? resDto.createdAt),
    method: methodInfo.label,
    methodIcon: methodInfo.icon,
    pg: methodInfo.pg,
    approvalNo: resDto.tid ?? '-',
  };
};

// PriceBreakdown items 빌더 — 0원/null 영역은 항목 자체 누락
const buildPriceItems = (resDto) => {
  const items = [{ label: '기본 금액', amount: resDto.baseAmt ?? 0, type: 'normal' }];
  if (resDto.addAmt && resDto.addAmt > 0) {
    items.push({ label: '추가 금액', amount: resDto.addAmt, type: 'normal' });
  }
  if (resDto.dcAmt && resDto.dcAmt > 0) {
    items.push({ label: '쿠폰 할인', amount: resDto.dcAmt, type: 'discount' });
  }
  if (resDto.usedPoint && resDto.usedPoint > 0) {
    items.push({ label: '포인트 사용', amount: resDto.usedPoint, type: 'discount' });
  }
  return items;
};

// 적립 예정 포인트 — 정책: 결제액(finalAmt) 1%
const calcEarnPoints = (finalAmt) =>
  finalAmt ? Math.floor(finalAmt * 0.01) : 0;

export default function PaymentDetail() {
  const { no } = useParams();
  const navigate = useNavigate();

  const [pay, setPay] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const resDto = await findPayByNo(no);
        setPay(resDto);
      } catch (err) {
        console.error('결제 상세 조회 실패', err);
      }
    };
    load();
  }, [no]);

  if (!pay) return null; // 로딩 영역 — Skeleton 컴포넌트 추후 보강 가능

  const uiStatus = STATUS_TO_UI[pay.status] ?? 'pending';
  const canRefund = pay.status === 'COMPLETED'; // 환불 요청은 결제 완료 상태에서만
  const detailCardPayment = toDetailCardPayment(pay);
  const priceItems = buildPriceItems(pay);

  const handleRefundClick = () => {
    // 환불 요청 페이지 진입 — /user/refund/request 등 (별도 페이지 추후 작성)
    navigate(`/user/refund/request?payNo=${pay.no}`);
  };

  const handleReceiptClick = () => {
    alert(
      `영수증 — PAY ${pay.no}\n승인번호: ${pay.tid ?? '-'}\n(현금영수증/세금계산서 통합 단계 진입 예정)`
    );
  };

  return (
    <PageLayout
      title="결제 상세"
      backTo="/user/payment"
      backLabel="결제 내역"
      maxWidth={800}
    >
      <StatusRow>
        <PaymentStatusBadge status={uiStatus} size="md" />
        <PayIdMono>PAY-{String(pay.no).padStart(6, '0')}</PayIdMono>
      </StatusRow>

      <Card padded>
        <PaymentDetailCard payment={detailCardPayment} />
        <PriceBreakdown
          items={priceItems}
          total={pay.finalAmt ?? 0}
          earnPoints={canRefund ? calcEarnPoints(pay.finalAmt) : 0}
        />
      </Card>

      <Actions>
        {canRefund && (
          <Button variant="primary" size="lg" onClick={handleRefundClick}>
            환불 요청하기
          </Button>
        )}
        <Button variant="ghost" size="lg" onClick={handleReceiptClick}>
          영수증 보기
        </Button>
      </Actions>
    </PageLayout>
  );
}

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
`;

const PayIdMono = styled.span`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--gray-400);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-5);

  > button {
    flex: 1;
  }
`;
