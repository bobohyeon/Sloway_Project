import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Badge, Button, Card, Section } from '../../../pay_shared/components';
import { PaymentDetailCard } from '../../components/user/PaymentDetailCard';
import { PaymentStatusBadge } from '../../components/user/PaymentStatusBadge';
import { PriceBreakdown } from '../../components/user/PriceBreakdown';
import { findPayByNo } from '../../api/payApi';
import { findRefundAll } from '../../../refund/api/refundApi';

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

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-5);

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div``;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const InfoCard = styled(Card)``;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  background: var(--cream);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const Main = styled.div`
  flex: 1;
`;

const MainName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`;

const SubText = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  padding: 6px 0;

  & + & {
    border-top: 1px dashed var(--gray-200);
  }
`;

const Label = styled.span`
  color: var(--gray-400);
`;

const Value = styled.span`
  color: var(--gray-800);
  font-weight: 500;
`;

const Mono = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-800);
  font-weight: 500;
`;

const Muted = styled.span`
  color: var(--gray-400);
  font-weight: 400;
`;

const RefundCard = styled(Card)`
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
    transform: translateY(-1px);
  }
`;

const RefundHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-2);
  border-bottom: 1px dashed var(--gray-200);
  margin-bottom: var(--space-2);
`;

const RefundIdMono = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`;

const RefundFooter = styled.div`
  margin-top: var(--space-3);
  text-align: right;
  font-size: 0.78rem;
  color: var(--sage);
  font-weight: 500;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-5);
  border-top: 1px solid var(--gray-200);

  @media (max-width: 640px) {
    flex-direction: column-reverse;

    & > button {
      width: 100%;
    }
  }
`;

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

const REFUND_STATUS_LABEL = {
  REQUESTED: { label: '환불 요청 중', variant: 'warning' },
  APPROVED: { label: '환불 처리 중', variant: 'warning' },
  COMPLETED: { label: '환불 완료', variant: 'success' },
};

const formatDate = (iso) => {
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
    paidAt: formatDate(resDto.approvedAt ?? resDto.createdAt),
    method: methodInfo.label,
    methodIcon: methodInfo.icon,
    pg: methodInfo.pg,
    approvalNo: resDto.tid ?? '-',
  };
};

const buildPriceItems = (resDto) => {
  const items = [
    { label: '기본 금액', amount: resDto.baseAmt ?? 0, type: 'normal' },
  ];
  if (resDto.addAmt && resDto.addAmt > 0) {
    items.push({ label: '추가 금액', amount: resDto.addAmt, type: 'normal' });
  }
  if (resDto.dcAmt && resDto.dcAmt > 0) {
    items.push({ label: '쿠폰 할인', amount: resDto.dcAmt, type: 'discount' });
  }
  if (resDto.usedPoint && resDto.usedPoint > 0) {
    items.push({
      label: '포인트 사용',
      amount: resDto.usedPoint,
      type: 'discount',
    });
  }
  return items;
};

export default function AdminPaymentDetail() {
  const navigate = useNavigate();
  const { no } = useParams();

  const [pay, setPay] = useState(null);
  const [linkedRefund, setLinkedRefund] = useState(null);

  useEffect(() => {
    if (!no) return;
    const load = async () => {
      try {
        const [payResDto, refundList] = await Promise.all([
          findPayByNo(no),
          findRefundAll(),
        ]);
        setPay(payResDto);
        const refund = refundList.find((r) => r.payNo === payResDto.no);
        if (refund) setLinkedRefund(refund);
      } catch (err) {
        console.error('관리자 결제 상세 조회 실패', err);
        alert('결제 정보를 불러올 수 없습니다.');
        navigate('/admin/payment');
      }
    };
    load();
  }, [no, navigate]);

  const uiStatus = useMemo(() => STATUS_TO_UI[pay?.status] ?? 'pending', [pay]);

  if (!pay) return null;

  const detailCardPayment = toDetailCardPayment(pay);
  const priceItems = buildPriceItems(pay);
  const refundStatusInfo = linkedRefund
    ? REFUND_STATUS_LABEL[linkedRefund.status]
    : null;
  const refundIdStr = linkedRefund
    ? `RFD-${String(linkedRefund.no).padStart(6, '0')}`
    : null;

  const handleRefundDetailClick = () => {
    if (linkedRefund) navigate(`/admin/refund/${linkedRefund.no}`);
  };

  return (
    <PageLayout
      title="결제 상세"
      description="결제 정보 및 연관 데이터를 확인하세요"
      backTo="/admin/payment"
      backLabel="결제 관리"
      maxWidth={1100}
    >
      <StatusRow>
        <PaymentStatusBadge status={uiStatus} size="md" />
        <PayIdMono>PAY-{String(pay.no).padStart(6, '0')}</PayIdMono>
      </StatusRow>

      <DetailGrid>
        <MainColumn>
          <Card padded>
            <PaymentDetailCard payment={detailCardPayment} />
            <PriceBreakdown items={priceItems} total={pay.finalAmt ?? 0} />
          </Card>
        </MainColumn>

        <SideColumn>
          <Section title="회원 정보">
            <InfoCard padded>
              <InfoHeader>
                <Avatar>👤</Avatar>
                <Main>
                  <MainName>예약 #{pay.rsvnNo}</MainName>
                  <SubText>
                    회원 도메인 미연동 — 추후 회원명/이메일 노출
                  </SubText>
                </Main>
              </InfoHeader>
            </InfoCard>
          </Section>

          <Section title="예약 정보">
            <InfoCard padded>
              <Row>
                <Label>예약 번호</Label>
                <Mono>RSVN-{String(pay.rsvnNo).padStart(6, '0')}</Mono>
              </Row>
              <Row>
                <Label>공간 정보</Label>
                <Value>예약 도메인 미연동</Value>
              </Row>
            </InfoCard>
          </Section>

          <Section title="할인 사용 영역">
            <InfoCard padded>
              <Row>
                <Label>쿠폰 사용</Label>
                <Value>
                  {pay.ucNo ? (
                    <Mono>UC-{String(pay.ucNo).padStart(6, '0')}</Mono>
                  ) : (
                    <Muted>미사용</Muted>
                  )}
                </Value>
              </Row>
              <Row>
                <Label>포인트 사용</Label>
                <Value>
                  {pay.usedPoint && pay.usedPoint > 0 ? (
                    `${pay.usedPoint.toLocaleString()}P`
                  ) : (
                    <Muted>미사용</Muted>
                  )}
                </Value>
              </Row>
            </InfoCard>
          </Section>

          {linkedRefund && (
            <Section title="연관 환불">
              <RefundCard padded onClick={handleRefundDetailClick}>
                <RefundHeader>
                  <Badge
                    variant={refundStatusInfo?.variant ?? 'muted'}
                    size="sm"
                  >
                    {refundStatusInfo?.label ?? linkedRefund.status}
                  </Badge>
                  <RefundIdMono>{refundIdStr}</RefundIdMono>
                </RefundHeader>
                <Row>
                  <Label>환불 신청일</Label>
                  <Value>
                    {formatDate(
                      linkedRefund.requestedAt ?? linkedRefund.createdAt
                    )}
                  </Value>
                </Row>
                <Row>
                  <Label>환불 금액</Label>
                  <Value>
                    {Number(linkedRefund.refundAmt ?? 0).toLocaleString()}원
                  </Value>
                </Row>
                <RefundFooter>환불 상세로 이동 →</RefundFooter>
              </RefundCard>
            </Section>
          )}
        </SideColumn>
      </DetailGrid>

      <Actions>
        <Button variant="secondary" onClick={() => navigate('/admin/payment')}>
          목록으로
        </Button>
        {linkedRefund && (
          <Button variant="primary" onClick={handleRefundDetailClick}>
            환불 상세 보기
          </Button>
        )}
      </Actions>
    </PageLayout>
  );
}
