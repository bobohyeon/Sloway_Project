import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';
import { saveHelpful, deleteHelpful, findMyHelpfulNo } from '../../../../review/api/reviewApi';

/**
 * ReviewItem - 리뷰 1개 (토글로 상세 펼치기/접기)
 *
 * @param {Object} review - 리뷰 데이터
 * @param {boolean} showSpaceChip - 공간 정보 칩 표시 여부 (기본 false, 공간 상세에서는 숨김)
 */
function ReviewItem({ review, showSpaceChip = false }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [helpCount, setHelpCount] = useState(review.helpful || 0);
  const [myHelpfulNo, setMyHelpfulNo] = useState(null); // 내가 누른 도움돼요 entity no (없으면 null)
  const [zoomIdx, setZoomIdx] = useState(null);         // 라이트박스에서 보고 있는 이미지 index (null = 닫힘)
  const helped = myHelpfulNo != null;

  const imgs = review.imgs ?? [];
  // 순환 네비게이션: 마지막에서 다음 → 처음, 처음에서 이전 → 마지막
  const showPrev = (e) => { e.stopPropagation(); setZoomIdx((i) => (i - 1 + imgs.length) % imgs.length); };
  const showNext = (e) => { e.stopPropagation(); setZoomIdx((i) => (i + 1) % imgs.length); };

  const reviewNo = review.id ?? review.no;
  const isLoggedIn = !!localStorage.getItem('accessToken');

  // 마운트 시 "내가 이 리뷰에 도움돼요를 눌렀는지" 백엔드에서 확인 (새로고침해도 상태 유지)
  useEffect(() => {
    if (!isLoggedIn || !reviewNo) return;
    findMyHelpfulNo(reviewNo).then((no) => setMyHelpfulNo(no || null)).catch(() => {});
  }, [reviewNo, isLoggedIn]);

  const toggleHelp = async (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요.');
      return;
    }
    try {
      if (helped) {
        // 이미 누른 상태 → 취소 (entity no 로 삭제)
        await deleteHelpful(myHelpfulNo);
        setMyHelpfulNo(null);
        setHelpCount((c) => c - 1);
      } else {
        // 등록 → POST 응답엔 body 가 없어서, 새로 생긴 no 를 다시 조회해 확보 (취소에 필요)
        await saveHelpful(reviewNo);
        const newNo = await findMyHelpfulNo(reviewNo);
        setMyHelpfulNo(newNo || null);
        setHelpCount((c) => c + 1);
      }
    } catch (err) {
      console.error('도움돼요 처리 실패', err);
    }
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
          <HelpfulCount>👍 도움돼요 {helpCount}</HelpfulCount>
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
          {/* 사진 — imgs는 이제 URL 배열 */}
          {review.imgs?.length > 0 && (
            <ImgRow>
              {review.imgs.map((url, i) => (
                <ImgSlot
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setZoomIdx(i); }}
                  style={{ cursor: 'pointer' }}
                >
                  <img
                    src={url}
                    alt="리뷰 이미지"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                  />
                </ImgSlot>
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
                navigate('/user/review/report', { state: { reviewNo: review.no ?? review.id } });
              }}
            >
              🚩 신고
            </ReportBtn>
          </MetaRow>
        </>
      )}

      {/* 호스트 답글 — 항상 표시 */}
      {review.reply && (
        <ReplyBox>
          <ReplyLabel>
            🏠 {review.reply.hostName} · {review.reply.date}
          </ReplyLabel>
          <ReplyText>{review.reply.text}</ReplyText>
        </ReplyBox>
      )}

      {/* 더보기 / 접기 토글 */}
      <ToggleBtn onClick={toggleExpand}>
        {expanded ? '접기 ▲' : '더보기 ▼'}
      </ToggleBtn>

      {/* 이미지 확대 라이트박스 — 배경 클릭 시 닫힘, ◀▶ 로 넘기기 */}
      {zoomIdx !== null && imgs[zoomIdx] && (
        <Lightbox onClick={(e) => { e.stopPropagation(); setZoomIdx(null); }}>
          {imgs.length > 1 && <NavBtn $left onClick={showPrev}>‹</NavBtn>}
          <img
            src={imgs[zoomIdx]}
            alt="리뷰 이미지 확대"
            onClick={(e) => e.stopPropagation()}
          />
          {imgs.length > 1 && <NavBtn $right onClick={showNext}>›</NavBtn>}
          {imgs.length > 1 && <ImgCounter>{zoomIdx + 1} / {imgs.length}</ImgCounter>}
        </Lightbox>
      )}
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

const HelpfulCount = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: ${COLOR.gray600};
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
  flex-wrap: nowrap;       /* 줄바꿈 X */
  overflow-x: auto;        /* 넘치면 가로 스크롤 */
  padding-bottom: 4px;     /* 스크롤바 자리 */
`;

const ImgSlot = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${COLOR.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const Lightbox = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;

  img {
    max-width: 90vw;
    max-height: 90vh;
    border-radius: 8px;
  }
`;

const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $left }) => $left && 'left: 20px;'}
  ${({ $right }) => $right && 'right: 20px;'}
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { background: rgba(255, 255, 255, 0.35); }
`;

const ImgCounter = styled.div`
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 12px;
  border-radius: 20px;
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
