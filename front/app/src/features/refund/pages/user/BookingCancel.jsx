import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaInfoCircle, FaArrowRight } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card } from '../../../pay_shared/components';

export default function BookingCancel() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const payNo = params.get('payNo');

  useEffect(() => {
    const t = setTimeout(() => {
      const target = payNo
        ? `/user/refund/request?payNo=${payNo}`
        : '/user/refund/request';
      nav(target, { replace: true });
    }, 2400);
    return () => clearTimeout(t);
  }, [nav, payNo]);

  const target = payNo
    ? `/user/refund/request?payNo=${payNo}`
    : '/user/refund/request';

  return (
    <PageLayout
      title="예약 취소·환불 신청"
      description="본 페이지는 환불 요청 페이지로 통합됐습니다"
      maxWidth={600}
    >
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          5/22 SSOT 결정에 따라 예약 취소·환불 신청 흐름은
          {' '}<strong>RefundRequest</strong> 페이지로 통합됐습니다.
          잠시 후 자동으로 이동합니다.
        </NoticeText>
      </NoticeCard>

      <RedirectCard padded>
        <RedirectIcon>
          <FaArrowRight />
        </RedirectIcon>
        <RedirectText>
          <RedirectTitle>환불 신청으로 이동 중...</RedirectTitle>
          <RedirectDesc>
            자동 이동이 되지 않으면 아래 버튼을 눌러주세요.
          </RedirectDesc>
        </RedirectText>
        <RedirectBtn onClick={() => nav(target, { replace: true })}>
          환불 신청 페이지로 이동
        </RedirectBtn>
      </RedirectCard>
    </PageLayout>
  );
}

const NoticeCard = styled(Card)`
  display: flex; align-items: flex-start; gap: var(--space-3);
  margin-bottom: var(--space-4);
  background: var(--cream); border-color: var(--sage);
`;
const NoticeIcon = styled.div`font-size: 1.1rem; color: var(--sage); flex-shrink: 0; margin-top: 2px;`;
const NoticeText = styled.p`font-size: 0.88rem; color: var(--gray-800); line-height: 1.6; margin: 0;`;
const RedirectCard = styled(Card)`
  display: flex; flex-direction: column; align-items: center;
  gap: var(--space-4); text-align: center;
  padding: var(--space-8) var(--space-5);
`;
const RedirectIcon = styled.div`
  font-size: 2rem; color: var(--sage);
  animation: bounce 1.2s ease-in-out infinite;
  @keyframes bounce {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(8px); }
  }
`;
const RedirectText = styled.div`display: flex; flex-direction: column; gap: 6px;`;
const RedirectTitle = styled.h3`
  font-family: var(--font-display); font-size: 1.1rem; font-weight: 500;
  color: var(--gray-800); margin: 0;
`;
const RedirectDesc = styled.p`font-size: 0.85rem; color: var(--gray-600); margin: 0; line-height: 1.5;`;
const RedirectBtn = styled.button`
  padding: 10px 20px; background: var(--sage); color: var(--white);
  border: none; border-radius: var(--radius-md);
  font-size: 0.9rem; font-weight: 600; cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  &:hover { opacity: 0.9; }
`;
