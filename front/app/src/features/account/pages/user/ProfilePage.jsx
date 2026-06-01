import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaExclamationTriangle } from 'react-icons/fa';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { FcGoogle } from 'react-icons/fc';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import React, { useState, useEffect } from 'react';
import { useMyPage } from '../../hooks/useMyPage';
import { getMySocialAccounts } from '../../api/userApi';
// 소셜 제공사 메타 정보
const PROVIDER_META = {
  KAKAO: {
    name: '카카오',
    icon: <RiKakaoTalkFill size={28} color="#3C1E1E" />,
    bg: '#FEE500',
  },
  GOOGLE: { name: 'Google', icon: <FcGoogle size={24} />, bg: '#fff' },
};

// ─── 유틸 ───────────────────────────────────────────────────
const formatDate = (iso) => (iso ? iso.replace(/-/g, '.') : '-');

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

// 프로필 카드 (아바타 + 이름 + 수정하기 버튼)
const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Avatar = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--sage);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProfileMeta = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const UserName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
`;

const GradeBadge = styled.span`
  display: inline-block;
  padding: 3px 10px;
  background: rgba(168, 184, 159, 0.15);
  color: #5b6b53;
  font-size: 11px;
  font-weight: 500;
  border-radius: 99px;
`;

const SubText = styled.p`
  font-size: 13px;
  color: var(--gray-400);
`;

const EditBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    border-color: var(--sage);
    color: var(--sage);
  }
`;

// 정보 표시용 - label + value 행
const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f3ef;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  width: 110px;
  font-size: 13px;
  color: var(--gray-400);
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: var(--gray-800);
  flex: 1;
`;

// 소셜 연동 행
const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f5f3ef;

  &:last-child {
    border-bottom: none;
  }
`;

const SocialIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => p.$bg};
  border: 1px solid #e8e4dc;
  flex-shrink: 0;
`;

const SocialInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const SocialName = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
`;

const SocialEmail = styled.span`
  font-size: 12px;
  color: var(--gray-400);
`;

const ConnectBtn = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid ${(p) => (p.$connected ? '#e0d8cc' : 'var(--sage)')};
  background: ${(p) => (p.$connected ? '#fff' : 'var(--sage)')};
  color: ${(p) => (p.$connected ? 'var(--gray-400)' : '#fff')};

  &:hover {
    opacity: 0.85;
  }
`;

// 회원 탈퇴
const DangerNotice = styled.p`
  font-size: 13px;
  color: var(--gray-400);
  line-height: 1.6;
  margin-bottom: 14px;
`;

const WithdrawBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #e8d4d2;
  background: #fff;
  color: #a04c42;
  transition: all 0.15s;

  &:hover {
    background: #fdf5f4;
    border-color: #d4a8a3;
  }
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
function ProfilePage() {
  const navigate = useNavigate();
  const { data: user, loading } = useMyPage();

  // 연동 소셜 계정 (실제 SocialAccount 조회)
  const [socialAccounts, setSocialAccounts] = useState([]);

  useEffect(() => {
    getMySocialAccounts()
      .then(setSocialAccounts)
      .catch(() => setSocialAccounts([]));
  }, []);

  if (loading || !user) {
    return (
      <PageLayout
        title="내 정보 관리"
        description="프로필과 연락처를 관리할 수 있어요"
      >
        <div style={{ padding: 40, color: '#888' }}>불러오는 중...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="내 정보 관리"
      description="프로필과 연락처를 관리할 수 있어요"
    >
      <CardStack>
        {/* 프로필 카드 */}
        <Card>
          <ProfileHeader>
            <Avatar>
              {user.imgUrl ? (
                <img src={user.imgUrl} alt="프로필" />
              ) : (
                user.name?.[0]
              )}
            </Avatar>
            <ProfileMeta>
              <NameRow>
                <UserName>{user.name}</UserName>
              </NameRow>
              <SubText>{user.email}</SubText>
            </ProfileMeta>
            <EditBtn onClick={() => navigate('/user/profile/edit')}>
              <FaPencilAlt size={11} /> 수정하기
            </EditBtn>
          </ProfileHeader>
        </Card>

        {/* 기본 정보 */}
        <Card>
          <InfoRow>
            <InfoLabel>이름</InfoLabel>
            <InfoValue>{user.name}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>{user.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>휴대폰</InfoLabel>
            <InfoValue>{user.phone || '-'}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>생년월일</InfoLabel>
            <InfoValue>{user.birthDate || '-'}</InfoValue>
          </InfoRow>
        </Card>

        {/* 연동 계정 — 실제 연동된 소셜만 표시 (해제 버튼 없음) */}
        {socialAccounts.length > 0 && (
          <Card>
            <SectionTitle>연동 계정</SectionTitle>
            {socialAccounts.map((acc) => {
              const meta = PROVIDER_META[acc.provider];
              if (!meta) return null;
              return (
                <SocialRow key={acc.provider}>
                  <SocialIcon $bg={meta.bg}>{meta.icon}</SocialIcon>
                  <SocialInfo>
                    <SocialName>{meta.name}</SocialName>
                    <SocialEmail>연결됨</SocialEmail>
                  </SocialInfo>
                </SocialRow>
              );
            })}
          </Card>
        )}

        {/* 계정 관리 */}
        <Card>
          <SectionTitle>계정 관리</SectionTitle>
          <DangerNotice>
            회원 탈퇴 시 모든 예약·리뷰·포인트 등 개인 정보가 삭제되며 복구할 수
            없어요. 진행 중인 예약이 있는 경우 탈퇴가 제한됩니다.
          </DangerNotice>
          <WithdrawBtn onClick={() => navigate('/user/withdraw')}>
            <FaExclamationTriangle size={11} /> 회원 탈퇴
          </WithdrawBtn>
        </Card>
      </CardStack>
    </PageLayout>
  );
}
export default ProfilePage;
