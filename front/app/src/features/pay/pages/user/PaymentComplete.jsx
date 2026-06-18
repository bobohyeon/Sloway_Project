import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button } from '../../../pay_shared/components';
import { ResultHeader } from '../../components/user/ResultHeader';
import { ReservationInfoCard } from '../../components/user/ReservationInfoCard';
import { NextStepsList } from '../../components/user/NextStepsList';
import { findPayByNo } from '../../api/payApi';

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

// 체크인~체크아웃 날짜 범위 (YYYY.MM.DD ~ YYYY.MM.DD)
const formatStayRange = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '-';
  const day = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
      2,
      '0'
    )}.${String(d.getDate()).padStart(2, '0')}`;
  };
  return `${day(checkIn)} ~ ${day(checkOut)}`;
};

export default function PaymentComplete() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const payNo = params.get('payNo');
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!payNo) {
      nav('/user/payment');
      return;
    }
    findPayByNo(payNo)
      .then(setResult)
      .catch(() => nav('/user/payment/fail'));
  }, [payNo, nav]);

  if (!result) return null;

  // 결제 응답(PayResDto)의 실데이터로 구성 — 공간명·일정은 예약 join 값 사용.
  // 위치/인원/공간타입은 PayResDto에 없어 생략(ReservationInfoCard가 조건부 렌더).
  const reservation = {
    bookingId: `SW-PAY-${String(result.no).padStart(6, '0')}`,
    name: result.spaceName ?? '예약 공간',
    emoji: '🏠',
    thumbnail: result.thumbnail ?? null,
    dates: formatStayRange(result.checkIn, result.checkOut),
    checkIn: formatPaidAt(result.checkIn),
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
