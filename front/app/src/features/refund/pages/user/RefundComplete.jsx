// 환불 신청 완료 페이지 — 도메인: Refund / 역할: USER
// 진입 경로: RefundRequest → createRefund 성공 → navigate state 로 진입
// 가드 2중 — 직접 URL 진입 또는 새로고침 시 state 휘발 → null 첫 렌더 차단 + 결제 내역으로 redirect

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, Card, Section } from '../../../pay_shared/components';
import { ResultHeader } from '../../../pay/components/user/ResultHeader';
import { RefundInfoCard } from '../../components/user/RefundInfoCard';

// 백엔드 PayMethod → 환불 안내 메소드명·아이콘
const METHOD_INFO = {
  KAKAOPAY: { name: '카카오페이', icon: '💬' },
  TOSSPAY: { name: '토스페이', icon: '🅣' },
  NAVERPAY: { name: '네이버페이', icon: '🇳' },
};

// 백엔드 RefundReason enum → 사용자 노출 label (백엔드 enum.label 과 동기화)
const REASON_LABEL = {
  SCHEDULE: '일정이 변경됐어요',
  SPACE: '다른 공간으로 변경하려고요',
  HEALTH: '건강상의 이유',
  PERSONAL: '개인 사정 / 긴급 상황',
  PRICE: '가격이 부담돼요',
  ETC: '기타',
};

// 백엔드 RefundRate enum → 환불율 숫자
const RATE_VALUE = {
  WEEK: 100,
  FOURTOSIX: 70,
  TWOTOTHREE: 50,
  ONEDAY: 30,
  DDAY: 0,
  FULL: 100, // 호스트 사유 수수료 면제
};

// "2026.05.22 14:32" 형식
const formatRequestedAt = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

// 예상 입금일 — 영업일 5일 가정 (주말 단순화: +7일)
const formatExpectedDepositAt = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  d.setDate(d.getDate() + 7);
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (영업일 기준)`;
};

export default function RefundComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;

  // 가드 2중 패턴: 직접 URL 진입 시 결제 내역으로 redirect
  useEffect(() => {
    if (!state?.refund || !state?.pay) {
      navigate('/user/payment', { replace: true });
    }
  }, [state, navigate]);

  if (!state?.refund || !state?.pay) return null;

  const { refund, pay, reasonDetail } = state;
  const methodInfo = METHOD_INFO[pay.method] ?? { name: pay.method, icon: '💳' };
  const refundAmtNumber = Number(refund.refundAmt ?? 0);

  const refundDisplay = {
    refundId: `RFD-${String(refund.no).padStart(6, '0')}`,
    bookingId: `RSVN-${String(pay.rsvnNo).padStart(6, '0')}`,
    amount: refundAmtNumber,
    rate: RATE_VALUE[refund.refundRate] ?? 0,
    method: methodInfo.name,
    methodIcon: methodInfo.icon,
    requestedAt: formatRequestedAt(refund.requestedAt ?? refund.createdAt),
    expectedDepositAt: formatExpectedDepositAt(refund.requestedAt ?? refund.createdAt),
  };

  const reasonLabel = REASON_LABEL[refund.refundReason] ?? '호스트 사유';
  const showReasonDetail = refund.refundReason === 'ETC' && reasonDetail;

  return (
    <PageLayout maxWidth={800}>
      <ResultHeader
        variant="success"
        title="환불 신청이 접수됐어요"
        description={`영업일 3~7일 내 ${methodInfo.name}로 입금됩니다. 입금 완료되면 알림으로 안내드릴게요.`}
      />

      <Content>
        <SpaceCard>
          <SpaceEmoji>🏠</SpaceEmoji>
          <SpaceInfo>
            <SpaceName>예약 #{pay.rsvnNo}</SpaceName>
            <SpaceMeta>결제번호: PAY-{String(pay.no).padStart(6, '0')}</SpaceMeta>
          </SpaceInfo>
        </SpaceCard>

        <RefundInfoCard refund={refundDisplay} />

        <Section title="환불 사유">
          <ReasonCard padded>
            <ReasonLabel>고객님이 작성하신 사유</ReasonLabel>
            <ReasonText>"{reasonLabel}"</ReasonText>
            {showReasonDetail && <ReasonDetail>{reasonDetail}</ReasonDetail>}
          </ReasonCard>
        </Section>

        <NoticeBox>
          <NoticeIcon>💡</NoticeIcon>
          <NoticeContent>
            <NoticeTitle>환불 처리에 대해 알려드려요</NoticeTitle>
            <NoticeList>
              <li>카드사 정책에 따라 입금까지 영업일 기준 3~7일이 소요돼요</li>
              <li>주말·공휴일은 영업일에 포함되지 않아요</li>
              <li>관리자 승인 후 자동 처리됩니다</li>
              <li>긴급 문의는 고객센터로 연락해주세요</li>
            </NoticeList>
          </NoticeContent>
        </NoticeBox>
      </Content>

      <Actions>
        <Button variant="secondary" onClick={() => navigate('/user/payment')}>
          결제 내역으로
        </Button>
        <Button variant="primary" onClick={() => alert('고객센터: 1588-0000')}>
          💬 고객센터 문의
        </Button>
      </Actions>
    </PageLayout>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-8);
`;

const SpaceCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
`;

const SpaceEmoji = styled.div`
  width: 56px;
  height: 56px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  flex-shrink: 0;
`;

const SpaceInfo = styled.div`
  flex: 1;
`;

const SpaceName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const SpaceMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const ReasonCard = styled(Card)`
  background: var(--cream);
`;

const ReasonLabel = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: 6px;
`;

const ReasonText = styled.div`
  font-size: 0.95rem;
  color: var(--gray-800);
  font-style: italic;
`;

const ReasonDetail = styled.div`
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--white);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--gray-600);
  line-height: 1.5;
`;

const NoticeBox = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
`;

const NoticeIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
`;

const NoticeContent = styled.div`
  flex: 1;
`;

const NoticeTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 6px;
`;

const NoticeList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.7;

  li {
    list-style: disc;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: var(--space-3);
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;
