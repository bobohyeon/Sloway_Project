import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
  SectionBox,
  SectionTitle,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import api from '../../../../app/api/axiosApi';

const StatusBadge = styled.span`
  display: inline-block;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  background: #fff3e0;
  color: #e65100;
  margin-bottom: 16px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 40px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`font-size: 11px; color: #8a8a8a;`;
const InfoValue = styled.span`font-size: 14px; font-weight: 600; color: ${COLOR.black};`;

const ReviewBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 10px;
  padding: 16px 18px;
  margin-top: 12px;
`;

const Stars = styled.span`color: #c97d4c; font-size: 13px;`;

const ReviewText = styled.p`
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  margin: 8px 0 0;
`;

const TabBar = styled.div`
  display: flex;
  border-bottom: 1px solid ${COLOR.gray200};
  margin-bottom: 20px;
`;

const TabBtn = styled.button`
  padding: 10px 16px;
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? COLOR.black : '#AAAAAA')};
  background: none;
  border: none;
  border-bottom: 2.5px solid ${({ $active }) => ($active ? COLOR.green : 'transparent')};
  margin-bottom: -1px;
  cursor: pointer;
`;

const NoteArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Noto Sans KR', sans-serif;
  resize: none;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: ${COLOR.sage}; }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 20px;
  border-top: 1px solid ${COLOR.gray200};
  margin-top: 24px;
`;

const HoldBtn = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  &:hover { border-color: ${COLOR.sage}; }
`;

const ConfirmBtn = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  border: none;
  background: ${COLOR.red};
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  &:hover { filter: brightness(0.9); }
`;

const REASON_LABEL = {
  SPAM: '공간과 관련 없는 내용',
  FALSE: '허위·과장된 내용',
  PRIVACY: '개인정보 노출',
  HATE: '욕설·혐오 표현',
  COPYRIGHT: '저작권 침해',
  ETC: '기타',
};

const DECISION_TABS = ['신고 내용', '처리 이력'];

function AdminReviewReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const report = location.state?.report;
  const [review, setReview] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [note, setNote] = useState('');
  const [decision, setDecision] = useState('I'); // I=유지, D=삭제

  useEffect(() => {
    if (!report) return;
    const fetchReview = async () => {
      try {
        const res = await api.get(`/review/${report.reviewNo}`);
        setReview(res.data);
      } catch {
        // 리뷰 데이터 없으면 빈 상태 유지
      }
    };
    fetchReview();
  }, [report]);

  const handleConfirm = async () => {
    try {
      await api.put(`/review/report/${id}?status=${decision}`);
      alert('처리되었습니다');
      navigate('/admin/review/report');
    } catch {
      alert('처리에 실패했어요');
    }
  };

  const formatDate = (dt) => dt?.slice(0, 10).replaceAll('-', '.') ?? '';

  if (!report) {
    return (
      <PageLayout title="신고 상세" backTo="/admin/review/report" backLabel="리뷰 신고 관리" maxWidth={1200}>
        <div style={{ textAlign: 'center', padding: 40, color: COLOR.gray400 }}>
          신고 데이터를 불러오지 못했어요
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="신고 상세"
      description="신고 내용을 검토하고 처리 여부를 결정하세요"
      backTo="/admin/review/report"
      backLabel="리뷰 신고 관리"
      maxWidth={1200}
    >
      <StatusBadge>
        {report.processStatus ? (report.processStatus === 'I' ? '유지' : '삭제됨') : '검토 중'}
      </StatusBadge>

      {/* 신고 정보 */}
      <SectionBox>
        <SectionTitle>신고 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>신고 사유</InfoLabel>
            <InfoValue>{REASON_LABEL[report.reasonType] ?? report.reasonType}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>신고 일시</InfoLabel>
            <InfoValue>{formatDate(report.createdAt)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>신고자 No.</InfoLabel>
            <InfoValue>{report.memberNo}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>대상 리뷰 No.</InfoLabel>
            <InfoValue>{report.reviewNo}</InfoValue>
          </InfoItem>
        </InfoGrid>
        {report.reasonDetail && (
          <div style={{ marginTop: 12, padding: '10px 14px', background: '#FFF8F0', borderRadius: 8, fontSize: 13, color: '#666' }}>
            📝 신고 상세: {report.reasonDetail}
          </div>
        )}
      </SectionBox>

      {/* 신고된 리뷰 */}
      {review && (
        <SectionBox>
          <SectionTitle>신고된 리뷰</SectionTitle>
          <ReviewBox>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Stars>
                {'★'.repeat(review.scoreTotal)}{'☆'.repeat(5 - review.scoreTotal)}
              </Stars>
              <span style={{ fontSize: 12, color: COLOR.gray400 }}>{review.memberName}</span>
              <span style={{ fontSize: 12, color: COLOR.gray400 }}>{formatDate(review.createdAt)}</span>
            </div>
            <ReviewText>{review.content}</ReviewText>
          </ReviewBox>
        </SectionBox>
      )}

      {/* 탭 */}
      <TabBar>
        {DECISION_TABS.map((tab, idx) => (
          <TabBtn key={idx} $active={activeTab === idx} onClick={() => setActiveTab(idx)}>
            {tab}
          </TabBtn>
        ))}
      </TabBar>

      {activeTab === 0 && (
        <SectionBox>
          <SectionTitle>처리 결정</SectionTitle>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { value: 'I', label: '✅ 리뷰 유지', desc: '신고 사유 불충분 · 리뷰 정상 유지' },
              { value: 'D', label: '🗑 리뷰 삭제', desc: '규정 위반 · 리뷰 삭제 처리' },
            ].map((opt) => (
              <div
                key={opt.value}
                onClick={() => setDecision(opt.value)}
                style={{
                  flex: 1,
                  padding: '14px 16px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  border: `2px solid ${decision === opt.value ? (opt.value === 'D' ? COLOR.red : COLOR.green) : COLOR.gray200}`,
                  background: decision === opt.value ? (opt.value === 'D' ? '#FFEBEB' : COLOR.greenLight) : '#fff',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{opt.label}</div>
                <div style={{ fontSize: 12, color: COLOR.gray400 }}>{opt.desc}</div>
              </div>
            ))}
          </div>
          <NoteArea
            rows={3}
            placeholder="처리 메모를 남겨주세요 (내부 기록용)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </SectionBox>
      )}

      {activeTab === 1 && (
        <SectionBox>
          <SectionTitle>처리 이력</SectionTitle>
          <div style={{ fontSize: 13, color: COLOR.gray400, padding: '12px 0' }}>
            {report.processAt
              ? `${formatDate(report.processAt)} — ${report.processStatus === 'I' ? '유지' : '삭제'} 처리 완료`
              : '아직 처리되지 않았어요'}
          </div>
        </SectionBox>
      )}

      <ActionRow>
        <HoldBtn onClick={() => navigate('/admin/review/report')}>보류</HoldBtn>
        <ConfirmBtn onClick={handleConfirm}>처리 확정</ConfirmBtn>
      </ActionRow>
    </PageLayout>
  );
}

export default AdminReviewReportPage;
