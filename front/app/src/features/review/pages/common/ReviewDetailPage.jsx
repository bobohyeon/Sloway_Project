import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { COLOR } from '../../../rsvn/components/user/RsvnStyled';

const DUMMY = {
  id: 1,
  isMine: true, // 본인 리뷰 여부 — 백엔드 연결 시 로그인 유저와 비교
  name: '민정',
  avatar: '민',
  avatarColor: '#A8B89F',
  date: '2026.04.22',
  usedDate: '2026.04.18 ~ 2026.04.20',
  space: '청평 숲속 파인뷰 스테이',
  spaceType: '워크앤스테이',
  spaceId: 1,
  scores: [
    { label: '종합 만족도', val: 5 },
    { label: '업무 환경', val: 5 },
    { label: '편의시설', val: 4 },
    { label: '집중도', val: 5 },
  ],
  text: '조용하고 몰입감 있어요. 듀얼모니터도 잘 쓰고 왔습니다. 다음에 팀원들이랑 또 오고 싶어요! 회의실도 넓고 쾌적했고, 와이파이도 빠릿빠릿해서 화상회의도 문제없었어요. 숲 속이라 공기도 너무 좋고 저녁에 산책도 할 수 있어서 좋았습니다.',
  helpful: 24,
  imgs: 3,
  reply: {
    hostName: '청평스테이',
    date: '2026.04.23',
    text: '감사합니다! 다음에도 좋은 시간 보내러 오세요. 언제든 환영합니다 🌲',
  },
};

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
  background: ${({ $color }) => $color};
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
  &:hover {
    border-color: ${COLOR.sage};
    color: ${COLOR.green};
  }
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
  &:hover {
    background: #fff0f0;
  }
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

const ImgRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`;

const ImgSlot = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: ${COLOR.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
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
  &:hover {
    color: ${COLOR.red};
  }
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

function ReviewDetailPage() {
  const navigate = useNavigate();
  const [helped, setHelped] = useState(false);
  const [helpCount, setHelpCount] = useState(DUMMY.helpful);

  const toggleHelp = () => {
    setHelped((v) => !v);
    setHelpCount((c) => (helped ? c - 1 : c + 1));
  };

  const handleDelete = () => {
    const ok = window.confirm(
      '리뷰를 삭제하시겠어요?\n삭제한 리뷰는 복구할 수 없습니다.'
    );
    if (ok) navigate('/user/review');
  };

  const goSpace = () => {
    const path =
      DUMMY.spaceType === '워크앤스테이'
        ? `/workstays/${DUMMY.spaceId}`
        : DUMMY.spaceType === '오피스'
          ? `/coworking-offices/${DUMMY.spaceId}`
          : `/accommodations/${DUMMY.spaceId}`;
    navigate(path);
  };

  return (
    <PageLayout maxWidth={720}>

      {/* 공간 정보 */}
      <SpaceChip onClick={goSpace}>
        <SpaceTag>{DUMMY.spaceType}</SpaceTag>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{DUMMY.space}</span>
        <span
          style={{ fontSize: 12, color: COLOR.gray400, marginLeft: 'auto' }}
        >
          공간 보기 →
        </span>
      </SpaceChip>

      {/* 작성자 + 수정/삭제 버튼 */}
      <ReviewerRow>
        <ReviewerLeft>
          <Avatar $color={DUMMY.avatarColor}>{DUMMY.avatar}</Avatar>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{DUMMY.name}</div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              작성일 {DUMMY.date} · 이용일 {DUMMY.usedDate}
            </div>
          </div>
        </ReviewerLeft>

        {/* 본인 리뷰일 때만 표시 */}
        {DUMMY.isMine && (
          <MyActionBtns>
            <EditBtn onClick={() => navigate(`/user/review/edit/${DUMMY.id}`)}>
              ✏️ 수정
            </EditBtn>
            <DeleteBtn onClick={handleDelete}>🗑 삭제</DeleteBtn>
          </MyActionBtns>
        )}
      </ReviewerRow>

      {/* 항목별 평점 */}
      <ScoreGrid>
        {DUMMY.scores.map((s, i) => (
          <ScoreItem key={i}>
            <ScoreLabel>{s.label}</ScoreLabel>
            <Stars>
              {'★'.repeat(s.val)}
              {'☆'.repeat(5 - s.val)}
            </Stars>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#C97D4C' }}>
              {s.val}.0
            </span>
          </ScoreItem>
        ))}
      </ScoreGrid>

      {/* 리뷰 본문 */}
      <ReviewText>{DUMMY.text}</ReviewText>

      {/* 사진 */}
      {DUMMY.imgs > 0 && (
        <ImgRow>
          {Array(DUMMY.imgs)
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
        {/* 본인 리뷰면 신고 버튼 숨김 */}
        {!DUMMY.isMine && (
          <ReportBtn onClick={() => navigate('/user/review/report')}>
            🚩 신고
          </ReportBtn>
        )}
      </MetaRow>

      {/* 호스트 답글 */}
      {DUMMY.reply && (
        <ReplyBox>
          <ReplyLabel>
            🏠 {DUMMY.reply.hostName} · {DUMMY.reply.date}
          </ReplyLabel>
          <ReplyText>{DUMMY.reply.text}</ReplyText>
        </ReplyBox>
      )}
    </PageLayout>
  );
}

export default ReviewDetailPage;
