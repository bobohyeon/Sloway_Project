// 관리자 환불 상세 페이지 — 도메인: Refund / 역할: ADMIN
// 백엔드 API:
//   ✅ GET /api/payment/refund/{no} (단건 조회)
//   ✅ GET /api/payment/pay/{no}    (결제 정보 join — 결제수단/finalAmt/tid)
//   ✅ PATCH /api/payment/refund/{no}/process (환불 승인·완료 처리)
// 진입 경로: AdminRefundList → 카드 클릭 → /admin/refund/:no

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Badge, Button, Card, Section } from '../../../pay_shared/components';
import { AdminMemoBox } from '../../components/admin/AdminMemoBox';
import { RefundProcessHistory } from '../../components/admin/RefundProcessHistory';
import { RefundStatusBanner } from '../../components/admin/RefundStatusBanner';

import { findPayByNo } from '../../../pay/api/payApi';
import { findRefundByNo, processRefund } from '../../api/refundApi';

// 백엔드 RefundReason → 사용자 노출 label
const REASON_LABEL = {
  SCHEDULE: '일정이 변경됐어요',
  SPACE: '다른 공간으로 변경하려고요',
  HEALTH: '건강상의 이유',
  PERSONAL: '개인 사정 / 긴급 상황',
  PRICE: '가격이 부담돼요',
  ETC: '기타',
};

// 백엔드 RefundRate → 환불율 숫자
const RATE_VALUE = {
  WEEK: 100,
  FOURTOSIX: 70,
  TWOTOTHREE: 50,
  ONEDAY: 30,
  DDAY: 0,
  FULL: 100,
};

const METHOD_INFO = {
  KAKAOPAY: { label: '카카오페이', icon: '💬', pg: '카카오페이' },
  TOSSPAY: { label: '토스페이', icon: '🅣', pg: '토스페이' },
  NAVERPAY: { label: '네이버페이', icon: '🇳', pg: '네이버페이' },
};

const formatDate = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

// 백엔드 status → 화면 표시용 분기
const isRequested = (status) => status === 'REQUESTED' || status === 'APPROVED';
const isCompleted = (status) => status === 'COMPLETED';
const isHostRejected = (refund) =>
  refund?.refundReason === null && refund?.refundRate === 'FULL';

// 처리 이력 (RefundProcessHistory 형식)
const buildProcessHistory = (refund) => {
  const requestedAt = formatDate(refund.requestedAt ?? refund.createdAt);
  const events = [
    {
      status: 'done',
      title: '환불 신청 접수',
      description: isHostRejected(refund)
        ? '호스트 거절로 인한 자동 환불 신청'
        : '사용자가 환불 신청을 완료했습니다',
      at: requestedAt,
      actor: isHostRejected(refund) ? '시스템 (호스트 거절)' : '사용자',
    },
    {
      status: 'done',
      title: '환불 정책 적용',
      description: `환불율 ${RATE_VALUE[refund.refundRate] ?? 0}% 자동 계산`,
      at: requestedAt,
      actor: '시스템',
    },
  ];

  if (isCompleted(refund.status)) {
    events.push(
      {
        status: 'done',
        title: '관리자 승인 완료',
        description: '환불 승인 및 후속 처리 수행',
        at: formatDate(refund.modifiedAt),
        actor: '관리자',
      },
      {
        status: 'done',
        title: '환불 완료',
        description: '쿠폰·포인트 복원 및 결제 취소 처리',
        at: formatDate(refund.modifiedAt),
        actor: '시스템',
      }
    );
  } else {
    events.push({
      status: 'pending',
      title: '관리자 승인 대기',
      description: '환불 승인 후 자동으로 후속 처리됩니다',
      at: '-',
      actor: '관리자',
    });
  }

  return events;
};

export default function RefundDetail() {
  const navigate = useNavigate();
  const { no } = useParams();

  const [refund, setRefund] = useState(null);
  const [pay, setPay] = useState(null);
  const [memo, setMemo] = useState('');
  const [processing, setProcessing] = useState(false);

  // 환불 + 결제 정보 함께 로드 (결제수단·tid·finalAmt 영역 필요)
  useEffect(() => {
    if (!no) return;
    const load = async () => {
      try {
        const refundResDto = await findRefundByNo(no);
        setRefund(refundResDto);
        if (refundResDto.payNo) {
          const payResDto = await findPayByNo(refundResDto.payNo);
          setPay(payResDto);
        }
      } catch (err) {
        console.error('환불 상세 조회 실패', err);
        alert('환불 정보를 불러올 수 없습니다.');
        navigate('/admin/refund');
      }
    };
    load();
  }, [no, navigate]);

  const handleApprove = async () => {
    if (!refund || processing) return;
    if (!window.confirm(`환불을 승인 처리할까요?\n쿠폰 반환·포인트 환원·결제 취소가 자동 진행됩니다.`)) {
      return;
    }
    setProcessing(true);
    try {
      const updated = await processRefund(refund.no);
      setRefund(updated);
      alert('환불 승인 완료. 사용자에게 환불 처리됐습니다.');
    } catch (err) {
      console.error('환불 승인 실패', err);
      const msg = err?.response?.data?.msg ?? err.message;
      alert(`환불 승인에 실패했습니다.\n${msg}`);
    } finally {
      setProcessing(false);
    }
  };

  if (!refund) return null;

  const methodInfo = pay
    ? METHOD_INFO[pay.method] ?? { label: pay.method, icon: '💳', pg: '-' }
    : { label: '-', icon: '💳', pg: '-' };
  const refundAmtNumber = Number(refund.refundAmt ?? 0);
  const paidAmtNumber = Number(pay?.finalAmt ?? 0);
  const rateNumber = RATE_VALUE[refund.refundRate] ?? 0;
  const reasonText = isHostRejected(refund)
    ? '호스트가 예약을 거절했어요'
    : (REASON_LABEL[refund.refundReason] ?? '사유 없음');

  const refundIdStr = `RFD-${String(refund.no).padStart(6, '0')}`;
  const paymentIdStr = `PAY-${String(refund.payNo).padStart(6, '0')}`;
  const bookingIdStr = `RSVN-${String(refund.rsvnNo).padStart(6, '0')}`;

  const canApprove = isRequested(refund.status) && !processing;

  return (
    <PageLayout
      title="환불 상세"
      description="환불 처리 내역을 확인하고 승인하세요"
      backTo="/admin/refund"
      backLabel="환불 관리"
      maxWidth={1200}
    >
      {isRequested(refund.status) && (
        <RefundStatusBanner
          variant="warning"
          title="⏳ 관리자 승인 대기 중"
          description="아래 '환불 승인' 버튼을 눌러 환불을 처리하세요. 쿠폰·포인트·결제가 자동으로 후속 처리됩니다."
        />
      )}
      {isCompleted(refund.status) && (
        <RefundStatusBanner
          variant="success"
          title="✓ 환불 완료"
          description={`${refundAmtNumber.toLocaleString()}원이 사용자에게 환불 처리되었습니다.`}
        />
      )}

      <DetailGrid>
        <Section title="환불 정보">
          <InfoCard padded>
            <InfoHeader>
              {isRequested(refund.status) && (
                <Badge variant="warning" size="md">⏳ 승인 대기</Badge>
              )}
              {isCompleted(refund.status) && (
                <Badge variant="success" size="md">✓ 완료</Badge>
              )}
              <RefundId>{refundIdStr}</RefundId>
            </InfoHeader>

            <InfoBlock>
              <Row>
                <Label>신청일시</Label>
                <Value>{formatDate(refund.requestedAt ?? refund.createdAt)}</Value>
              </Row>
              <Row>
                <Label>환불 사유</Label>
                <Value>
                  "{reasonText}"
                  {isHostRejected(refund) && (
                    <Badge variant="warning" size="sm">호스트 거절</Badge>
                  )}
                </Value>
              </Row>
              <Row>
                <Label>예약 번호</Label>
                <Mono>{bookingIdStr}</Mono>
              </Row>
              <Row>
                <Label>결제 번호</Label>
                <Mono>{paymentIdStr}</Mono>
              </Row>
            </InfoBlock>

            <Divider />

            <InfoBlock>
              <SubTitle>환불 정책 적용</SubTitle>
              <Row>
                <Label>환불율</Label>
                <Badge variant="success" size="sm">{rateNumber}% 환불</Badge>
              </Row>
              <Row>
                <Label>결제 금액</Label>
                <Value>{paidAmtNumber.toLocaleString()}원</Value>
              </Row>
              <Row>
                <Label>환불 금액</Label>
                <Highlight>{refundAmtNumber.toLocaleString()}원</Highlight>
              </Row>
            </InfoBlock>
          </InfoCard>
        </Section>

        <SideColumn>
          <Section title="사용자 정보">
            <InfoCard padded>
              <UserHeader>
                <UserAvatar>👤</UserAvatar>
                <UserMain>
                  <UserName>회원 #{refund.rsvnNo}</UserName>
                  <UserEmail>회원 도메인 연동 영역 (미연동)</UserEmail>
                </UserMain>
              </UserHeader>
            </InfoCard>
          </Section>

          <Section title="예약 공간">
            <InfoCard padded>
              <SpaceHeader>
                <SpaceEmoji>🏠</SpaceEmoji>
                <SpaceMain>
                  <SpaceName>예약 #{refund.rsvnNo}</SpaceName>
                  <Badge variant="sage" size="sm">공간 정보 미연동</Badge>
                </SpaceMain>
              </SpaceHeader>
            </InfoCard>
          </Section>

          <Section title="결제 정보">
            <InfoCard padded>
              <Row>
                <Label>결제 수단</Label>
                <Value>
                  <MethodChip>{methodInfo.icon}</MethodChip>
                  {methodInfo.label}
                </Value>
              </Row>
              <Row>
                <Label>PG사</Label>
                <Value>{methodInfo.pg}</Value>
              </Row>
              <Row>
                <Label>승인번호</Label>
                <Mono>{pay?.tid ?? '-'}</Mono>
              </Row>
            </InfoCard>
          </Section>
        </SideColumn>
      </DetailGrid>

      <RefundProcessHistory events={buildProcessHistory(refund)} />

      <AdminMemoBox memo={memo} onChange={setMemo} savedMemos={[]} />

      <Actions>
        <Button variant="secondary" onClick={() => navigate('/admin/refund')}>
          목록으로
        </Button>
        {canApprove && (
          <Button variant="primary" onClick={handleApprove} disabled={processing}>
            {processing ? '처리 중...' : '✓ 환불 승인하기'}
          </Button>
        )}
      </Actions>
    </PageLayout>
  );
}

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: var(--space-4);
  margin-bottom: var(--space-5);

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;

const InfoCard = styled(Card)``;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--gray-200);
`;

const RefundId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-600);
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SubTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`;

const Label = styled.span`
  color: var(--gray-400);
`;

const Value = styled.span`
  color: var(--gray-800);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Mono = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-800);
  font-weight: 500;
`;

const Highlight = styled.span`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--sage);
  letter-spacing: -0.02em;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed var(--gray-200);
  margin: var(--space-3) 0;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  background: var(--cream);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const UserMain = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`;

const UserEmail = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const SpaceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`;

const SpaceEmoji = styled.div`
  width: 40px;
  height: 40px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
`;

const SpaceMain = styled.div`
  flex: 1;
`;

const SpaceName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const MethodChip = styled.span`
  width: 20px;
  height: 20px;
  background: var(--gray-100);
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-5);
  border-top: 1px solid var(--gray-200);
  margin-top: var(--space-5);

  @media (max-width: 640px) {
    flex-direction: column-reverse;

    & > button {
      width: 100%;
    }
  }
`;
