import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
  SectionBox,
  SectionTitle,
  BtnOutline,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
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

const InfoLabel = styled.span`
  font-size: 11px;
  color: #8a8a8a;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${COLOR.black};
`;

const ReviewBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 10px;
  padding: 16px 18px;
  margin-top: 12px;
`;

const Stars = styled.span`
  color: #c97d4c;
  font-size: 13px;
`;

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
  border-bottom: 2.5px solid
    ${({ $active }) => ($active ? COLOR.green : 'transparent')};
  margin-bottom: -1px;
  cursor: pointer;
`;

const HistoryItem = styled.div`
  display: flex;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid ${COLOR.gray200};
  &:last-child {
    border-bottom: none;
  }
`;

const HistoryDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $status }) =>
    $status === 'PENDING'
      ? '#E65100'
      : $status === 'KEPT'
        ? COLOR.green
        : COLOR.red};
  margin-top: 4px;
  flex-shrink: 0;
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
  &:focus {
    border-color: ${COLOR.sage};
  }
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
  &:hover {
    border-color: ${COLOR.sage};
  }
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
  &:hover {
    filter: brightness(0.9);
  }
`;

const DETAIL = {
  id: 1,
  status: 'PENDING',
  reason: '욕설·비방',
  reportDate: '2026.05.10 14:32',
  reporter: { name: '박민수', joinDate: '2024.03', rsvnCount: 5 },
  reviewer: { name: '홍길동', joinDate: '2023.11', rsvnCount: 12 },
  space: '청평 숲속 파인뷰 스테이',
  review: {
    date: '2026.05.08',
    score: 1,
    text: '진짜 최악이야 다시는 안 와. 호스트도 불친절하고 시설도 광고랑 달라.',
    imgs: 2,
  },
  reportDetail: '욕설이 포함된 내용으로 다른 이용자에게 불쾌감을 줄 수 있음',
  history: [{ date: '2026.05.10 14:32', status: 'PENDING', note: '신고 접수' }],
};

const DECISION_TABS = ['신고 내용', '처리 이력'];

function AdminReviewReportPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [note, setNote] = useState('');
  const [decision, setDecision] = useState('KEEP'); // KEEP | DELETE

  const handleHold = () => {
    navigate('/admin/review/report');
  };

  const handleConfirm = () => {
    alert('처리되었습니다');
    navigate('/admin/review/report');
  };

  return (
    <PageLayout
      title="신고 상세"
      description="신고 내용을 검토하고 처리 여부를 결정하세요"
      backTo="/admin/review/report"
      backLabel="리뷰 신고 관리"
      maxWidth={1200}
    >
      <StatusBadge>검토 중</StatusBadge>

      {/* 신고 정보 */}
      <SectionBox>
        <SectionTitle>신고 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>신고 사유</InfoLabel>
            <InfoValue>{DETAIL.reason}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>신고 일시</InfoLabel>
            <InfoValue>{DETAIL.reportDate}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>신고자</InfoLabel>
            <InfoValue>{DETAIL.reporter.name}</InfoValue>
            <span style={{ fontSize: 11, color: COLOR.gray400 }}>
              {DETAIL.reporter.joinDate} 가입 · 예약 {DETAIL.reporter.rsvnCount}
              회
            </span>
          </InfoItem>
          <InfoItem>
            <InfoLabel>리뷰 작성자</InfoLabel>
            <InfoValue>{DETAIL.reviewer.name}</InfoValue>
            <span style={{ fontSize: 11, color: COLOR.gray400 }}>
              {DETAIL.reviewer.joinDate} 가입 · 예약 {DETAIL.reviewer.rsvnCount}
              회
            </span>
          </InfoItem>
          <InfoItem>
            <InfoLabel>대상 공간</InfoLabel>
            <InfoValue>{DETAIL.space}</InfoValue>
          </InfoItem>
        </InfoGrid>
        <div
          style={{
            marginTop: 12,
            padding: '10px 14px',
            background: '#FFF8F0',
            borderRadius: 8,
            fontSize: 13,
            color: '#666',
          }}
        >
          📝 신고 상세: {DETAIL.reportDetail}
        </div>
      </SectionBox>

      {/* 신고된 리뷰 */}
      <SectionBox>
        <SectionTitle>신고된 리뷰</SectionTitle>
        <ReviewBox>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 4,
            }}
          >
            <Stars>
              {'★'.repeat(DETAIL.review.score)}
              {'☆'.repeat(5 - DETAIL.review.score)}
            </Stars>
            <span style={{ fontSize: 12, color: COLOR.gray400 }}>
              {DETAIL.review.date}
            </span>
            {DETAIL.review.imgs > 0 && (
              <span style={{ fontSize: 12, color: COLOR.gray400 }}>
                📷 {DETAIL.review.imgs}장
              </span>
            )}
          </div>
          <ReviewText>{DETAIL.review.text}</ReviewText>
        </ReviewBox>
      </SectionBox>

      {/* 탭 */}
      <TabBar>
        {DECISION_TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab}
          </TabBtn>
        ))}
      </TabBar>

      {activeTab === 0 && (
        <>
          {/* 처리 결정 */}
          <SectionBox>
            <SectionTitle>처리 결정</SectionTitle>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                {
                  value: 'KEEP',
                  label: '✅ 리뷰 유지',
                  desc: '신고 사유 불충분 · 리뷰 정상 유지',
                },
                {
                  value: 'DELETE',
                  label: '🗑 리뷰 삭제',
                  desc: '규정 위반 · 리뷰 삭제 처리',
                },
              ].map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => setDecision(opt.value)}
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    border: `2px solid ${decision === opt.value ? (opt.value === 'DELETE' ? COLOR.red : COLOR.green) : COLOR.gray200}`,
                    background:
                      decision === opt.value
                        ? opt.value === 'DELETE'
                          ? '#FFEBEB'
                          : COLOR.greenLight
                        : '#fff',
                  }}
                >
                  <div
                    style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}
                  >
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 12, color: COLOR.gray400 }}>
                    {opt.desc}
                  </div>
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
        </>
      )}

      {activeTab === 1 && (
        <SectionBox>
          <SectionTitle>처리 이력</SectionTitle>
          {DETAIL.history.map((h, i) => (
            <HistoryItem key={i}>
              <HistoryDot $status={h.status} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{h.note}</div>
                <div
                  style={{ fontSize: 12, color: COLOR.gray400, marginTop: 2 }}
                >
                  {h.date}
                </div>
              </div>
            </HistoryItem>
          ))}
        </SectionBox>
      )}

      <ActionRow>
        <HoldBtn onClick={handleHold}>보류</HoldBtn>
        <ConfirmBtn onClick={handleConfirm}>처리 확정</ConfirmBtn>
      </ActionRow>
    </PageLayout>
  );
}

export default AdminReviewReportPage;
