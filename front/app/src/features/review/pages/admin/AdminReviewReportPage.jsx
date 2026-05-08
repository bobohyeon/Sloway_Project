import { useState } from 'react';
import styled from 'styled-components';
import {
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  PageSub,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  BtnPrimary,
  BtnOutline,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';

const REPORTS = [
  {
    id: 1,
    code: 'RP-2026-00042',
    space: '양양 파도소리 빌라',
    text: '이상한 광고성 내용이 포함된 부적절한 리뷰 샘플입니다. 자세히 보니 공간과는 관련 없고...',
    count: 3,
    date: '2026.04.23 10:15',
    urgent: true,
  },
  {
    id: 2,
    code: 'RP-2026-00038',
    space: '제주 돌담집 리트릿',
    text: '리뷰에 욕설과 혐오 표현이 일부 포함되어 있음. "정말 최악이에요 ㅅ.......',
    count: 1,
    date: '2026.04.20 16:38',
    urgent: false,
  },
];

const DECISIONS = [
  { icon: '✓', title: '리뷰 유지', desc: '부적절한 내용이 없다고 판단' },
  { icon: '⚠️', title: '작성자 경고', desc: '경고 알림 발송 · 리뷰 유지' },
  { icon: '🙈', title: '리뷰 숨김', desc: '비공개 처리 (복구 가능)' },
  { icon: '🗑️', title: '리뷰 삭제', desc: '영구 삭제 + 작성자 제재' },
];

const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 16px;
  align-items: start;
`;

const ReportCard = styled.div`
  background: #fff;
  border: 1.5px solid
    ${({ $selected }) => ($selected ? COLOR.orange : COLOR.gray200)};
  background: ${({ $selected }) => ($selected ? '#FFF8F0' : '#fff')};
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: all 0.15s;
`;

const UrgentTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: #fff0f0;
  color: ${COLOR.red};
`;

const DetailBox = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 22px;
`;

const TargetReview = styled.div`
  background: ${COLOR.gray100};
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 16px;
`;

const ReportItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid ${COLOR.gray200};
  &:last-child {
    border-bottom: none;
  }
`;

const ReportIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: #fff0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
`;

const DecisionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
`;

const DecisionBtn = styled.button`
  padding: 14px 16px;
  border: 1.5px solid
    ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.greenLight : '#fff')};
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  resize: none;
  outline: none;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const BottomBtns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

function AdminReviewReportPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedReport, setSelected] = useState(0);
  const [decision, setDecision] = useState(0);

  const TABS = [
    { label: '전체', count: 3 },
    { label: '🚩 처리 대기', count: 2 },
    { label: '처리 완료', count: 1 },
  ];

  return (
    <div>
      <PageTitle>리뷰 신고 처리</PageTitle>
      <PageSub>접수된 리뷰 신고를 검토하고 조치하세요</PageSub>

      <StatCards>
        <StatCard $accent={COLOR.red}>
          <StatLabel>신고 대기</StatLabel>
          <StatValue $color={COLOR.red}>2건</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>이번 달 처리</StatLabel>
          <StatValue>18건</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>삭제 처리율</StatLabel>
          <StatValue>73%</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>평균 처리 시간</StatLabel>
          <StatValue>1.2일</StatValue>
        </StatCard>
      </StatCards>

      <TabBar style={{ marginBottom: 16 }}>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
            <TabCount $active={activeTab === idx}>{tab.count}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      <SplitLayout>
        {/* 신고 목록 */}
        <div>
          {REPORTS.map((r, i) => (
            <ReportCard
              key={r.id}
              $selected={selectedReport === i}
              onClick={() => setSelected(i)}
            >
              <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: '#FFF3E0',
                    color: COLOR.orange,
                  }}
                >
                  대기
                </span>
                {r.urgent && <UrgentTag>🔴 긴급</UrgentTag>}
                <span
                  style={{
                    fontSize: 11,
                    color: COLOR.gray400,
                    marginLeft: 'auto',
                  }}
                >
                  신고 {r.count}건
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>
                {r.code}
              </div>
              <div
                style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 6 }}
              >
                📍 {r.space}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: '#555',
                  lineHeight: 1.5,
                  overflow: 'hidden',
                  maxHeight: 40,
                }}
              >
                {r.text}
              </div>
              <div style={{ fontSize: 11, color: COLOR.gray400, marginTop: 8 }}>
                {r.date}
              </div>
            </ReportCard>
          ))}
        </div>

        {/* 상세 처리 */}
        <DetailBox>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700 }}>
              {REPORTS[selectedReport].code}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 4,
                background: '#FFF3E0',
                color: COLOR.orange,
              }}
            >
              대기
            </span>
            {REPORTS[selectedReport].urgent && <UrgentTag>🔴 긴급</UrgentTag>}
            <span
              style={{ fontSize: 12, color: COLOR.gray400, marginLeft: 'auto' }}
            >
              신고 접수 · {REPORTS[selectedReport].date}
            </span>
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            📋 신고된 리뷰
          </div>
          <TargetReview>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: COLOR.gray200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                익
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>익명회원</span>
              <span style={{ color: '#C97D4C', fontSize: 12 }}>★☆☆☆☆</span>
            </div>
            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
              이상한 광고성 내용이 포함된 부적절한 리뷰 샘플입니다...
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray400, marginTop: 4 }}>
              📍 {REPORTS[selectedReport].space}
            </div>
          </TargetReview>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            🚩 신고 내역 ({REPORTS[selectedReport].count}건)
          </div>
          <div style={{ marginBottom: 16 }}>
            {[
              {
                icon: '📢',
                tag: '광고·스팸',
                user: 'M000124',
                text: '광고성 콘텐츠로 보입니다',
                date: '2026.04.23 10:15',
              },
              {
                icon: '📢',
                tag: '광고·스팸',
                user: 'M000098',
                text: '공간과 무관한 업체 홍보 글입니다',
                date: '2026.04.23 14:22',
              },
              {
                icon: '❓',
                tag: '허위·과장',
                user: 'M000076',
                text: '실제 이용자가 아닌 것 같아요',
                date: '2026.04.23 18:45',
              },
            ]
              .slice(0, REPORTS[selectedReport].count)
              .map((item, i) => (
                <ReportItem key={i}>
                  <ReportIcon>{item.icon}</ReportIcon>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          background: '#FFF3E0',
                          color: COLOR.orange,
                        }}
                      >
                        {item.tag}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600 }}>
                        {item.user}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#555' }}>
                      {item.text}
                    </div>
                  </div>
                  <span style={{ fontSize: 11, color: COLOR.gray400 }}>
                    {item.date}
                  </span>
                </ReportItem>
              ))}
          </div>

          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
            🔧 처리 결정
          </div>
          <DecisionGrid>
            {DECISIONS.map((d, i) => (
              <DecisionBtn
                key={i}
                $active={decision === i}
                onClick={() => setDecision(i)}
              >
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>
                  {d.icon} {d.title}
                </div>
                <div style={{ fontSize: 11, color: COLOR.gray400 }}>
                  {d.desc}
                </div>
              </DecisionBtn>
            ))}
          </DecisionGrid>

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
              처리 메모 (내부용) <span style={{ color: COLOR.red }}>*</span>
            </div>
            <Textarea
              rows={3}
              placeholder="판단 근거와 처리 이유를 기록해주세요 (감사 로그에 저장됨)"
            />
          </div>

          <BottomBtns>
            <BtnOutline style={{ justifyContent: 'center', padding: '10px' }}>
              보류 (추가 검토)
            </BtnOutline>
            <BtnPrimary style={{ justifyContent: 'center', padding: '10px' }}>
              처리 확정
            </BtnPrimary>
          </BottomBtns>
        </DetailBox>
      </SplitLayout>
    </div>
  );
}

export default AdminReviewReportPage;
