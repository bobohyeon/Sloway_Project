import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useMemberDetail } from '../../hooks/useMemberDetail';
import SuspendModal from '../../components/admin/SuspendModal';
import * as S from './MemberDetailPage.styled';

const STATUS_LABEL = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  BANNED: '영구정지',
  WITHDRAWN: '탈퇴',
};

const ROLE_LABEL = {
  USER: '일반회원',
  HOST: '호스트',
};

function MemberDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { member, loading, suspend, unsuspend } = useMemberDetail(id);

  const [suspendOpen, setSuspendOpen] = useState(false);

  if (loading) {
    return (
      <S.PageContainer>
        <PageLayout
          title="회원 상세"
          description="회원 정보를 조회하고 관리하세요"
        >
          <S.Loading>불러오는 중...</S.Loading>
        </PageLayout>
      </S.PageContainer>
    );
  }

  if (!member) {
    return (
      <S.PageContainer>
        <PageLayout
          title="회원 상세"
          description="회원 정보를 조회하고 관리하세요"
        >
          <S.Loading>회원을 찾을 수 없습니다.</S.Loading>
        </PageLayout>
      </S.PageContainer>
    );
  }

  const isActive = member.status === 'ACTIVE';
  const isRestricted =
    member.status === 'SUSPENDED' || member.status === 'BANNED';

  const handleSuspendConfirm = async (option, reason) => {
    try {
      await suspend(option, reason);
      setSuspendOpen(false);
    } catch (err) {
      alert(err.response?.data?.message ?? '정지 처리에 실패했습니다.');
    }
  };

  const handleUnsuspend = async () => {
    try {
      await unsuspend();
    } catch (err) {
      alert(err.response?.data?.message ?? '해제 처리에 실패했습니다.');
    }
  };

  return (
    <S.PageContainer>
      <PageLayout
        title="회원 상세"
        description="회원 정보를 조회하고 관리하세요"
      >
        <S.BackBtn onClick={() => navigate('/admin/members')}>
          <FaArrowLeft size={12} /> 목록으로
        </S.BackBtn>

        {/* 프로필 헤더 */}
        <S.Card>
          <S.ProfileHeader>
            <S.Avatar>
              {member.imgUrl ? (
                <img src={member.imgUrl} alt="프로필" />
              ) : (
                member.name?.[0]
              )}
            </S.Avatar>
            <S.ProfileMeta>
              <S.NameRow>
                <S.UserName>{member.name}</S.UserName>
                <S.RoleBadge
                  $variant={member.role === 'HOST' ? 'host' : 'user'}
                >
                  {ROLE_LABEL[member.role]}
                </S.RoleBadge>
                <S.StatusBadge $status={member.status}>
                  {STATUS_LABEL[member.status]}
                </S.StatusBadge>
              </S.NameRow>
              <S.SubText>{member.email}</S.SubText>
            </S.ProfileMeta>
            <S.ActionGroup>
              {isActive && (
                <S.ActionBtn $danger onClick={() => setSuspendOpen(true)}>
                  계정 정지
                </S.ActionBtn>
              )}
              {isRestricted && (
                <S.ActionBtn $primary onClick={handleUnsuspend}>
                  정지 해제
                </S.ActionBtn>
              )}
            </S.ActionGroup>
          </S.ProfileHeader>
        </S.Card>

        {/* 기본 정보 */}
        <S.Card>
          <S.SectionTitle>기본 정보</S.SectionTitle>
          <S.InfoRow>
            <S.InfoLabel>회원번호</S.InfoLabel>
            <S.InfoValue>{member.memberId}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>이메일</S.InfoLabel>
            <S.InfoValue>
              {member.email}
              {member.emailVerified ? (
                <S.VerifyTag $ok>
                  <FaCheckCircle size={11} /> 인증됨
                </S.VerifyTag>
              ) : (
                <S.VerifyTag>
                  <FaTimesCircle size={11} /> 미인증
                </S.VerifyTag>
              )}
            </S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>휴대폰</S.InfoLabel>
            <S.InfoValue>{member.phone || '-'}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>생년월일</S.InfoLabel>
            <S.InfoValue>{member.birthDate || '-'}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>가입일</S.InfoLabel>
            <S.InfoValue>{member.createdAt}</S.InfoValue>
          </S.InfoRow>
        </S.Card>

        {/* 정지 정보 — 정지 상태일 때만 */}
        {isRestricted && (
          <S.Card>
            <S.SectionTitle>제재 정보</S.SectionTitle>
            <S.InfoRow>
              <S.InfoLabel>정지 사유</S.InfoLabel>
              <S.InfoValue>{member.suspendReason || '-'}</S.InfoValue>
            </S.InfoRow>
            <S.InfoRow>
              <S.InfoLabel>해제 예정일</S.InfoLabel>
              <S.InfoValue>
                {member.suspendUntil || '영구 (관리자 해제 전까지)'}
              </S.InfoValue>
            </S.InfoRow>
          </S.Card>
        )}
      </PageLayout>

      {suspendOpen && (
        <SuspendModal
          target={member}
          onClose={() => setSuspendOpen(false)}
          onConfirm={handleSuspendConfirm}
        />
      )}
    </S.PageContainer>
  );
}

export default MemberDetailPage;
