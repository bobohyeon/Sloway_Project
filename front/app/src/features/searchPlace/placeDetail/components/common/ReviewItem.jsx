import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

/**
 * ReviewItem - 리뷰 1개 (토글로 상세 펼치기/접기)
 *
 * @param {Object} review - 리뷰 데이터
 * @param {boolean} showSpaceChip - 공간 정보 칩 표시 여부 (기본 false, 공간 상세에서는 숨김)
 */
function ReviewItem({ review, showSpaceChip = false }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [helped, setHelped] = useState(false);
  const [helpCount, setHelpCount] = useState(review.helpful || 0);

  const toggleHelp = (e) => {
    e.stopPropagation();
    setHelped((v) => !v);
    setHelpCount((c) => (helped ? c - 1 : c + 1));
  };

  const toggleExpand = () => {
    setExpanded((v) => !v);
  };

  return (
    <Card>
      {/* 공간 정보 칩 (옵션) */}
      {showSpaceChip && review.space && (
        <SpaceChip onClick={() => navigate(-1)}>
          <SpaceTag>{review.spaceType}</SpaceTag>
          <SpaceName>{review.space}</SpaceName>
          <SpaceLink>공간 보기 →</SpaceLink>
        </SpaceChip>
      )}

      {/* 작성자 */}
      <ReviewerRow>
        <Avatar $color={review.avatarColor}>{review.avatar}</Avatar>
        <div>
          <ReviewerName>{review.name}</ReviewerName>
          <ReviewerMeta>
            작성일 {review.date}
            {review.usedDate && ` · 이용일 ${review.usedDate}`}
          </ReviewerMeta>
        </div>
      </ReviewerRow>

      {/* 종합 평점 (펼치기 전엔 종합 만족도만) */}
      {!expanded && review.scores && review.scores[0] && (
        <SimpleScore>
          <Stars>
            {'★'.repeat(review.scores[0].val)}
            {'☆'.repeat(5 - review.scores[0].val)}
          </Stars>
          <ScoreNum>{review.scores[0].val}.0</ScoreNum>
        </SimpleScore>
      )}

      {/* 항목별 평점 (펼친 후) */}
      {expanded && review.scores && (
        <ScoreGrid>
          {review.scores.map((s, i) => (
            <ScoreItem key={i}>
              <ScoreLabel>{s.label}</ScoreLabel>
              <Stars>
                {'★'.repeat(s.val)}
                {'☆'.repeat(5 - s.val)}
              </Stars>
              <ScoreVal>{s.val}.0</ScoreVal>
            </ScoreItem>
          ))}
        </ScoreGrid>
      )}

      {/* 리뷰 본문 (접혔을 때는 2줄까지만) */}
      <ReviewText $expanded={expanded}>{review.text}</ReviewText>

      {/* 펼친 후 추가 내용 */}
      {expanded && (
        <>
          {/* 사진 */}
          {review.imgs > 0 && (
            <ImgRow>
              {Array(review.imgs)
                .fill(0)
                .map((_, i) => (
                  <ImgSlot key={i}>📷</ImgSlot>
                ))}
            </ImgRow>
          )}

          {/* 도움돼요 + 신고 */}
          <MetaRow>
            <HelpfulBtn $active={helped} onClick={toggleHelp}>
              👍 도움돼요 {helpCount}
            </HelpfulBtn>
            <ReportBtn
              onClick={(e) => {
                e.stopPropagation();
                navigate('/user/review/report');
              }}
            >
              🚩 신고
            </ReportBtn>
          </MetaRow>

          {/* 호스트 답글 */}
          {review.reply && (
            <ReplyBox>
              <ReplyLabel>
                🏠 {review.reply.hostName} · {review.reply.date}
              </ReplyLabel>
              <ReplyText>{review.reply.text}</ReplyText>
            </ReplyBox>
          )}
        </>
      )}

      {/* 더보기 / 접기 토글 */}
      <ToggleBtn onClick={toggleExpand}>
        {expanded ? '접기 ▲' : '더보기 ▼'}
      </ToggleBtn>
    </Card>
  );
}

export default ReviewItem;

/* ────────────────── styled ────────────────── */

const Card = styled.article`
  padding: 20px;
  border: 1px solid #e8dfd0;
  border-radius: 10px;
  background: #fff;
  margin-bottom: 12px;
  transition: box-shadow 0.2s;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

const SpaceChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: ${COLOR.gray100};
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${COLOR.greenLight};
  }
`;

const SpaceTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

const SpaceName = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

const SpaceLink = styled.span`
  font-size: 12px;
  color: ${COLOR.gray400};
  margin-left: auto;
`;

const ReviewerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ $color }) => $color || COLOR.sage || '#A8B89F'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  color: #fff;
  flex-shrink: 0;
`;

const ReviewerName = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
`;

const ReviewerMeta = styled.div`
  font-size: 12px;
  color: ${COLOR.gray400};
  margin-top: 2px;
`;

const SimpleScore = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  background: ${COLOR.gray100};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 14px;
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`;

const ScoreLabel = styled.span`
  color: ${COLOR.gray600};
  flex-shrink: 0;
`;

const Stars = styled.span`
  color: #c97d4c;
  font-size: 13px;
`;

const ScoreNum = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #c97d4c;
`;

const ScoreVal = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #c97d4c;
`;

const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #333;
  margin: 0 0 12px 0;

  ${({ $expanded }) =>
    !$expanded &&
    `
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
  `}
`;

const ImgRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const ImgSlot = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background: ${COLOR.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid ${COLOR.gray200};
  margin-bottom: 14px;
`;

const HelpfulBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 20px;
  border: 1.5px solid
    ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.greenLight : '#fff')};
  color: ${({ $active }) => ($active ? COLOR.green : COLOR.gray600)};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    border-color: ${COLOR.green};
    color: ${COLOR.green};
    background: ${COLOR.greenLight};
  }
`;

const ReportBtn = styled.button`
  font-size: 12px;
  color: ${COLOR.gray400};
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  text-decoration: underline;
  font-family: 'Noto Sans KR', sans-serif;
  &:hover {
    color: ${COLOR.red};
  }
`;

const ReplyBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 10px;
  padding: 14px 16px;
  border-left: 3px solid ${COLOR.sage || '#A8B89F'};
  margin-bottom: 14px;
`;

const ReplyLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${COLOR.green};
  margin-bottom: 6px;
`;

const ReplyText = styled.p`
  font-size: 13px;
  color: #555;
  line-height: 1.6;
  margin: 0;
`;

const ToggleBtn = styled.button`
  width: 100%;
  padding: 10px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  background: #fff;
  color: ${COLOR.green};
  font-size: 13px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${COLOR.greenLight};
    border-color: ${COLOR.green};
  }
`;
