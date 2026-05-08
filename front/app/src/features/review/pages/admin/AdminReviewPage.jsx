import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Pagination,
  PageBtn,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';

const DUMMY = [
  {
    id: 1,
    reviewer: '민정',
    avatar: '민',
    color: '#A8B89F',
    space: '청평 숲속 파인뷰',
    code: 'RV-2026-00847',
    date: '2026.04.22',
    score: 5,
    text: '조용하고 몰입감 있어요. 듀얼모니터도 잘 쓰고 왔습니다!',
    imgs: 3,
    helpful: 24,
    type: '워크앤스테이',
    reported: false,
  },
  {
    id: 2,
    reviewer: '익명회원',
    avatar: '익',
    color: '#CCC',
    space: '양양 파도소리 빌라',
    code: 'RV-2026-00835',
    date: '2026.04.20',
    score: 1,
    text: '이상한 광고성 내용이 포함된 부적절한 리뷰 샘플입니다...',
    imgs: 0,
    helpful: 0,
    type: '숙소',
    reported: true,
    reportCount: 3,
  },
  {
    id: 3,
    reviewer: '수연',
    avatar: '수',
    color: '#7B9EA8',
    space: '제주 돌담집 리트릿',
    code: 'RV-2026-00830',
    date: '2026.04.10',
    score: 5,
    text: '돌담 너머 바다 보면서 일하는 게 너무 좋았어요 :)',
    imgs: 2,
    helpful: 32,
    type: '숙소',
    reported: false,
  },
];

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  align-items: center;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  min-width: 180px;
`;

const SearchBtn = styled.button`
  padding: 8px 16px;
  background: ${COLOR.green};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

const ReviewRow = styled.div`
  background: #fff;
  border: 1.5px solid
    ${({ $reported }) => ($reported ? '#FFCDD2' : COLOR.gray200)};
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  color: #fff;
  flex-shrink: 0;
`;

const Stars = styled.span`
  color: #c97d4c;
  font-size: 12px;
`;

const TypeTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

const ReportBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 4px;
  background: #fff0f0;
  color: ${COLOR.red};
  display: inline-flex;
  align-items: center;
  gap: 3px;
`;

const ActionBtns = styled.div`
  display: flex;
  gap: 6px;
`;

const BtnAction = styled.button`
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 6px;
  border: ${({ $danger }) =>
    $danger ? '1px solid #fcc' : `1px solid ${COLOR.gray200}`};
  background: ${({ $green }) => ($green ? '#EEF5EE' : '#fff')};
  color: ${({ $danger }) =>
    $danger ? COLOR.red : ($green) => ($green ? COLOR.green : '#555')};
  cursor: pointer;
`;

function AdminReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const TABS = [
    { label: '전체', count: 7 },
    { label: '공개', count: 5 },
    { label: '🚩 신고됨', count: 1 },
    { label: '숨김', count: 1 },
  ];

  return (
    <div>
      <PageTitle>리뷰 관리</PageTitle>
      <PageSub>플랫폼의 모든 리뷰를 조회하고 관리하세요</PageSub>

      <StatCards>
        <StatCard>
          <StatLabel>전체 리뷰</StatLabel>
          <StatValue>3,428개</StatValue>
        </StatCard>
        <StatCard $accent="#C97D4C">
          <StatLabel>평균 평점</StatLabel>
          <StatValue $color="#C97D4C">4.4</StatValue>
        </StatCard>
        <StatCard $accent={COLOR.red}>
          <StatLabel>신고 대기</StatLabel>
          <StatValue $color={COLOR.red}>1건</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>이번 달 작성</StatLabel>
          <StatValue>142개</StatValue>
        </StatCard>
      </StatCards>

      <TabBar>
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

      <FilterRow>
        <Select>
          <option>전체 평점</option>
          <option>5점</option>
          <option>4점</option>
          <option>3점 이하</option>
        </Select>
        <Select>
          <option>전체 공간</option>
        </Select>
        <SearchInput placeholder="공간명·작성자 ID 검색" />
        <SearchBtn>검색</SearchBtn>
      </FilterRow>

      {DUMMY.map((item) => (
        <ReviewRow
          key={item.id}
          $reported={item.reported}
          onClick={() => item.reported && navigate('/admin/review/report')}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}
          >
            <Avatar $color={item.color}>{item.avatar}</Avatar>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700 }}>
                  {item.reviewer}
                </span>
                <TypeTag>공개</TypeTag>
                {item.reported && (
                  <ReportBadge>🚩 신고 {item.reportCount}건</ReportBadge>
                )}
                <span style={{ fontSize: 11, color: COLOR.gray400 }}>
                  {item.code} · {item.space} · {item.date}
                </span>
              </div>
            </div>
            <Stars>
              {'★'.repeat(item.score)}
              {'☆'.repeat(5 - item.score)}
            </Stars>
            <span style={{ fontSize: 13, fontWeight: 700, marginLeft: 4 }}>
              {item.score}.0
            </span>
            <ActionBtns>
              {item.reported ? (
                <BtnAction
                  $danger
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/admin/review/report');
                  }}
                >
                  신고 처리 →
                </BtnAction>
              ) : (
                <>
                  <BtnAction>본문 보기</BtnAction>
                  <BtnAction $green>숨김 처리</BtnAction>
                  <BtnAction $danger>삭제</BtnAction>
                </>
              )}
            </ActionBtns>
          </div>
          <div
            style={{
              fontSize: 13,
              color: item.reported ? COLOR.red : '#444',
              lineHeight: 1.5,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            {item.text}
          </div>
          <div
            style={{
              fontSize: 11,
              color: COLOR.gray400,
              marginTop: 6,
              display: 'flex',
              gap: 12,
            }}
          >
            <span>📸 사진 {item.imgs}장</span>
            <span>👍 도움돼요 {item.helpful}</span>
            <TypeTag>{item.type}</TypeTag>
            {item.reported && (
              <span style={{ color: COLOR.red, fontWeight: 600 }}>
                🚩 신고 사유: 광고·스팸
              </span>
            )}
          </div>
        </ReviewRow>
      ))}

      <Pagination>
        <PageBtn>‹</PageBtn>
        {[1, 2, 3].map((p) => (
          <PageBtn key={p} $active={p === 1}>
            {p}
          </PageBtn>
        ))}
        <span style={{ fontSize: 13, color: COLOR.gray400 }}>...</span>
        <PageBtn>228</PageBtn>
        <PageBtn>›</PageBtn>
      </Pagination>
    </div>
  );
}

export default AdminReviewPage;
