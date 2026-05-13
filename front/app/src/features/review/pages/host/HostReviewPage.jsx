import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  PageSub,
  Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  animation: ${fadeInUp} 480ms ease-out both;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const SearchInput = styled.input`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  flex: 1;
  min-width: 160px;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const Stars = styled.span`
  color: #c97d4c;
  font-size: 13px;
`;

const ReviewText = styled.div`
  font-size: 13px;
  color: #555;
  margin-top: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const ReplyArea = styled.textarea`
  width: 100%;
  padding: 10px 14px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Noto Sans KR', sans-serif;
  resize: none;
  outline: none;
  box-sizing: border-box;
  margin-top: 10px;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const ReplySubmitBtn = styled.button`
  padding: 7px 18px;
  border-radius: 8px;
  background: ${COLOR.green};
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  margin-top: 8px;
  float: right;
  &:hover {
    background: #1a3a2a;
  }
`;

const ReplyBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 8px;
  padding: 12px 14px;
  border-left: 3px solid ${COLOR.sage};
  margin-top: 10px;
  font-size: 13px;
  color: #555;
`;

const ReplyLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${COLOR.green};
  margin-bottom: 5px;
`;

const EditBtn = styled.button`
  font-size: 12px;
  color: ${COLOR.gray400};
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  &:hover {
    color: ${COLOR.black};
  }
`;

const TABS = [
  { label: '전체', status: null },
  { label: '답글 필요', status: 'pending' },
  { label: '답글 완료', status: 'done' },
];

const DUMMY = [
  {
    id: 1,
    status: 'pending',
    space: '청평 숲속 파인뷰',
    type: '워크앤스테이',
    reviewer: '민정',
    avatar: '민',
    score: 5,
    date: '2026.04.22',
    text: '조용하고 몰입감 있어요. 듀얼모니터도 잘 쓰고 왔습니다. 다음에 또 오고 싶어요!',
    reply: null,
    icon: '🌲',
  },
  {
    id: 2,
    status: 'done',
    space: '청평 숲속 파인뷰',
    type: '워크앤스테이',
    reviewer: '준호',
    avatar: '준',
    score: 4,
    date: '2026.04.10',
    text: '리모트 워크 일주일 했는데 너무 좋았어요. 인터넷 속도 빠르고 데스크 셋업이 편했습니다.',
    reply: {
      text: '감사합니다! 다음에도 좋은 시간 보내러 오세요 🌲',
      date: '2026.04.11',
    },
    icon: '🌲',
  },
  {
    id: 3,
    status: 'pending',
    space: '성수 브릭라운지',
    type: '오피스',
    reviewer: '이강',
    avatar: '이',
    score: 5,
    date: '2026.03.18',
    text: '바다 뷰 보면서 일하는 게 너무 좋아요. 와이파이 엄청 빠르고 폰부스도 있어서 편했어요.',
    reply: null,
    icon: '🧱',
  },
  {
    id: 4,
    status: 'done',
    space: '성수 브릭라운지',
    type: '오피스',
    reviewer: '소영',
    avatar: '소',
    score: 3,
    date: '2026.03.05',
    text: '주말에 사람이 많아서 좀 시끄러웠어요. 평일에 오시는 걸 추천해요.',
    reply: {
      text: '불편함을 드려 죄송합니다. 주말 혼잡 개선 중이에요 🙏',
      date: '2026.03.06',
    },
    icon: '🧱',
  },
];

function HostReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [spaceFilter, setSpaceFilter] = useState('전체 공간');
  const [keyword, setKeyword] = useState('');
  const [replyTexts, setReplyTexts] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [submitted, setSubmitted] = useState({});

  const counts = TABS.map((tab, idx) =>
    idx === 0
      ? DUMMY.length
      : DUMMY.filter((i) => i.status === tab.status).length
  );

  const filtered = DUMMY.filter(
    (i) => activeTab === 0 || i.status === TABS[activeTab].status
  )
    .filter((i) => spaceFilter === '전체 공간' || i.space === spaceFilter)
    .filter(
      (i) =>
        !keyword || i.reviewer.includes(keyword) || i.text.includes(keyword)
    );

  const handleReplyChange = (id, val) =>
    setReplyTexts((prev) => ({ ...prev, [id]: val }));

  const handleSubmit = (id) => {
    if (!replyTexts[id]?.trim()) return;
    setSubmitted((prev) => ({ ...prev, [id]: replyTexts[id] }));
    setEditingId(null);
  };

  return (
    <Page>
      <Header>
        <PageTitle>답글 관리</PageTitle>
        <PageSub>게스트 리뷰에 답글을 달고 소통하세요</PageSub>
      </Header>

      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      <FilterRow>
        <Select
          value={spaceFilter}
          onChange={(e) => setSpaceFilter(e.target.value)}
        >
          <option>전체 공간</option>
          <option>청평 숲속 파인뷰</option>
          <option>성수 브릭라운지</option>
        </Select>
        <Select>
          <option>전체 기간</option>
          <option>이번 달</option>
          <option>지난 3개월</option>
        </Select>
        <SearchInput
          placeholder="작성자명 · 내용 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </FilterRow>

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 0',
            color: COLOR.gray400,
            fontSize: 14,
          }}
        >
          조건에 맞는 리뷰가 없어요
        </div>
      )}

      {filtered.map((item) => {
        const existingReply = submitted[item.id]
          ? { text: submitted[item.id], date: '방금' }
          : item.reply;
        const isEditing = editingId === item.id;

        return (
          <Card key={item.id} style={{ cursor: 'default' }}>
            <CardRow>
              <Thumb>{item.icon}</Thumb>
              <CardBody>
                <TagRow>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: 'rgba(168,184,159,0.18)',
                      color: '#5b6b53',
                    }}
                  >
                    {item.type}
                  </span>
                  <span style={{ fontSize: 12, color: COLOR.gray400 }}>
                    {item.space}
                  </span>
                </TagRow>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700 }}>
                    {item.reviewer}
                  </span>
                  <Stars>
                    {'★'.repeat(item.score)}
                    {'☆'.repeat(5 - item.score)}
                  </Stars>
                  <span style={{ fontSize: 12, color: COLOR.gray400 }}>
                    {item.date}
                  </span>
                </div>
                <ReviewText>{item.text}</ReviewText>

                {/* 기존 답글 */}
                {existingReply && !isEditing && (
                  <ReplyBox>
                    <ReplyLabel>🏠 내 답글 · {existingReply.date}</ReplyLabel>
                    <div>{existingReply.text}</div>
                    <EditBtn
                      onClick={() => {
                        setEditingId(item.id);
                        handleReplyChange(item.id, existingReply.text);
                      }}
                    >
                      수정
                    </EditBtn>
                  </ReplyBox>
                )}

                {/* 답글 입력 */}
                {(!existingReply || isEditing) && (
                  <div>
                    <ReplyArea
                      rows={3}
                      placeholder="게스트에게 감사한 마음을 전해보세요"
                      value={replyTexts[item.id] || ''}
                      onChange={(e) =>
                        handleReplyChange(item.id, e.target.value)
                      }
                    />
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        justifyContent: 'flex-end',
                        marginTop: 8,
                      }}
                    >
                      {isEditing && (
                        <EditBtn onClick={() => setEditingId(null)}>
                          취소
                        </EditBtn>
                      )}
                      <ReplySubmitBtn onClick={() => handleSubmit(item.id)}>
                        {isEditing ? '수정 완료' : '답글 등록'}
                      </ReplySubmitBtn>
                    </div>
                  </div>
                )}
              </CardBody>
            </CardRow>
          </Card>
        );
      })}
    </Page>
  );
}

export default HostReviewPage;
