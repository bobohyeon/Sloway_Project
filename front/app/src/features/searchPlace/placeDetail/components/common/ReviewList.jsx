import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const Wrap = styled.div``;

const ScoreSummary = styled.div`
  background: ${COLOR.gray100};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 32px;
`;

const TotalScore = styled.div`
  text-align: center;
  flex-shrink: 0;
`;

const BigScore = styled.div`
  font-family: 'DM Serif Display', serif;
  font-size: 48px;
  color: ${COLOR.black};
  line-height: 1;
`;

const Stars = styled.div`
  color: #c97d4c;
  font-size: 16px;
  margin: 4px 0 2px;
`;

const ScoreCount = styled.div`
  font-size: 12px;
  color: ${COLOR.gray400};
`;

const ScoreItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
`;

const ScoreLabel = styled.span`
  width: 70px;
  color: ${COLOR.gray600};
  flex-shrink: 0;
`;

const ScoreBar = styled.div`
  flex: 1;
  height: 6px;
  background: ${COLOR.gray200};
  border-radius: 3px;
  overflow: hidden;
`;

const ScoreFill = styled.div`
  height: 100%;
  border-radius: 3px;
  background: #c97d4c;
  width: ${({ $pct }) => $pct}%;
`;

const ScoreVal = styled.span`
  width: 28px;
  text-align: right;
  font-weight: 600;
  color: ${COLOR.black};
  flex-shrink: 0;
`;

const SortRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;

const TotalText = styled.span`
  font-size: 13px;
  color: ${COLOR.gray400};
`;

const SortSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 12px;
  background: #fff;
  outline: none;
`;

const ReviewCard = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: box-shadow 0.15s;
  &:hover {
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  }
`;

const ReviewerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const Avatar = styled.div`
  width: 34px;
  height: 34px;
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

const ReviewText = styled.p`
  font-size: 13px;
  color: #444;
  line-height: 1.6;
  margin-bottom: 10px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ReviewBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: ${COLOR.gray400};
`;

const HelpfulBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${COLOR.gray600};
  font-size: 12px;
`;

const ImgCount = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const DUMMY_REVIEWS = [
  {
    id: 1,
    name: '민정',
    avatar: '민',
    color: '#A8B89F',
    date: '2026.04.22',
    score: 5,
    text: '조용하고 몰입감 있어요. 듀얼모니터도 잘 쓰고 왔습니다. 다음에 팀원들이랑 또 오고 싶어요!',
    helpful: 24,
    imgs: 3,
  },
  {
    id: 2,
    name: '수연',
    avatar: '수',
    color: '#7B9EA8',
    date: '2026.04.10',
    score: 5,
    text: '돌담 너머 바다 보면서 일하는 게 너무 좋았어요. 호스트님이 주신 감귤차도 정말 맛있었습니다 :)',
    helpful: 32,
    imgs: 2,
  },
  {
    id: 3,
    name: '민재',
    avatar: '민',
    color: '#8B7BA8',
    date: '2026.04.05',
    score: 4,
    text: '전체적으로 좋았는데 주말에 사람이 조금 많은 편이에요. 조용한 공간을 원하시면 평일 추천!',
    helpful: 7,
    imgs: 0,
  },
  {
    id: 4,
    name: '지훈',
    avatar: '지',
    color: '#A87B6B',
    date: '2026.03.28',
    score: 5,
    text: '와이파이 빠르고 의자가 편안해서 하루 종일 일해도 괜찮았어요. 폰부스도 유용했습니다.',
    helpful: 15,
    imgs: 1,
  },
];

const SCORE_ITEMS = [
  { label: '종합 만족도', val: 4.9 },
  { label: '업무 환경', val: 4.8 },
  { label: '편의시설', val: 4.7 },
  { label: '집중도', val: 4.9 },
];

function ReviewList({ reviewCount = 89, avgScore = 4.9 }) {
  const navigate = useNavigate();

  return (
    <Wrap>
      {/* 평점 요약 */}
      <ScoreSummary>
        <TotalScore>
          <BigScore>{avgScore}</BigScore>
          <Stars>{'★'.repeat(Math.round(avgScore))}</Stars>
          <ScoreCount>{reviewCount}개 리뷰</ScoreCount>
        </TotalScore>
        <ScoreItems>
          {SCORE_ITEMS.map((s, i) => (
            <ScoreItem key={i}>
              <ScoreLabel>{s.label}</ScoreLabel>
              <ScoreBar>
                <ScoreFill $pct={(s.val / 5) * 100} />
              </ScoreBar>
              <ScoreVal>{s.val}</ScoreVal>
            </ScoreItem>
          ))}
        </ScoreItems>
      </ScoreSummary>

      {/* 정렬 */}
      <SortRow>
        <TotalText>리뷰 {reviewCount}개</TotalText>
        <SortSelect>
          <option>최신순</option>
          <option>평점 높은순</option>
          <option>도움돼요순</option>
        </SortSelect>
      </SortRow>

      {/* 리뷰 목록 */}
      {DUMMY_REVIEWS.map((r) => (
        <ReviewCard key={r.id} onClick={() => navigate(`/review/${r.id}`)}>
          <ReviewerRow>
            <Avatar $color={r.color}>{r.avatar}</Avatar>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{r.name}</span>
                <span style={{ color: '#C97D4C', fontSize: 12 }}>
                  {'★'.repeat(r.score)}
                </span>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: '#C97D4C' }}
                >
                  {r.score}.0
                </span>
              </div>
              <div style={{ fontSize: 11, color: COLOR.gray400 }}>{r.date}</div>
            </div>
          </ReviewerRow>

          <ReviewText>{r.text}</ReviewText>

          <ReviewBottom>
            <div style={{ display: 'flex', gap: 10 }}>
              <HelpfulBadge>👍 도움돼요 {r.helpful}</HelpfulBadge>
              {r.imgs > 0 && <ImgCount>📷 {r.imgs}</ImgCount>}
            </div>
            <span>더보기 →</span>
          </ReviewBottom>
        </ReviewCard>
      ))}
    </Wrap>
  );
}

export default ReviewList;
