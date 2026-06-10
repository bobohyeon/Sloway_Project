import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { getMyHostApplication, reapplyHost } from '../../api/hostApi';
import * as S from './HostReapplyPage.styled';

function HostReapplyPage() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState('');
  const [businessNo, setBusinessNo] = useState('');
  const [businessDoc, setBusinessDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 기존 신청 정보 로드 → 폼 미리 채움. 반려(R) 아니면 진입 차단.
  useEffect(() => {
    getMyHostApplication()
      .then((data) => {
        if (data.approvalState !== 'R') {
          alert('반려된 신청만 재신청할 수 있습니다.');
          navigate('/host/status');
          return;
        }
        setBusinessName(data.businessName ?? '');
        setBusinessNo(data.businessNo ?? '');
        setRejectReason(data.rejectReason ?? '');
      })
      .catch(() => {
        alert('신청 정보를 불러오지 못했습니다.');
        navigate('/host/status');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSubmit = async () => {
    if (!businessName.trim()) return alert('상호명을 입력해주세요.');
    if (!businessNo.trim()) return alert('사업자등록번호를 입력해주세요.');
    if (!businessDoc) return alert('사업자등록증 파일을 첨부해주세요.');

    setSubmitting(true);
    try {
      await reapplyHost(
        { businessName: businessName.trim(), businessNo: businessNo.trim() },
        businessDoc
      );
      alert('재신청이 접수되었습니다. 다시 검토 후 안내드려요.');
      navigate('/host/application');
    } catch (err) {
      alert(err.response?.data?.message ?? '재신청에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageLayout
        title="호스트 재신청"
        description="반려된 신청을 보완해 다시 제출합니다."
      >
        <S.Loading>불러오는 중...</S.Loading>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="호스트 재신청"
      description="반려 사유를 확인하고 정보를 보완해 다시 제출하세요."
    >
      <S.CardStack>
        {rejectReason && (
          <S.RejectBox>
            <S.RejectTitle>이전 반려 사유</S.RejectTitle>
            <S.RejectText>{rejectReason}</S.RejectText>
          </S.RejectBox>
        )}

        <S.Card>
          <S.SectionTitle>사업자 정보 보완</S.SectionTitle>

          <S.Field>
            <S.Label>상호명</S.Label>
            <S.Input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="상호명을 입력하세요"
            />
          </S.Field>

          <S.Field>
            <S.Label>사업자등록번호</S.Label>
            <S.Input
              type="text"
              value={businessNo}
              onChange={(e) => setBusinessNo(e.target.value)}
              placeholder="사업자등록번호를 입력하세요"
            />
          </S.Field>

          <S.Field>
            <S.Label>사업자등록증 (재첨부)</S.Label>
            <S.FileBox>
              <S.FileName>
                {businessDoc
                  ? businessDoc.name
                  : '파일을 선택해주세요 (PDF, JPG, PNG)'}
              </S.FileName>
              <S.FileBtn>
                파일 선택
                <S.HiddenFileInput
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setBusinessDoc(e.target.files?.[0] ?? null)}
                />
              </S.FileBtn>
            </S.FileBox>
            <S.Hint>반려 사유에 맞게 올바른 서류를 다시 첨부해주세요.</S.Hint>
          </S.Field>
        </S.Card>

        <S.ButtonRow>
          <S.GhostBtn type="button" onClick={() => navigate('/host/status')}>
            취소
          </S.GhostBtn>
          <S.PrimaryBtn
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? '제출 중...' : '재신청 제출'}
          </S.PrimaryBtn>
        </S.ButtonRow>
      </S.CardStack>
    </PageLayout>
  );
}

export default HostReapplyPage;
