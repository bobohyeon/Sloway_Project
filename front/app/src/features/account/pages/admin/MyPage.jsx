import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaUserShield,
  FaEnvelope,
  FaCalendarAlt,
  FaSignInAlt,
  FaSignOutAlt,
  FaKey,
  FaUserEdit,
  FaUsers,
  FaUserPlus,
  FaBuilding,
  FaUserSlash,
  FaCheckCircle,
  FaUserTimes,
  FaHourglassHalf,
  FaExclamationTriangle,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─────────────────────────────────────────────
// 더미 데이터 — 백엔드 연동 시 GET /api/admin/me 로 교체
// ─────────────────────────────────────────────
const ADMIN_INFO = {
  adminId: 1,
  username: 'super_admin',
  name: '관리자 A',
  email: 'admin.a@sloway.com',
  role: 'SUPER_ADMIN', // SUPER_ADMIN | ADMIN
  createdAt: '2025-01-15',
  lastLoginAt: '2025-05-14 09:22',
  // 이번 달 처리 통계 (감사 추적용)
  monthlyStats: {
    memberSuspended: 8,
    memberBanned: 2,
    hostApproved: 5,
    hostRejected: 3,
    hostRevoked: 1,
    pendingHostApply: 6, // 처리 대기
  },
};

// 빠른 작업 메뉴
const QUICK_ACTIONS = [
  {
    id: 'pending-host',
    icon: <FaHourglassHalf />,
    title: '호스트 신청 검토',
    description: '대기 중인 호스트 신청 확인',
    path: '/admin/host/apply',
    bg: '#D9A441',
    badge: (stats) =>
      stats.pendingHostApply > 0 ? `${stats.pendingHostApply}건 대기` : null,
  },
  {
    id: 'members',
    icon: <FaUsers />,
    title: '회원 관리',
    description: '회원 조회 및 정지·해제',
    path: '/admin/members',
    bg: '#7A8B71',
  },
  {
    id: 'hosts',
    icon: <FaBuilding />,
    title: '호스트 자격 관리',
    description: '운영 호스트 조회 및 자격 처리',
    path: '/admin/host/list',
    bg: '#a8b89f',
  },
];

const ROLE_LABEL = {
  SUPER_ADMIN: '슈퍼 관리자',
  ADMIN: '관리자',
};

function MyPage() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(ADMIN_INFO);

  // 정보 수정 모달
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // 비밀번호 변경 모달
  const [pwOpen, setPwOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const stats = admin.monthlyStats;
  const totalProcessed =
    stats.memberSuspended +
    stats.memberBanned +
    stats.hostApproved +
    stats.hostRejected +
    stats.hostRevoked;

  // ─── 핸들러 ───────────────────────────
  const openEditModal = () => {
    setEditName(admin.name);
    setEditEmail(admin.email);
    setEditOpen(true);
  };

  const handleEditConfirm = () => {
    if (!editName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!editEmail.trim()) {
      alert('이메일을 입력해주세요.');
      return;
    }
    // 간단한 이메일 형식 체크 (정밀 검증은 백엔드)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }
    // TODO: PATCH /api/admin/me { name, email }
    setAdmin((prev) => ({ ...prev, name: editName, email: editEmail }));
    setEditOpen(false);
    alert('정보가 수정되었습니다.');
  };

  const openPwModal = () => {
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setPwOpen(true);
  };

  const handlePwConfirm = () => {
    if (!currentPw) {
      alert('현재 비밀번호를 입력해주세요.');
      return;
    }
    if (newPw.length < 8) {
      alert('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (newPw !== confirmPw) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPw === currentPw) {
      alert('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      return;
    }
    // TODO: PATCH /api/admin/me/password { currentPw, newPw }
    setPwOpen(false);
    alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
    // 운영 환경: 비번 변경 시 모든 토큰 무효화 → 로그인 페이지로
    navigate('/admin/login');
  };

  const handleLogout = () => {
    if (!window.confirm('로그아웃 하시겠습니까?')) return;
    // TODO: POST /api/admin/auth/logout → Refresh Token 삭제
    navigate('/admin/login');
  };

  return (
    <PageContainer>
      <PageLayout title="내 정보" description="관리자 계정 정보 및 활동 현황">
        {/* 프로필 헤더 */}
        <ProfileCard>
          <ProfileLeft>
            <ProfileIcon>
              <FaUserShield />
            </ProfileIcon>
            <ProfileInfo>
              <NameRow>
                <Name>{admin.name}</Name>
                <RoleBadge $variant={admin.role}>
                  {ROLE_LABEL[admin.role]}
                </RoleBadge>
              </NameRow>
              <UserId>@{admin.username}</UserId>
            </ProfileInfo>
          </ProfileLeft>
          <ProfileMeta>
            <MetaItem>
              <MetaLabel>
                <FaEnvelope /> 이메일
              </MetaLabel>
              <MetaValue>{admin.email}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>
                <FaCalendarAlt /> 가입일
              </MetaLabel>
              <MetaValue>{admin.createdAt}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>
                <FaSignInAlt /> 마지막 로그인
              </MetaLabel>
              <MetaValue>{admin.lastLoginAt}</MetaValue>
            </MetaItem>
          </ProfileMeta>
        </ProfileCard>

        {/* 이번 달 활동 통계 */}
        <Section>
          <SectionTitleRow>
            <SectionTitle>이번 달 처리 현황</SectionTitle>
            <SectionSub>총 {totalProcessed}건 처리</SectionSub>
          </SectionTitleRow>

          <StatsGrid>
            <StatCard>
              <StatIcon $bg="#FBE4C2" $color="#9B6A1F">
                <FaUserSlash />
              </StatIcon>
              <StatBody>
                <StatLabel>회원 정지</StatLabel>
                <StatValue>{stats.memberSuspended}건</StatValue>
              </StatBody>
            </StatCard>
            <StatCard>
              <StatIcon $bg="#F7D4D1" $color="#9B3A36">
                <FaUserTimes />
              </StatIcon>
              <StatBody>
                <StatLabel>영구 정지</StatLabel>
                <StatValue>{stats.memberBanned}건</StatValue>
              </StatBody>
            </StatCard>
            <StatCard>
              <StatIcon $bg="#E8F0DF" $color="#5A6B4F">
                <FaCheckCircle />
              </StatIcon>
              <StatBody>
                <StatLabel>호스트 승인</StatLabel>
                <StatValue>{stats.hostApproved}건</StatValue>
              </StatBody>
            </StatCard>
            <StatCard>
              <StatIcon $bg="#F7D4D1" $color="#9B3A36">
                <FaUserPlus />
              </StatIcon>
              <StatBody>
                <StatLabel>호스트 반려</StatLabel>
                <StatValue>{stats.hostRejected}건</StatValue>
              </StatBody>
            </StatCard>
            <StatCard>
              <StatIcon $bg="#F7D4D1" $color="#9B3A36">
                <FaExclamationTriangle />
              </StatIcon>
              <StatBody>
                <StatLabel>자격 취소</StatLabel>
                <StatValue>{stats.hostRevoked}건</StatValue>
              </StatBody>
            </StatCard>
          </StatsGrid>

          <AuditNote>
            모든 처리 이력은 감사 로그에 기록되며 슈퍼관리자가 조회할 수
            있습니다.
          </AuditNote>
        </Section>

        {/* 빠른 작업 */}
        <Section>
          <SectionTitle>빠른 작업</SectionTitle>
          <QuickGrid>
            {QUICK_ACTIONS.map((action) => {
              const badge = action.badge ? action.badge(stats) : null;
              return (
                <QuickCard
                  key={action.id}
                  onClick={() => navigate(action.path)}
                >
                  <QuickIcon $bg={action.bg}>{action.icon}</QuickIcon>
                  <QuickBody>
                    <QuickTitle>
                      {action.title}
                      {badge && <QuickBadge>{badge}</QuickBadge>}
                    </QuickTitle>
                    <QuickDesc>{action.description}</QuickDesc>
                  </QuickBody>
                </QuickCard>
              );
            })}
          </QuickGrid>
        </Section>

        {/* 계정 관리 */}
        <Section>
          <SectionTitle>계정 관리</SectionTitle>
          <AccountList>
            <AccountItem onClick={openEditModal}>
              <AccountIcon>
                <FaUserEdit />
              </AccountIcon>
              <AccountBody>
                <AccountTitle>정보 수정</AccountTitle>
                <AccountDesc>이름·이메일 변경</AccountDesc>
              </AccountBody>
              <AccountArrow>→</AccountArrow>
            </AccountItem>

            <AccountItem onClick={openPwModal}>
              <AccountIcon>
                <FaKey />
              </AccountIcon>
              <AccountBody>
                <AccountTitle>비밀번호 변경</AccountTitle>
                <AccountDesc>주기적인 비밀번호 변경을 권장합니다</AccountDesc>
              </AccountBody>
              <AccountArrow>→</AccountArrow>
            </AccountItem>

            <AccountItem onClick={handleLogout} $danger>
              <AccountIcon $danger>
                <FaSignOutAlt />
              </AccountIcon>
              <AccountBody>
                <AccountTitle $danger>로그아웃</AccountTitle>
                <AccountDesc>현재 기기에서 로그아웃합니다</AccountDesc>
              </AccountBody>
              <AccountArrow>→</AccountArrow>
            </AccountItem>
          </AccountList>

          <AdminNote>
            관리자 계정의 탈퇴·권한 변경은 슈퍼관리자에게 문의하세요.
          </AdminNote>
        </Section>
      </PageLayout>

      {/* 정보 수정 모달 */}
      {editOpen && (
        <ModalOverlay onClick={() => setEditOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>정보 수정</ModalTitle>
            <ModalDesc>이름과 이메일을 수정할 수 있습니다.</ModalDesc>

            <FormGroup>
              <FormLabel>아이디</FormLabel>
              <FormInput value={admin.username} disabled />
              <HelpText>아이디는 변경할 수 없습니다.</HelpText>
            </FormGroup>

            <FormGroup>
              <FormLabel>이름 *</FormLabel>
              <FormInput
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                maxLength={50}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>이메일 *</FormLabel>
              <FormInput
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </FormGroup>

            <ModalActions>
              <ModalBtn onClick={() => setEditOpen(false)}>취소</ModalBtn>
              <ModalBtn $primary onClick={handleEditConfirm}>
                저장
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {/* 비밀번호 변경 모달 */}
      {pwOpen && (
        <ModalOverlay onClick={() => setPwOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>비밀번호 변경</ModalTitle>
            <ModalDesc>
              비밀번호 변경 후 모든 기기에서 자동 로그아웃됩니다.
            </ModalDesc>

            <FormGroup>
              <FormLabel>현재 비밀번호 *</FormLabel>
              <FormInput
                type="password"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                placeholder="현재 비밀번호 입력"
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>새 비밀번호 *</FormLabel>
              <FormInput
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="8자 이상"
              />
              <HelpText>영문·숫자·특수문자 조합 8자 이상 권장</HelpText>
            </FormGroup>

            <FormGroup>
              <FormLabel>새 비밀번호 확인 *</FormLabel>
              <FormInput
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="새 비밀번호 재입력"
              />
              {confirmPw && newPw !== confirmPw && (
                <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
              )}
            </FormGroup>

            <ModalActions>
              <ModalBtn onClick={() => setPwOpen(false)}>취소</ModalBtn>
              <ModalBtn $primary onClick={handlePwConfirm}>
                변경
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

export default MyPage;

// ─────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────
const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  min-height: 95.2%;
`;

// 프로필 헤더
const ProfileCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 26px 28px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  flex-wrap: wrap;
`;

const ProfileLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const ProfileIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7a8b71 0%, #5a6b4f 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Name = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const RoleBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${(p) => (p.$variant === 'SUPER_ADMIN' ? '#FFE9C2' : '#E8F0DF')};
  color: ${(p) => (p.$variant === 'SUPER_ADMIN' ? '#B07A19' : '#5A6B4F')};
`;

const UserId = styled.span`
  font-size: 13px;
  color: #888;
  font-family: monospace;
`;

const ProfileMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13px;

  @media (max-width: 700px) {
    width: 100%;
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MetaLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #888;
  width: 120px;

  svg {
    font-size: 11px;
  }
`;

const MetaValue = styled.span`
  color: #333;
`;

// 섹션
const Section = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  padding: 22px 26px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  margin-bottom: 20px;
`;

const SectionTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  ${SectionTitleRow} & {
    margin-bottom: 0;
  }
`;

const SectionSub = styled.span`
  font-size: 13px;
  color: #888;
  font-weight: 500;
`;

// 통계 카드
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: #faf8f3;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
`;

const StatBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #888;
  white-space: nowrap;
`;

const StatValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

const AuditNote = styled.div`
  font-size: 12px;
  color: #aaa;
  padding-top: 14px;
  border-top: 1px dashed #f0ece2;
  text-align: center;
`;

// 빠른 작업
const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const QuickCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #faf8f3;
  border: 1px solid #f0ece2;
  border-radius: 10px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: #f1ede4;
    border-color: #a8b89f;
    transform: translateY(-1px);
  }
`;

const QuickIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: ${(p) => p.$bg};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`;

const QuickBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const QuickTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const QuickBadge = styled.span`
  display: inline-block;
  padding: 2px 8px;
  background: #c9433d;
  color: white;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
`;

const QuickDesc = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

// 계정 관리
const AccountList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const AccountItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #faf8f3;
  border: 1px solid #f0ece2;
  border-radius: 10px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background: ${(p) => (p.$danger ? '#FDF1F0' : '#f1ede4')};
    border-color: ${(p) => (p.$danger ? '#E8B5B2' : '#a8b89f')};
  }
`;

const AccountIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e8e6e0;
  color: ${(p) => (p.$danger ? '#C9433D' : '#7A8B71')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
`;

const AccountBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const AccountTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$danger ? '#C9433D' : '#333')};
`;

const AccountDesc = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const AccountArrow = styled.span`
  color: #ccc;
  font-size: 16px;
  flex-shrink: 0;
`;

const AdminNote = styled.div`
  margin-top: 16px;
  padding: 10px 14px;
  background: #faf8f3;
  border-radius: 6px;
  font-size: 12px;
  color: #888;
  text-align: center;
`;

// 모달
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 28px 28px 24px;
  width: 100%;
  max-width: 440px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: modalIn 200ms ease-out;

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const ModalDesc = styled.p`
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e8e6e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 200ms ease;

  &:disabled {
    background: #f5f5f5;
    color: #888;
    cursor: not-allowed;
  }

  &:focus:not(:disabled) {
    border-color: #a8b89f;
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
`;

const ErrorText = styled.div`
  font-size: 12px;
  color: #c9433d;
  margin-top: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const ModalBtn = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  ${(p) =>
    p.$primary
      ? `
    background: #7A8B71;
    color: white;
    border: 1px solid #7A8B71;
    &:hover { background: #6B7A63; }
  `
      : `
    background: #fff;
    color: #666;
    border: 1px solid #ddd;
    &:hover { background: #f9faf8; }
  `}
`;
