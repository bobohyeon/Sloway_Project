import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button } from '../../../pay_shared/components';
import { ResultHeader } from '../../components/user/ResultHeader';
import { ReservationInfoCard } from '../../components/user/ReservationInfoCard';
import { NextStepsList } from '../../components/user/NextStepsList';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-bottom: var(--space-6);

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const BackLink = styled.button`
  display: block;
  margin: 0 auto;
  font-size: 0.85rem;
  color: var(--gray-400);

  &:hover {
    color: var(--gray-800);
  }
`;

const PAY_METHOD_LABEL = {
  KAKAOPAY: '카카오페이',
  TOSSPAY: '토스페이',
  NAVERPAY: '네이버페이',
};

const formatPaidAt = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
};

export default function PaymentComplete() {
  const nav = useNavigate();
  const result = useSelector((state) => state.pay.result);

  useEffect(() => {
    if (!result) nav('/user/payment');
  }, [result, nav]);

  if (!result) return null;

  const reservation = {
    bookingId: `SW-PAY-${String(result.no).padStart(6, '0')}`,
    name: '청평 숲속 파인뷰 스테이',
    type: '워크앤스테이',
    loc: '경기 가평',
    emoji: '🌲',
    dates: '5월 8일 (목) ~ 5월 10일 (토) · 2박',
    guests: '성인 2명',
    checkIn: '오후 3:00 이후',
    amount: result.finalAmt,
    method: PAY_METHOD_LABEL[result.method] ?? result.method,
    approvalNo: result.tid,
    paidAt: formatPaidAt(result.approvedAt ?? result.createdAt),
    earnPoints: Math.floor(result.finalAmt * 0.01),
  };

  return (
    <PageLayout maxWidth={800}>
      <ResultHeader
        variant="success"
        title="결제가 완료됐어요"
        description="결제와 동시에 예약이 자동으로 확정됐어요. 체크인 하루 전 리마인드 알림을 보내드릴게요."
      />

      <Content>
        <ReservationInfoCard reservation={reservation} />
        <NextStepsList />
      </Content>

      <Actions>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => nav('/user/payment')}
        >
          📧 영수증 보기
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => nav('/user/reservation')}
        >
          예약 상세 보기
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => nav('/user/reservation')}
        >
          예약 목록으로
        </Button>
      </Actions>

      <BackLink onClick={() => nav('/')}>← 메인으로 돌아가기</BackLink>
    </PageLayout>
  );
}
