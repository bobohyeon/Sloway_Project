import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  FaExclamationTriangle,
  FaStore,
  FaCalendarAlt,
  FaCoins,
  FaChartBar,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { withdrawHost } from '../../api/hostApi';
import { useHostMyPage } from '../../hooks/useHostMyPage';
import { findHostRsvns } from '../../../rsvn/api/rsvnApi';
import { findSettleByHostNo } from '../../../settlement/api/settlementApi';
import { logout } from '../../../auth/store/authSlice';

// 사라지는 것들
const LOSS_ITEMS = [
  {
    icon: <FaStore />,
    title: '운영 공간 즉시 비공개',
    desc: '등록된 모든 공간이 검색에서 사라지며, 신규 예약을 받을 수 없어요.',
  },
  {
    icon: <FaCalendarAlt />,
    title: '예약 관리 권한 종료',
    desc: '진행 중인 예약은 정상 종료되지만, 신규 예약 응대는 불가능해요.',
  },
  {
    icon: <FaCoins />,
    title: '정산 권한 종료',
    desc: '향후 발생하는 매출에 대한 정산 권한이 사라져요.',
  },
  {
    icon: <FaChartBar />,
    title: '통계 데이터 삭제',
    desc: '매출·예약·리뷰 통계 데이터를 더 이상 조회할 수 없어요.',
  },
];

// 탈퇴 사유
const REASONS = [
  { id: 'low-revenue', label: '예약·매출이 기대보다 적어요' },
  { id: 'too-complex', label: '운영이 복잡하고 부담스러워요' },
  { id: 'fee-burden', label: '수수료가 부담돼요' },
  { id: 'switching', label: '다른 플랫폼을 이용하려고 해요' },
  { id: 'closing', label: '사업을 정리할 예정이에요' },
  { id: 'other', label: '기타' },
];

// ─── Styled Components ─────────────────────────────────────
const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  padding: 24px 28px;
`;

// 경고 헤더 카드
const WarnCard = styled(Card)`
  border: 1px solid rgba(226, 75, 74, 0.25);
  background: linear-gradient(180deg, #fdf5f4 0%, #fff 100%);
  display: flex;
  gap: 20px;
  align-items: flex-start;
`;

const WarnIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(226, 75, 74, 0.1);
  color: #e24b4a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const WarnTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #a04c42;
  margin-bottom: 8px;
`;

const WarnDesc = styled.p`
  font-size: 13px;
  color: var(--gray-800);
  line-height: 1.7;
`;

// 일반 섹션 타이틀
const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
`;

// 사라지는 것들 리스트
const LossList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const LossItem = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-start;
`;

const LossIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(226, 75, 74, 0.08);
  color: #a04c42;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
`;

const LossTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`;

const LossDesc = styled.p`
  font-size: 12px;
  color: var(--gray-400);
  line-height: 1.6;
`;

// 탈퇴 제한 체크
const CheckList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const CheckRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 10px;
  background: ${(p) =>
    p.$ok ? 'rgba(90, 122, 66, 0.06)' : 'rgba(226, 75, 74, 0.06)'};
  border: 1px solid
    ${(p) => (p.$ok ? 'rgba(90, 122, 66, 0.2)' : 'rgba(226, 75, 74, 0.2)')};
`;

const CheckLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CheckIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${(p) => (p.$ok ? '#5a7a42' : '#e24b4a')};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
`;

const CheckText = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
`;

const CheckValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${(p) => (p.$ok ? '#5a7a42' : '#e24b4a')};
`;

// 탈퇴 사유 라디오
const ReasonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReasonRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--gray-800);
  transition: background 0.15s;

  &:hover {
    background: #faf9f6;
  }

  input {
    width: 15px;
    height: 15px;
    accent-color: var(--sage);
    cursor: pointer;
  }
`;

// 최종 확인
const ConfirmRow = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: 10px;
  background: #faf9f6;
  cursor: pointer;
  font-size: 13px;
  color: var(--gray-800);
  line-height: 1.6;

  input {
    width: 15px;
    height: 15px;
    accent-color: var(--sage);
    margin-top: 2px;
    cursor: pointer;
    flex-shrink: 0;
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: var(--gray-400);
`;

// 버튼
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const GhostBtn = styled.button`
  height: 44px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);

  &:hover {
    border-color: var(--gray-400);
  }
`;

const DangerBtn = styled.button`
  height: 44px;
  padding: 0 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #e24b4a;
  color: #fff;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
function HostWithdrawPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: host } = useHostMyPage(); // hostNo 필요 (정산 조회용)

  const [ongoing, setOngoing] = useState(null); // 진행중 예약 수
  const [unsettled, setUnsettled] = useState(null); // 미정산 금액
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 진행중 예약 조회 — status 'S'(예약확정)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rsvns = await findHostRsvns();
        const count = rsvns.filter((r) => r.status === 'S').length;
        if (alive) setOngoing(count);
      } catch {
        if (alive) setOngoing(0);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // 미정산 금액 조회 — SettleStatus 'WAITING'(정산 대기)의 payoutAmt 합
  useEffect(() => {
    if (!host?.hostNo) return;
    let alive = true;
    (async () => {
      try {
        const settles = await findSettleByHostNo(host.hostNo);
        const amount = settles
          .filter((s) => s.status === 'WAITING')
          .reduce((sum, s) => sum + (s.payoutAmt ?? 0), 0);
        if (alive) setUnsettled(amount);
      } catch {
        if (alive) setUnsettled(0);
      }
    })();
    return () => {
      alive = false;
    };
  }, [host?.hostNo]);

  const canWithdraw = ongoing === 0 && unsettled === 0 && agreed && !submitting;

  const handleWithdraw = async () => {
    if (!canWithdraw) return;
    if (
      !window.confirm(
        '정말 호스트를 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
      )
    ) {
      return;
    }
    setSubmitting(true);
    try {
      await withdrawHost();
      alert('호스트 탈퇴가 완료되었습니다.');
      dispatch(logout());
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message ?? '탈퇴 처리에 실패했습니다.');
      setSubmitting(false);
    }
  };

  return (
    <PageLayout title="호스트 탈퇴">
      <CardStack>
        {/* 경고 헤더 */}
        <WarnCard>
          <WarnIcon>
            <FaExclamationTriangle />
          </WarnIcon>
          <div>
            <WarnTitle>정말 호스트를 그만두시겠어요?</WarnTitle>
            <WarnDesc>
              호스트 탈퇴 시 운영 중인 공간이 즉시 비공개되며, 게스트와의 신뢰
              관계가 끊어져요. 탈퇴 후에는 같은 사업자등록번호로 재가입이 제한될
              수 있어요.
            </WarnDesc>
          </div>
        </WarnCard>

        {/* 사라지는 것들 */}
        <Card>
          <SectionTitle>호스트 탈퇴 시 사라지는 것들</SectionTitle>
          <LossList>
            {LOSS_ITEMS.map((item) => (
              <LossItem key={item.title}>
                <LossIcon>{item.icon}</LossIcon>
                <div>
                  <LossTitle>{item.title}</LossTitle>
                  <LossDesc>{item.desc}</LossDesc>
                </div>
              </LossItem>
            ))}
          </LossList>
        </Card>

        {/* 탈퇴 제한 체크 */}
        <Card>
          <SectionTitle>탈퇴 가능 여부 확인</SectionTitle>
          <CheckList>
            <CheckRow $ok={ongoing === 0}>
              <CheckLeft>
                <CheckIcon $ok={ongoing === 0}>
                  {ongoing === 0 ? <FaCheck /> : <FaTimes />}
                </CheckIcon>
                <CheckText>진행 중인 예약</CheckText>
              </CheckLeft>
              <CheckValue $ok={ongoing === 0}>
                {ongoing === null ? '확인 중...' : `${ongoing}건`}
              </CheckValue>
            </CheckRow>

            <CheckRow $ok={unsettled === 0}>
              <CheckLeft>
                <CheckIcon $ok={unsettled === 0}>
                  {unsettled === 0 ? <FaCheck /> : <FaTimes />}
                </CheckIcon>
                <CheckText>미정산 금액</CheckText>
              </CheckLeft>
              <CheckValue $ok={unsettled === 0}>
                {unsettled === null
                  ? '확인 중...'
                  : `${unsettled.toLocaleString()}원`}
              </CheckValue>
            </CheckRow>
          </CheckList>

          <HelpText style={{ marginTop: 12, display: 'block' }}>
            진행 중인 예약과 미정산 금액이 모두 0이어야 탈퇴가 가능해요.
          </HelpText>
        </Card>

        {/* 탈퇴 사유 */}
        <Card>
          <SectionTitle>탈퇴 사유 (선택)</SectionTitle>
          <ReasonList>
            {REASONS.map((r) => (
              <ReasonRow key={r.id}>
                <input type="radio" name="reason" value={r.id} />
                <span>{r.label}</span>
              </ReasonRow>
            ))}
          </ReasonList>
        </Card>

        {/* 최종 확인 */}
        <Card>
          <SectionTitle>최종 확인</SectionTitle>
          <ConfirmRow>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              위 안내사항을 모두 확인했으며, 호스트 탈퇴에 따른 운영 공간
              비공개·정산 권한 종료에 동의합니다.
            </span>
          </ConfirmRow>
        </Card>

        {/* 버튼 */}
        <ButtonRow>
          <GhostBtn onClick={() => navigate('/host/profile')}>
            돌아가기
          </GhostBtn>
          <DangerBtn disabled={!canWithdraw} onClick={handleWithdraw}>
            {submitting ? '처리 중...' : '호스트 탈퇴'}
          </DangerBtn>
        </ButtonRow>
      </CardStack>
    </PageLayout>
  );
}

export default HostWithdrawPage;
