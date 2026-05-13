import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  FaPencilAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFileAlt,
} from 'react-icons/fa';
import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─── 더미 데이터 (백엔드 연동 후 GET API로 교체) ────────────
const DUMMY_HOST = {
  // 사업자 정보
  businessName: '청평 힐링 스테이',
  representative: '김우영',
  businessNumber: '123-45-67890',
  attachment: 'business_license.pdf',
  approvedDate: '2024-03-20',

  // 담당자 연락처
  contactName: '김우영',
  email: 'wykim@sloway.co.kr',
  phone: '010-1234-5678',
  joinDate: '2024-03-15',

  // 호스트 소개
  introduction:
    '청평에서 자연과 함께하는 휴식 공간을 운영하고 있습니다. 도시의 소음에서 벗어나 진짜 쉼을 찾는 분들을 위한 공간이에요.',

  // 정산 계좌
  bank: 'KB국민은행',
  accountNumber: '123-456-789012',
  accountHolder: '김우영',

  // 운영 정보
  totalSpaces: 3,
  averageRating: 4.9,

  imgUrl: null,
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

// 프로필 카드
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

const BusinessName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
`;

const ApprovedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: rgba(90, 122, 66, 0.12);
  color: #5a7a42;
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

// 섹션 - 정보 행
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
  width: 130px;
  font-size: 13px;
  color: var(--gray-400);
  flex-shrink: 0;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: var(--gray-800);
  flex: 1;
`;

const AttachmentLink = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--sage);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    opacity: 0.8;
  }
`;

// 호스트 소개
const IntroText = styled.p`
  font-size: 14px;
  color: var(--gray-800);
  line-height: 1.7;
  white-space: pre-wrap;
`;

// 호스트 탈퇴
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
function HostProfilePage() {
  const navigate = useNavigate();
  const host = DUMMY_HOST;

  return (
    <PageLayout
      title="호스트 정보"
      description="사업자 정보와 정산 계좌를 관리할 수 있어요"
    >
      <CardStack>
        {/* 프로필 카드 */}
        <Card>
          <ProfileHeader>
            <Avatar>
              {host.imgUrl ? (
                <img src={host.imgUrl} alt="프로필" />
              ) : (
                host.businessName[0]
              )}
            </Avatar>
            <ProfileMeta>
              <NameRow>
                <BusinessName>{host.businessName}</BusinessName>
                <ApprovedBadge>
                  <FaCheckCircle size={10} /> 승인 호스트
                </ApprovedBadge>
              </NameRow>
              <SubText>
                대표 {host.representative} · 사업자등록 {host.businessNumber}
              </SubText>
              <SubText>
                {formatDate(host.approvedDate)} 승인 · 운영 공간{' '}
                {host.totalSpaces}개 · 평균 평점 {host.averageRating}
              </SubText>
            </ProfileMeta>
            <EditBtn onClick={() => navigate('/host/profile/edit')}>
              <FaPencilAlt size={11} /> 수정하기
            </EditBtn>
          </ProfileHeader>
        </Card>

        {/* 사업자 정보 */}
        <Card>
          <SectionTitle>사업자 정보</SectionTitle>
          <InfoRow>
            <InfoLabel>상호명</InfoLabel>
            <InfoValue>{host.businessName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>대표자명</InfoLabel>
            <InfoValue>{host.representative}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>사업자등록번호</InfoLabel>
            <InfoValue>{host.businessNumber}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>사업자등록증</InfoLabel>
            <InfoValue>
              <AttachmentLink>
                <FaFileAlt size={12} /> {host.attachment}
              </AttachmentLink>
            </InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>승인일</InfoLabel>
            <InfoValue>{formatDate(host.approvedDate)}</InfoValue>
          </InfoRow>
        </Card>

        {/* 호스트 소개 */}
        <Card>
          <SectionTitle>호스트 소개</SectionTitle>
          <IntroText>{host.introduction}</IntroText>
        </Card>

        {/* 담당자 연락처 */}
        <Card>
          <SectionTitle>담당자 연락처</SectionTitle>
          <InfoRow>
            <InfoLabel>담당자명</InfoLabel>
            <InfoValue>{host.contactName}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>{host.email}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>휴대폰</InfoLabel>
            <InfoValue>{host.phone}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>가입일</InfoLabel>
            <InfoValue>{formatDate(host.joinDate)}</InfoValue>
          </InfoRow>
        </Card>

        {/* 정산 계좌 */}
        <Card>
          <SectionTitle>정산 계좌</SectionTitle>
          <InfoRow>
            <InfoLabel>은행</InfoLabel>
            <InfoValue>{host.bank}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>계좌번호</InfoLabel>
            <InfoValue>{host.accountNumber}</InfoValue>
          </InfoRow>
          <InfoRow>
            <InfoLabel>예금주</InfoLabel>
            <InfoValue>{host.accountHolder}</InfoValue>
          </InfoRow>
        </Card>

        {/* 계정 관리 */}
        <Card>
          <SectionTitle>계정 관리</SectionTitle>
          <DangerNotice>
            호스트 탈퇴 시 운영 중인 공간이 즉시 비공개되며, 진행 중인 예약이
            있는 경우 탈퇴가 제한돼요. 미정산 금액이 남아있는 경우 정산 완료 후
            탈퇴할 수 있어요.
          </DangerNotice>
          <WithdrawBtn onClick={() => navigate('/host/withdraw')}>
            <FaExclamationTriangle size={11} /> 호스트 탈퇴
          </WithdrawBtn>
        </Card>
      </CardStack>
    </PageLayout>
  );
}

export default HostProfilePage;
