import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import RsvnStatusBadge from '../../../rsvn/components/user/RsvnStatusBadge';
import {
  PageTitle,
  PageSub,
  BackLink,
  BtnPrimary,
  BtnOutline,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import {
  FormBox,
  FormLabel,
  Req,
  Textarea,
} from '../../components/user/ReviewStyled';

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

const SCORE_ITEMS = [
  { icon: '🌟', label: '종합 만족도', desc: '전반적인 만족도는 어떠셨나요?' },
  { icon: '💻', label: '업무 환경', desc: '일하기에 편한 환경이었나요?' },
  { icon: '🏠', label: '편의 시설', desc: '편의 시설은 만족스러웠나요?' },
  { icon: '🎯', label: '집중도', desc: '조용하고 몰입할 수 있었나요?' },
];

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
  border-bottom: 1px solid ${COLOR.gray200};
  &:last-child {
    border-bottom: none;
  }
`;

const ScoreLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ScoreIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${COLOR.cream};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const StarInput = styled.div`
  display: flex;
  gap: 4px;
  cursor: pointer;
`;

const Star = styled.span`
  font-size: 24px;
  color: ${({ $on }) => ($on ? '#C97D4C' : '#DDD')};
  transition: color 0.1s;
`;

const PhotoGrid = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const PhotoSlot = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  background: ${({ $filled }) => ($filled ? '#E8DFD0' : '#fff')};
  border: ${({ $filled }) =>
    $filled ? 'none' : `1.5px dashed ${COLOR.gray200}`};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
  position: relative;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #333;
  color: #fff;
  border: none;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 11px;
  color: ${COLOR.gray400};
  margin-top: 4px;
`;

const BottomBtns = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

// 기존 리뷰 데이터 — 백엔드 연결 시 useParams id로 fetch
const EXISTING = {
  space: '청평 숲속 파인뷰 스테이',
  spaceType: '워크앤스테이',
  usedDate: '2026.04.18 ~ 2026.04.20',
  scores: [5, 5, 4, 5],
  text: '조용하고 몰입감 있어요. 듀얼모니터도 잘 쓰고 왔습니다.',
  photos: [true, true, true],
};

function ReviewEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [scores, setScores] = useState(EXISTING.scores);
  const [text, setText] = useState(EXISTING.text);
  const [photos, setPhotos] = useState(EXISTING.photos);

  const setScore = (idx, val) => {
    const next = [...scores];
    next[idx] = val;
    setScores(next);
  };

  const handleSubmit = () => {
    alert('구현예정 💕💕');
    navigate('/user/review');
  };

  return (
    <Page>
      <PageTitle>리뷰 수정</PageTitle>
      <PageSub>작성한 리뷰를 수정하세요</PageSub>
      <BackLink onClick={() => navigate(-1)}>← 뒤로</BackLink>

      {/* 공간 정보 */}
      <FormBox>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: COLOR.cream,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            🌲
          </div>
          <div>
            <RsvnStatusBadge type="type" label={EXISTING.spaceType} />
            <div style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 2px' }}>
              {EXISTING.space}
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              📅 이용일 · {EXISTING.usedDate}
            </div>
          </div>
        </div>
      </FormBox>

      {/* 평점 */}
      <FormBox>
        <FormLabel>
          평점 <Req>*</Req>
        </FormLabel>
        <div style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 14 }}>
          각 항목별로 만족도를 수정하세요
        </div>
        {SCORE_ITEMS.map((item, idx) => (
          <ScoreRow key={idx}>
            <ScoreLeft>
              <ScoreIcon>{item.icon}</ScoreIcon>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {item.label}
                </div>
                <div
                  style={{ fontSize: 11, color: COLOR.gray400, marginTop: 1 }}
                >
                  {item.desc}
                </div>
              </div>
            </ScoreLeft>
            <StarInput>
              {[1, 2, 3, 4, 5].map((v) => (
                <Star
                  key={v}
                  $on={v <= scores[idx]}
                  onClick={() => setScore(idx, v)}
                >
                  ★
                </Star>
              ))}
            </StarInput>
          </ScoreRow>
        ))}
      </FormBox>

      {/* 사진 */}
      <FormBox>
        <FormLabel>
          사진{' '}
          <span style={{ fontSize: 12, color: COLOR.gray400, fontWeight: 400 }}>
            (선택)
          </span>
        </FormLabel>
        <div style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 10 }}>
          최대 5장까지 업로드 가능해요
        </div>
        <PhotoGrid>
          {photos.map((_, i) => (
            <PhotoSlot key={i} $filled>
              <span style={{ fontSize: 28 }}>📷</span>
              <RemoveBtn
                onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
              >
                ✕
              </RemoveBtn>
            </PhotoSlot>
          ))}
          {photos.length < 5 && (
            <PhotoSlot
              onClick={() => setPhotos((p) => [...p, true])}
              style={{ fontSize: 11 }}
            >
              <span style={{ fontSize: 20 }}>+</span>
              <span style={{ color: COLOR.gray400 }}>
                사진 추가
                <br />
                {photos.length}/5
              </span>
            </PhotoSlot>
          )}
        </PhotoGrid>
      </FormBox>

      {/* 리뷰 내용 */}
      <FormBox>
        <FormLabel>
          리뷰 내용 <Req>*</Req>
        </FormLabel>
        <Textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="어떤 점이 좋았나요? 어떤 점이 아쉬웠나요?"
        />
        {text.length > 0 && text.length < 10 && (
          <div style={{ fontSize: 11, color: COLOR.orange, marginTop: 4 }}>
            최소 10자 더 필요해요
          </div>
        )}
        <CharCount>{text.length} / 2000</CharCount>
      </FormBox>

      <BottomBtns>
        <BtnOutline onClick={() => navigate(-1)}>취소</BtnOutline>
        <BtnPrimary onClick={handleSubmit}>수정 완료</BtnPrimary>
      </BottomBtns>
    </Page>
  );
}

export default ReviewEditPage;
