import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaCheckCircle, FaTimesCircle, FaBan } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { getMyHostApplication } from '../../api/hostApi'; // ← 실제 경로에 맞춰
import * as S from './HostStatusPage.styled';

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
    desc: '아래 반려 사유를 확인해주세요.',
  },
  REVOKED: {
    label: '자격 정지',
    color: '#e24b4a',
    bg: 'rgba(226, 75, 74, 0.1)',
    icon: FaBan,
    title: '호스트 자격이 정지되었어요',
    desc: '아래 사유를 확인해주세요. 문의는 고객센터로 부탁드려요.',
  },
};

const STATE_MAP = { P: 'PENDING', A: 'APPROVED', R: 'REJECTED', V: 'REVOKED' };

function HostStatusPage() {
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyHostApplication()
      .then((data) => {
        setApplication({
          businessName: data.businessName,
          businessNo: data.businessNo,
          status: STATE_MAP[data.approvalState] ?? 'PENDING',
          createdAt: data.createdAt ? data.createdAt.split('T')[0] : '',
          approvedAt: data.approvedAt ? data.approvedAt.split('T')[0] : null,
          rejectReason: data.rejectReason,
        });
      })
      .catch(() => setApplication(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <PageLayout
        title="호스트 신청 현황"
        description="신청 진행 상태를 확인할 수 있어요."
      >
        <S.Loading>불러오는 중...</S.Loading>
      </PageLayout>
    );
  }

  if (!application) {
    return (
      <PageLayout
        title="호스트 신청 현황"
        description="신청 진행 상태를 확인할 수 있어요."
      >
        <S.Loading>신청 정보를 찾을 수 없습니다.</S.Loading>
      </PageLayout>
    );
  }

  const status = application.status;
  const s = STATUS[status];
  const Icon = s.icon;
  const isRejectedOrRevoked = status === 'REJECTED' || status === 'REVOKED';

  return (
    <PageLayout
      title="호스트 신청 현황"
      description="신청하신 호스트 등록의 진행 상태를 확인할 수 있어요."
    >
      <S.CardStack>
        {/* 상태 카드 */}
        <S.StatusCard>
          <S.StatusIconWrap $bg={s.bg} $color={s.color}>
            <Icon />
          </S.StatusIconWrap>
          <S.StatusBadge $bg={s.bg} $color={s.color}>
            {s.label}
          </S.StatusBadge>
          <S.StatusTitle>{s.title}</S.StatusTitle>
          <S.StatusDesc>{s.desc}</S.StatusDesc>

          {isRejectedOrRevoked && application.rejectReason && (
            <S.RejectBox>
              <S.RejectTitle>
                {status === 'REVOKED' ? '정지 사유' : '반려 사유'}
              </S.RejectTitle>
              <S.RejectText>{application.rejectReason}</S.RejectText>
            </S.RejectBox>
          )}
        </S.StatusCard>

        {/* 신청 정보 */}
        <S.Card>
          <S.SectionTitle>신청 정보</S.SectionTitle>
          <S.InfoRow>
            <S.InfoLabel>상호명</S.InfoLabel>
            <S.InfoValue>{application.businessName}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>사업자등록번호</S.InfoLabel>
            <S.InfoValue>{application.businessNo}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>신청일</S.InfoLabel>
            <S.InfoValue>{application.createdAt}</S.InfoValue>
          </S.InfoRow>
          {application.approvedAt && (
            <S.InfoRow>
              <S.InfoLabel>승인일</S.InfoLabel>
              <S.InfoValue>{application.approvedAt}</S.InfoValue>
            </S.InfoRow>
          )}
        </S.Card>

        {/* 상태별 액션 버튼 */}
        <S.ButtonRow>
          <S.GhostBtn onClick={() => navigate('/host/mypage')}>
            마이페이지로
          </S.GhostBtn>
          {status === 'APPROVED' && (
            <S.PrimaryBtn onClick={() => navigate('/host/dashboard')}>
              호스트 대시보드로 이동
            </S.PrimaryBtn>
          )}
        </S.ButtonRow>
      </S.CardStack>
    </PageLayout>
  );
}

export default HostStatusPage;
