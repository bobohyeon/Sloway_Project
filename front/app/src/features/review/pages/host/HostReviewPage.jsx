import { useState } from 'react';
import styled from 'styled-components';
import {
  TabBar,
  TabBtn,
  TabCount,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  BtnOutline,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import {
  ReviewText,
  ReviewImgs,
  ReviewImg,
  ReplyBox,
} from '../../components/user/ReviewStyled';

const TABS = [
  { label: '전체', count: 5 },
  { label: '답글 대기', count: 3 },
  { label: '답글 완료', count: 2 },
];

const DUMMY = [
  {
    id: 1,
    name: '민정',
    avatar: '민',
    color: '#A8B89F',
    space: '청평 숲속 파인뷰',
    date: '2026.04.22',
    score: 5,
    text: '조용하고 몰입감 있어요. 듀얼모니터도 잘 쓰고 왔습니다. 다음에 팀원들이랑 또 오고 싶어요!',
    imgs: 3,
    reply: null,
  },
  {
    id: 2,
    name: '수연',
    avatar: '수',
    color: '#7B9EA8',
    space: '제주 돌담집 리트릿',
    date: '2026.04.10',
    score: 5,
    text: '돌담 너머 바다 보면서 일하는 게 너무 좋았어요. 호스트님이 주신 감귤차도 정말 맛있었습니다 :)',
    imgs: 0,
    reply: {
      text: '감사합니다! 다음 방문 때 또 따뜻한 차 준비해들게요 🍊',
      date: '2026.04.11',
    },
  },
  {
    id: 3,
    name: '민재',
    avatar: '민',
    color: '#8B7BA8',
    space: '성수 브릭라운지',
    date: '2026.04.05',
    score: 4,
    text: '전체적으로 좋았는데 주말에 사람이 조금 많은 편이에요. 조용한 공간을 원하시면 평일 추천!',
    imgs: 0,
    reply: {
      text: '피드백 감사합니다! 주말 혼잡 문제는 예약 시스템 개선으로 나아질 예정이에요 🙏',
      date: '2026.04.05',
    },
  },
];

const ReviewCard = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 10px;
`;

const ReviewerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #fff;
  flex-shrink: 0;
`;

const Stars = styled.span`
  color: #c97d4c;
  font-size: 13px;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 10px;
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
`;

const ReplyBtn = styled.button`
  background: ${COLOR.sage};
  color: #fff;
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ReplyTextarea = styled.textarea`
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

function HostReviewPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [openReply, setOpenReply] = useState(null);

  return (
    <div>
      <StatCards>
        <StatCard>
          <StatLabel>전체 리뷰</StatLabel>
          <StatValue>5개</StatValue>
        </StatCard>
        <StatCard $accent="#C97D4C">
          <StatLabel>평균 평점</StatLabel>
          <StatValue $color="#C97D4C">4.4</StatValue>
        </StatCard>
        <StatCard $accent={COLOR.orange}>
          <StatLabel>답글 대기</StatLabel>
          <StatValue $color={COLOR.orange}>3개</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>답글률</StatLabel>
          <StatValue>40%</StatValue>
        </StatCard>
      </StatCards>

      <FilterRow>
        <TabBar style={{ margin: 0, border: 'none' }}>
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
        <div style={{ display: 'flex', gap: 8 }}>
          <Select>
            <option>전체 공간</option>
          </Select>
          <Select>
            <option>최신순</option>
          </Select>
        </div>
      </FilterRow>

      {DUMMY.map((item) => (
        <ReviewCard key={item.id}>
          <ReviewerRow>
            <Avatar $color={item.color}>{item.avatar}</Avatar>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>
                  {item.name}
                </span>
                <span style={{ fontSize: 11, color: COLOR.gray400 }}>
                  {item.date} · 📍 {item.space}
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
          </ReviewerRow>

          <ReviewText>{item.text}</ReviewText>

          {item.imgs > 0 && (
            <ReviewImgs>
              {Array(item.imgs)
                .fill(0)
                .map((_, i) => (
                  <ReviewImg key={i}>📷</ReviewImg>
                ))}
            </ReviewImgs>
          )}

          {item.reply ? (
            <ReplyBox>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <span
                  style={{ fontSize: 11, fontWeight: 700, color: COLOR.green }}
                >
                  🏠 내 답글 · {item.reply.date}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <BtnOutline style={{ fontSize: 11, padding: '3px 10px' }}>
                    수정
                  </BtnOutline>
                  <button
                    style={{
                      fontSize: 11,
                      padding: '3px 10px',
                      borderRadius: 6,
                      border: '1px solid #fcc',
                      color: COLOR.red,
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    삭제
                  </button>
                </div>
              </div>
              <div style={{ fontSize: 12, color: '#555', lineHeight: 1.6 }}>
                {item.reply.text}
              </div>
            </ReplyBox>
          ) : openReply === item.id ? (
            <div style={{ marginTop: 10 }}>
              <ReplyTextarea
                rows={3}
                placeholder="게스트에게 감사 인사나 안내를 남겨주세요..."
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 6,
                  marginTop: 6,
                }}
              >
                <BtnOutline
                  style={{ fontSize: 12, padding: '5px 12px' }}
                  onClick={() => setOpenReply(null)}
                >
                  취소
                </BtnOutline>
                <button
                  style={{
                    padding: '5px 12px',
                    borderRadius: 6,
                    background: COLOR.green,
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  등록
                </button>
              </div>
            </div>
          ) : (
            <ReplyBtn onClick={() => setOpenReply(item.id)}>
              🏠 답글 작성하기
            </ReplyBtn>
          )}
        </ReviewCard>
      ))}
    </div>
  );
}

export default HostReviewPage;
