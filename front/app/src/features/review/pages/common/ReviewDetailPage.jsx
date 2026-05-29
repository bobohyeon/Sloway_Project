import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { COLOR } from '../../../rsvn/components/user/RsvnStyled';
import { findOneReview, countHelpful, findMyHelpfulNo, saveHelpful, deleteHelpful, deleteReview } from '../../api/reviewApi';

const SpaceChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: ${COLOR.gray100};
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: ${COLOR.greenLight}; }
`;

const SpaceTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

const ReviewerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ReviewerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${COLOR.sage};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: #fff;
`;

const MyActionBtns = styled.div`
  display: flex;
  gap: 8px;
`;

const EditBtn = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  font-size: 12px;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  &:hover { border-color: ${COLOR.sage}; color: ${COLOR.green}; }
`;

const DeleteBtn = styled.button`
  padding: 6px 14px;
  border-radius: 6px;
  border: 1px solid #fcc;
  background: #fff;
  font-size: 12px;
  color: ${COLOR.red};
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  &:hover { background: #fff0f0; }
`;

const ScoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  background: ${COLOR.gray100};
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
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

const ReviewText = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  margin-bottom: 16px;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid ${COLOR.gray200};
  margin-bottom: 20px;
`;

const HelpfulBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1.5px solid ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.greenLight : '#fff')};
  color: ${({ $active }) => ($active ? COLOR.green : COLOR.gray600)};
  font-size: 13px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: ${COLOR.green}; color: ${COLOR.green}; background: ${COLOR.greenLight}; }
`;

const ReportBtn = styled.button`
  font-size: 12px;
  color: ${COLOR.gray400};
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  text-decoration: underline;
  &:hover { color: ${COLOR.red}; }
`;

const ReplyBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 10px;
  padding: 16px 18px;
  border-left: 3px solid ${COLOR.sage};
`;

const ReplyLabel = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${COLOR.green};
  margin-bottom: 8px;
`;

const ReplyText = styled.p`
  font-size: 13px;
  color: #555;
  line-height: 1.6;
`;

const SCORE_LABELS = ['종합 만족도', '업무 환경', '편의시설', '집중도'];

function ReviewDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [review, setReview] = useState(null);
  const [helpCount, setHelpCount] = useState(0);
  const [myHelpfulNo, setMyHelpfulNo] = useState(null); // null이면 아직 도움됨 안 함

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [reviewData, count, myNo] = await Promise.all([
          findOneReview(id),
          countHelpful(id),
          findMyHelpfulNo(id),
        ]);
        setReview(reviewData);
        setHelpCount(count);
        setMyHelpfulNo(myNo);
      } catch {
        alert('리뷰 데이터를 불러오지 못했어요');
      }
    };
    fetchAll();
  }, [id]);

  const toggleHelp = async () => {
    try {
      if (myHelpfulNo) {
        // 이미 도움됨 → 취소
        await deleteHelpful(myHelpfulNo);
        setMyHelpfulNo(null);
        setHelpCount((c) => c - 1);
      } else {
        // 도움됨 등록
        await saveHelpful(id);
        const myNo = await findMyHelpfulNo(id);
        setMyHelpfulNo(myNo);
        setHelpCount((c) => c + 1);
      }
    } catch {
      alert('처리 중 오류가 발생했어요');
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm('리뷰를 삭제하시겠어요?\n삭제한 리뷰는 복구할 수 없습니다.');
    if (!ok) return;
    try {
      await deleteReview(id);
      navigate('/user/review');
    } catch {
      alert('삭제에 실패했어요');
    }
  };

  const formatDate = (dt) => dt?.slice(0, 10).replaceAll('-', '.') ?? '';

  if (!review) {
    return <PageLayout maxWidth={720}><div style={{ textAlign: 'center', padding: 40, color: COLOR.gray400 }}>불러오는 중...</div></PageLayout>;
  }

  const scores = [
    { label: '종합 만족도', val: review.scoreTotal },
    { label: '업무 환경', val: review.scoreOffice },
    { label: '편의시설', val: review.scoreAmenity },
    { label: '집중도', val: review.scoreFocus },
  ];

  return (
    <PageLayout maxWidth={720}>

      {/* 공간 정보 */}
      <SpaceChip>
        <SpaceTag>{review.spaceType}</SpaceTag>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{review.spaceName}</span>
        <span style={{ fontSize: 12, color: COLOR.gray400, marginLeft: 'auto' }}>공간 보기 →</span>
      </SpaceChip>

      {/* 작성자 + 수정/삭제 */}
      <ReviewerRow>
        <ReviewerLeft>
          <Avatar>{review.memberName?.[0] ?? '?'}</Avatar>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{review.memberName}</div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              작성일 {formatDate(review.createdAt)} · 이용일 {formatDate(review.checkIn)} ~ {formatDate(review.checkOut)}
            </div>
          </div>
        </ReviewerLeft>
        <MyActionBtns>
          <EditBtn onClick={() => navigate(`/user/review/edit/${id}`)}>✏️ 수정</EditBtn>
          <DeleteBtn onClick={handleDelete}>🗑 삭제</DeleteBtn>
        </MyActionBtns>
      </ReviewerRow>

      {/* 항목별 평점 */}
      <ScoreGrid>
        {scores.map((s, i) => (
          <ScoreItem key={i}>
            <ScoreLabel>{s.label}</ScoreLabel>
            <Stars>{'★'.repeat(s.val)}{'☆'.repeat(5 - s.val)}</Stars>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#C97D4C' }}>{s.val}.0</span>
          </ScoreItem>
        ))}
      </ScoreGrid>

      {/* 리뷰 본문 */}
      <ReviewText>{review.content}</ReviewText>

      {/* 도움돼요 + 신고 */}
      <MetaRow>
        <HelpfulBtn $active={!!myHelpfulNo} onClick={toggleHelp}>
          👍 도움돼요 {helpCount}
        </HelpfulBtn>
        <ReportBtn
          onClick={() => navigate('/user/review/report', { state: { reviewNo: review.no } })}
        >
          🚩 신고
        </ReportBtn>
      </MetaRow>

      {/* 호스트 답글 */}
      {review.replies?.length > 0 && (
        <ReplyBox>
          <ReplyLabel>🏠 호스트 답글 · {formatDate(review.replies[0].createdAt)}</ReplyLabel>
          <ReplyText>{review.replies[0].content}</ReplyText>
        </ReplyBox>
      )}
    </PageLayout>
  );
}

export default ReviewDetailPage;
