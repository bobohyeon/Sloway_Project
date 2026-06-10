import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaFilePdf } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useHostApplyDetail } from '../../hooks/useHostApplyDetail';
import * as S from './HostApplyDetailPage.styled';

const STATE_LABEL = {
  PENDING: '승인 대기',
  APPROVED: '승인',
  REJECTED: '반려',
  REVOKED: '취소',
};

const maskPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
};

function HostApplyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { application, loading, approve, reject, reReview } =
    useHostApplyDetail(id);

  const [docChecked, setDocChecked] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (loading) {
    return (
      <S.PageContainer>
        <PageLayout
          title="호스트 신청 검토"
          description="제출 서류를 검토하고 승인 또는 반려를 결정하세요"
        >
          <S.Loading>불러오는 중...</S.Loading>
        </PageLayout>
      </S.PageContainer>
    );
  }

  if (!application) {
    return (
      <S.PageContainer>
        <PageLayout
          title="호스트 신청 검토"
          description="제출 서류를 검토하고 승인 또는 반려를 결정하세요"
        >
          <S.Loading>신청 정보를 찾을 수 없습니다.</S.Loading>
        </PageLayout>
      </S.PageContainer>
    );
  }

  const isPending = application.state === 'PENDING';
  const isApproved = application.state === 'APPROVED';
  const isRejected = application.state === 'REJECTED';
  const isReapplied = isPending && !!application.lastRejectReason;

  const handleApprove = async () => {
    if (!docChecked) {
      alert('사업자등록증을 확인했음을 체크해야 승인할 수 있습니다.');
      return;
    }
    if (
      !window.confirm(
        `${application.name} 님의 호스트 신청을 승인하시겠습니까?`
      )
    )
      return;
    try {
      await approve();
    } catch (err) {
      alert(err.response?.data?.message ?? '승인 처리에 실패했습니다.');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    try {
      await reject(rejectReason);
      setRejectOpen(false);
    } catch (err) {
      alert(err.response?.data?.message ?? '반려 처리에 실패했습니다.');
    }
  };

  const handleReReview = async () => {
    if (
      !window.confirm(
        '이 신청을 재검토하시겠습니까?\n반려 사유가 초기화되고 다시 "승인 대기" 상태로 돌아갑니다.'
      )
    )
      return;
    try {
      await reReview();
      alert('재검토로 전환되었습니다. 다시 검토할 수 있습니다.');
    } catch (err) {
      alert(err.response?.data?.message ?? '재검토 전환에 실패했습니다.');
    }
  };

  // 사업자등록증 새 탭에서 열기
  const openDoc = () => {
    if (!application.businessDocUrl) {
      alert('등록된 서류가 없습니다.');
      return;
    }
    window.open(application.businessDocUrl, '_blank');
  };

  return (
    <S.PageContainer>
      <PageLayout
        title="호스트 신청 검토"
        description="제출 서류를 검토하고 승인 또는 반려를 결정하세요"
      >
        <S.BackBtn onClick={() => navigate('/admin/host/apply')}>
          <FaArrowLeft size={12} /> 목록으로
        </S.BackBtn>

        {/* 헤더 */}
        {isReapplied && (
          <S.Card>
            <S.ProcessedNotice $variant="rejected">
              <strong>재신청 건</strong>
              이전에 아래 사유로 반려되었던 신청입니다. 보완 여부를 확인하고
              재검토해주세요.
              <br />
              이전 반려 사유: {application.lastRejectReason}
            </S.ProcessedNotice>
          </S.Card>
        )}
        <S.Card>
          <S.HeaderRow>
            <S.TitleGroup>
              <S.PageTitle>{application.businessName}</S.PageTitle>
              <S.StateBadge $state={application.state}>
                {STATE_LABEL[application.state]}
              </S.StateBadge>
            </S.TitleGroup>
          </S.HeaderRow>
        </S.Card>
        {/* 재신청 건 안내 — 대기 상태인데 직전 반려 이력이 있으면 */}

        {/* 처리 결과 안내 (승인/반려된 경우) */}
        {isApproved && (
          <S.Card>
            <S.ProcessedNotice $variant="approved">
              <strong>승인 완료</strong>
              {application.approvedAt} 에 승인되었습니다.
            </S.ProcessedNotice>
          </S.Card>
        )}
        {isRejected && (
          <S.Card>
            <S.ProcessedNotice $variant="rejected">
              <strong>반려됨</strong>
              사유: {application.rejectReason || '-'}
            </S.ProcessedNotice>
            <S.ActionBar>
              <S.ActionBtn $approve onClick={handleReReview}>
                재검토 (다시 검토하기)
              </S.ActionBtn>
            </S.ActionBar>
          </S.Card>
        )}
        {/* 신청자 정보 */}
        <S.Card>
          <S.SectionTitle>신청자 정보</S.SectionTitle>
          <S.InfoRow>
            <S.InfoLabel>이름</S.InfoLabel>
            <S.InfoValue>{application.name}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>이메일</S.InfoLabel>
            <S.InfoValue>{application.email}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>휴대폰</S.InfoLabel>
            <S.InfoValue>{maskPhone(application.phone)}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>생년월일</S.InfoLabel>
            <S.InfoValue>{application.birthDate || '-'}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>신청일</S.InfoLabel>
            <S.InfoValue>{application.createdAt}</S.InfoValue>
          </S.InfoRow>
        </S.Card>

        {/* 사업자 정보 */}
        <S.Card>
          <S.SectionTitle>사업자 정보</S.SectionTitle>
          <S.InfoRow>
            <S.InfoLabel>상호명</S.InfoLabel>
            <S.InfoValue>{application.businessName}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>사업자등록번호</S.InfoLabel>
            <S.InfoValue>{application.businessNo}</S.InfoValue>
          </S.InfoRow>
          <S.InfoRow>
            <S.InfoLabel>사업자등록증</S.InfoLabel>
            <S.InfoValue>
              {application.businessDocUrl ? (
                <S.DocBtn onClick={openDoc}>
                  <FaFilePdf /> 서류 보기
                </S.DocBtn>
              ) : (
                <S.NoDoc>등록된 서류 없음</S.NoDoc>
              )}
            </S.InfoValue>
          </S.InfoRow>
        </S.Card>

        {/* 검토 + 승인/반려 (대기 상태일 때만) */}
        {isPending && (
          <S.Card>
            <S.SectionTitle>검토</S.SectionTitle>
            <S.CheckItem $checked={docChecked}>
              <S.CheckBox
                type="checkbox"
                checked={docChecked}
                onChange={(e) => setDocChecked(e.target.checked)}
              />
              <S.CheckText>
                <S.CheckLabel>사업자등록증 확인</S.CheckLabel>
                <S.CheckDesc>
                  서류를 열어 사업자번호 일치·업태/종목을 확인했습니다
                </S.CheckDesc>
              </S.CheckText>
            </S.CheckItem>

            <S.ActionBar>
              <S.ActionBtn onClick={() => setRejectOpen(true)}>
                반려
              </S.ActionBtn>
              <S.ActionBtn
                $approve
                disabled={!docChecked}
                onClick={handleApprove}
              >
                승인
              </S.ActionBtn>
            </S.ActionBar>
          </S.Card>
        )}
      </PageLayout>

      {/* 반려 모달 */}
      {rejectOpen && (
        <S.ModalOverlay onClick={() => setRejectOpen(false)}>
          <S.ModalCard onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>신청 반려</S.ModalTitle>
            <S.ModalDesc>
              <strong>{application.name}</strong> 님의 호스트 신청을 반려합니다.
              사유는 신청자에게 전달됩니다.
            </S.ModalDesc>
            <S.FormTextarea
              rows="4"
              placeholder="반려 사유를 입력하세요 (예: 사업자등록증 식별 불가 — 원본 재제출 요청)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              maxLength={300}
            />
            <S.HelpText>{rejectReason.length} / 300</S.HelpText>
            <S.ModalActions>
              <S.ModalBtn onClick={() => setRejectOpen(false)}>취소</S.ModalBtn>
              <S.ModalBtn $danger onClick={handleReject}>
                반려 처리
              </S.ModalBtn>
            </S.ModalActions>
          </S.ModalCard>
        </S.ModalOverlay>
      )}
    </S.PageContainer>
  );
}

export default HostApplyDetailPage;
