import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  FaExclamationTriangle,
  FaCoins,
  FaHistory,
  FaHeart,
  FaUserShield,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { withdrawUser } from '../../api/userApi';
import { findMyRsvns } from '../../../rsvn/api/rsvnApi';
import { logout } from '../../../auth/store/authSlice';

// 사라지는 것들
const LOSS_ITEMS = [
  {
    icon: <FaCoins />,
    title: '보유 포인트·쿠폰 소멸',
    desc: '적립한 포인트와 미사용 쿠폰이 모두 사라지며 복구할 수 없어요.',
  },
  {
    icon: <FaHistory />,
    title: '예약·결제·리뷰 내역 삭제',
    desc: '작성한 리뷰는 익명 처리되며 예약·결제 내역은 영구 삭제돼요.',
  },
  {
    icon: <FaHeart />,
    title: '찜·최근 본 공간 삭제',
    desc: '즐겨찾기·검색 기록 등 개인 활동 데이터가 함께 삭제돼요.',
  },
  {
    icon: <FaUserShield />,
    title: '동일 이메일 재가입 제한',
    desc: '탈퇴일로부터 30일간 같은 이메일로 다시 가입할 수 없어요.',
  },
];

// 탈퇴 사유
const REASONS = [
  { id: 'rarely-use', label: '자주 사용하지 않아요' },
  { id: 'no-spaces', label: '원하는 공간을 찾기 어려워요' },
  { id: 'price', label: '가격이 부담돼요' },
  { id: 'switching', label: '다른 서비스를 이용하려고 해요' },
  { id: 'privacy', label: '개인정보 보호를 위해서' },
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
`;

const Input = styled.input`
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: var(--gray-800);
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--sage);
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

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
function WithdrawPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ongoing, setOngoing] = useState(null); // 진행중 예약 수 (null=로딩중)
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 진행중 예약 조회 — status 'S'(예약확정)가 있으면 탈퇴 제한
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rsvns = await findMyRsvns();
        const count = rsvns.filter((r) => r.status === 'S').length;
        if (alive) setOngoing(count);
      } catch {
        if (alive) setOngoing(0); // 조회 실패 시 일단 0 (탈퇴 막지 않음)
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const canWithdraw = ongoing === 0 && agreed && !submitting;

  const handleWithdraw = async () => {
    if (!canWithdraw) return;
    if (
      !window.confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')
    ) {
      return;
    }
    setSubmitting(true);
    try {
      await withdrawUser();
      alert('탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
      dispatch(logout()); // 토큰 폐기
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message ?? '탈퇴 처리에 실패했습니다.');
      setSubmitting(false);
    }
  };

  return (
    <PageLayout title="회원 탈퇴">
      <CardStack>
        {/* 경고 헤더 */}
        <WarnCard>
          <WarnIcon>
            <FaExclamationTriangle />
          </WarnIcon>
          <div>
            <WarnTitle>정말 Sloway를 떠나시겠어요?</WarnTitle>
            <WarnDesc>
              탈퇴 후에는 보유 포인트·쿠폰·예약 내역이 모두 삭제되며 복구할 수
              없어요. 동일 이메일로 30일간 재가입이 제한돼요.
            </WarnDesc>
          </div>
        </WarnCard>

        {/* 사라지는 것들 */}
        <Card>
          <SectionTitle>회원 탈퇴 시 사라지는 것들</SectionTitle>
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
          </CheckList>

          <HelpText style={{ marginTop: 12, display: 'block' }}>
            진행 중인 예약이 없어야 탈퇴가 가능해요. 포인트·쿠폰은 탈퇴 시 즉시
            소멸됩니다.
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
              위 안내사항을 모두 확인했으며, 회원 탈퇴에 따른 포인트·쿠폰 소멸
              및 활동 내역 삭제에 동의합니다.
            </span>
          </ConfirmRow>
        </Card>

        {/* 버튼 */}
        <ButtonRow>
          <GhostBtn onClick={() => navigate('/user/profile')}>
            돌아가기
          </GhostBtn>
          <DangerBtn disabled={!canWithdraw} onClick={handleWithdraw}>
            {submitting ? '처리 중...' : '회원 탈퇴'}
          </DangerBtn>
        </ButtonRow>
      </CardStack>
    </PageLayout>
  );
}

export default WithdrawPage;
