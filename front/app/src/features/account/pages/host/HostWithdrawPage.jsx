import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
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

// ─── 더미 데이터 (백엔드 연동 시 API로 교체) ───────────────
const DUMMY_STATUS = {
  ongoingReservations: 0, // 진행 중인 예약 건수 (0이어야 탈퇴 가능)
  unsettledAmount: 0, // 미정산 금액 (0이어야 탈퇴 가능)
  activeSpaces: 3, // 운영 중인 공간 수 (참고용)
};

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
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
function HostWithdrawPage() {
  const navigate = useNavigate();
  const status = DUMMY_STATUS;
  const canWithdraw =
    status.ongoingReservations === 0 && status.unsettledAmount === 0;

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
            <CheckRow $ok={status.ongoingReservations === 0}>
              <CheckLeft>
                <CheckIcon $ok={status.ongoingReservations === 0}>
                  {status.ongoingReservations === 0 ? <FaCheck /> : <FaTimes />}
                </CheckIcon>
                <CheckText>진행 중인 예약</CheckText>
              </CheckLeft>
              <CheckValue $ok={status.ongoingReservations === 0}>
                {status.ongoingReservations}건
              </CheckValue>
            </CheckRow>

            <CheckRow $ok={status.unsettledAmount === 0}>
              <CheckLeft>
                <CheckIcon $ok={status.unsettledAmount === 0}>
                  {status.unsettledAmount === 0 ? <FaCheck /> : <FaTimes />}
                </CheckIcon>
                <CheckText>미정산 금액</CheckText>
              </CheckLeft>
              <CheckValue $ok={status.unsettledAmount === 0}>
                {status.unsettledAmount.toLocaleString()}원
              </CheckValue>
            </CheckRow>

            <CheckRow $ok={true}>
              <CheckLeft>
                <CheckIcon $ok={true}>
                  <FaCheck />
                </CheckIcon>
                <CheckText>운영 중인 공간 (참고)</CheckText>
              </CheckLeft>
              <CheckValue $ok={true}>{status.activeSpaces}개</CheckValue>
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

          <FormGroup>
            <Label htmlFor="password">비밀번호 확인</Label>
            <Input
              id="password"
              type="password"
              placeholder="본인 확인을 위해 현재 비밀번호를 입력해주세요"
              autoComplete="current-password"
            />
          </FormGroup>

          <ConfirmRow>
            <input type="checkbox" />
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
          <DangerBtn disabled={!canWithdraw}>호스트 탈퇴 신청</DangerBtn>
        </ButtonRow>
      </CardStack>
    </PageLayout>
  );
}

export default HostWithdrawPage;
