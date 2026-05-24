import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, Card } from '../../../pay_shared/components';
import { PaymentDetailCard } from '../../components/user/PaymentDetailCard';
import { PaymentStatusBadge } from '../../components/user/PaymentStatusBadge';
import { PriceBreakdown } from '../../components/user/PriceBreakdown';

import { findPayByNo } from '../../api/payApi';

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

const formatPaidAt = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

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

// 0원/null 항목은 표시에서 제외 — 사용자가 사용한 할인만 노출
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

// 포인트 적립 정책: 결제액 1% (이용 완료 후 7일 뒤 확정)
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

  if (!pay) return null;

  const uiStatus = STATUS_TO_UI[pay.status] ?? 'pending';
  // 환불 요청은 결제 완료 상태에서만 허용
  const canRefund = pay.status === 'COMPLETED';
  const detailCardPayment = toDetailCardPayment(pay);
  const priceItems = buildPriceItems(pay);

  const handleRefundClick = () => {
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
