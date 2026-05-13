import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─── 더미 데이터 (백엔드 연동 후 API로 교체) ───────────────
const DUMMY_APPLICATION = {
  businessName: '청평 힐링 스테이',
  representative: '홍길동',
  businessNumber: '123-45-67890',
  attachment: 'business_license.pdf',
  bank: 'KB국민은행',
  accountNumber: '123-456-789012',
  accountHolder: '홍길동',
  appliedAt: '2026.05.01',
  rejectReason:
    '제출하신 사업자등록증 사본이 불명확합니다. 선명한 사본으로 다시 제출해주세요.',
};

// ─── 상태 정의 ───────────────────────────────────────────
const STATUS = {
  PENDING: {
    label: '검토 중',
    color: '#d4862c',
    bg: 'rgba(212, 134, 44, 0.1)',
    icon: FaClock,
    title: '신청이 검토 중이에요',
    desc: '영업일 기준 1~3일 내 결과를 이메일로 안내드려요.',
  },
  APPROVED: {
    label: '승인 완료',
    color: '#5a7a42',
    bg: 'rgba(90, 122, 66, 0.1)',
    icon: FaCheckCircle,
    title: '호스트로 승인되었어요!',
    desc: '이제 공간을 등록하고 예약을 받을 수 있어요.',
  },
  REJECTED: {
    label: '반려',
    color: '#e24b4a',
    bg: 'rgba(226, 75, 74, 0.1)',
    icon: FaTimesCircle,
    title: '신청이 반려되었어요',
    desc: '아래 반려 사유를 확인하고 다시 신청해주세요.',
  },
};

// ─── Styled ─────────────────────────────────────────────
const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// [시연용 토글] - 백엔드 연동 시 제거
const DemoToggle = styled.div`
  display: flex;
  gap: 6px;
  font-size: 11px;
`;

const DemoBtn = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid ${(p) => (p.$active ? 'var(--sage)' : 'var(--gray-200)')};
  background: ${(p) => (p.$active ? 'rgba(168, 184, 159, 0.15)' : '#fff')};
  color: ${(p) => (p.$active ? '#5b6b53' : 'var(--gray-400)')};
  cursor: pointer;
  font-weight: 500;
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  padding: 28px;
`;

// 상태 카드
const StatusCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 28px;
`;

const StatusIconWrap = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-bottom: 16px;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  margin-bottom: 12px;
`;

const StatusTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
`;

const StatusDesc = styled.p`
  font-size: 13px;
  color: var(--gray-400);
  line-height: 1.7;
`;

const RejectBox = styled.div`
  width: 100%;
  margin-top: 24px;
  padding: 16px 18px;
  background: rgba(226, 75, 74, 0.06);
  border: 1px solid rgba(226, 75, 74, 0.2);
  border-radius: 10px;
  text-align: left;
`;

const RejectTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #e24b4a;
  margin-bottom: 6px;
`;

const RejectText = styled.p`
  font-size: 13px;
  color: var(--gray-800);
  line-height: 1.6;
`;

// 신청 정보 카드
const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #a8b89f;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8efe5;
`;

const InfoRow = styled.div`
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f5f3ef;
  font-size: 13px;
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  width: 130px;
  flex-shrink: 0;
  color: var(--gray-400);
`;

const InfoValue = styled.span`
  flex: 1;
  color: var(--gray-800);
  font-weight: 500;
`;

// 버튼
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const PrimaryBtn = styled.button`
  height: 44px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: var(--sage);
  color: #fff;

  &:hover {
    opacity: 0.9;
  }
`;

const DangerBtn = styled.button`
  height: 44px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid rgba(226, 75, 74, 0.3);
  background: #fff;
  color: #e24b4a;

  &:hover {
    background: rgba(226, 75, 74, 0.05);
  }
`;

const GhostBtn = styled.button`
  height: 44px;
  padding: 0 28px;
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

// ─── 컴포넌트 ──────────────────────────────────────────────
function HostStatusPage() {
  const navigate = useNavigate();

  // [시연용] - 백엔드 연동 시 API 응답값으로 교체
  // GET /api/user/host/application → { status, ... }
  const [status, setStatus] = useState('PENDING');

  const app = DUMMY_APPLICATION;
  const s = STATUS[status];
  const Icon = s.icon;

  return (
    <PageLayout
      title="호스트 신청 현황"
      description="신청하신 호스트 등록의 진행 상태를 확인할 수 있어요."
      actions={
        // [시연용 토글] 백엔드 연동 시 제거
        <DemoToggle>
          {Object.keys(STATUS).map((k) => (
            <DemoBtn
              key={k}
              $active={status === k}
              onClick={() => setStatus(k)}
            >
              {STATUS[k].label}
            </DemoBtn>
          ))}
        </DemoToggle>
      }
    >
      <CardStack>
        {/* 상태 카드 */}
        <StatusCard>
          <StatusIconWrap $bg={s.bg} $color={s.color}>
            <Icon />
          </StatusIconWrap>
          <StatusBadge $bg={s.bg} $color={s.color}>
            {s.label}
          </StatusBadge>
          <StatusTitle>{s.title}</StatusTitle>
          <StatusDesc>{s.desc}</StatusDesc>

          {status === 'REJECTED' && (
            <RejectBox>
              <RejectTitle>반려 사유</RejectTitle>
              <RejectText>{app.rejectReason}</RejectText>
            </RejectBox>
          )}
        </StatusCard>

        {/* 신청 정보 */}
        <Card>
          <SectionTitle>신청 정보</SectionTitle>
          <InfoRow>
            <InfoLabel>상호명</InfoLabel>
            <InfoValue>{app.businessName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>대표자명</InfoLabel>
            <InfoValue>{app.representative}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>사업자등록번호</InfoLabel>
            <InfoValue>{app.businessNumber}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>사업자등록증</InfoLabel>
            <InfoValue>{app.attachment}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>정산 계좌</InfoLabel>
            <InfoValue>
              {app.bank} {app.accountNumber} ({app.accountHolder})
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>신청일</InfoLabel>
            <InfoValue>{app.appliedAt}</InfoValue>
          </InfoRow>
        </Card>

        {/* 상태별 액션 버튼 */}
        <ButtonRow>
          <GhostBtn onClick={() => navigate('/user/mypage')}>
            마이페이지로
          </GhostBtn>
          {status === 'PENDING' && <DangerBtn>신청 취소</DangerBtn>}
          {status === 'APPROVED' && (
            <PrimaryBtn onClick={() => navigate('/host/dashboard')}>
              호스트 대시보드로 이동
            </PrimaryBtn>
          )}
          {status === 'REJECTED' && (
            <PrimaryBtn onClick={() => navigate('/user/host/apply')}>
              다시 신청하기
            </PrimaryBtn>
          )}
        </ButtonRow>
      </CardStack>
    </PageLayout>
  );
}

export default HostStatusPage;
