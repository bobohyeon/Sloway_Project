import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RsvnStatusBadge from '../../../rsvn/components/user/RsvnStatusBadge';
import {
  PageTitle,
  PageSub,
  BackLink,
  BtnPrimary,
  BtnOutline,
  SectionBox,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import {
  FormBox,
  FormLabel,
  Req,
  Textarea,
} from '../../components/user/ReviewStyled';

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
  font-size: ${({ $filled }) => ($filled ? 28 : 20)}px;
  color: ${COLOR.gray400};
  font-size: 11px;
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

const CautionBox = styled.div`
  background: #fff8f0;
  border: 1px solid #ffd9b0;
  border-left: 3px solid ${COLOR.terra};
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
  font-size: 12px;
  color: #666;
  line-height: 1.7;
`;

const AgreeBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${COLOR.gray600};
  margin-bottom: 20px;
`;

const BottomBtns = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const CharCount = styled.div`
  text-align: right;
  font-size: 11px;
  color: ${COLOR.gray400};
  margin-top: 4px;
`;

function ReviewWritePage() {
  const navigate = useNavigate();
  const [scores, setScores] = useState([4, 5, 3, 4]);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([true, true]);

  const setScore = (idx, val) => {
    const next = [...scores];
    next[idx] = val;
    setScores(next);
  };

  return (
    <div>
      <PageTitle>리뷰 작성</PageTitle>
      <PageSub>솔직한 후기로 다른 회원에게 도움을 주세요</PageSub>
      <BackLink onClick={() => navigate('/user/review')}>← 내 리뷰</BackLink>

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
            <RsvnStatusBadge type="type" label="워크앤스테이" />
            <div style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 2px' }}>
              청평 숲속 파인뷰 스테이
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              📅 이용일 · 2026.04.18 ~ 2026.04.20
            </div>
          </div>
        </div>
      </FormBox>

      <FormBox>
        <FormLabel>
          평점 <Req>*</Req>
        </FormLabel>
        <div style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 14 }}>
          각 항목별로 만족도를 남겨주세요
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

      <FormBox>
        <FormLabel>
          사진 첨부{' '}
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
                onClick={() => setPhotos((p) => p.filter((__, j) => j !== i))}
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

      <FormBox>
        <FormLabel>
          리뷰 내용 <Req>*</Req>
        </FormLabel>
        <div style={{ fontSize: 12, color: COLOR.gray400, marginBottom: 10 }}>
          경험하신 장점·단점을 자유롭게 적어주세요 (최소 10자)
        </div>
        <Textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="어떤 점이 좋았나요? 어떤 점이 아쉬웠나요? 다른 회원에게 추천하고 싶은 포인트는?"
        />
        {text.length < 10 && text.length > 0 && (
          <div style={{ fontSize: 11, color: COLOR.orange, marginTop: 4 }}>
            최소 10자 더 필요해요
          </div>
        )}
        <CharCount>{text.length} / 2000</CharCount>
      </FormBox>

      <CautionBox>
        <strong style={{ color: COLOR.terra }}>⚠️ 허위 신고 시</strong>
        <br />
        이용 제한 조치가 있을 수 있어요. 신고 정보는 비공개로 처리되며,
        피신고자에게 공개되지 않습니다.
      </CautionBox>

      <AgreeBox>
        <input type="checkbox" id="agree" />
        <label htmlFor="agree">
          * 위 내용을 확인했으며, 허위 리뷰 작성 시 제재를 받을 수 있음에
          동의합니다
        </label>
      </AgreeBox>

      <BottomBtns>
        <BtnOutline onClick={() => navigate('/user/review')}>취소</BtnOutline>
        <BtnPrimary>리뷰 등록</BtnPrimary>
      </BottomBtns>
    </div>
  );
}

export default ReviewWritePage;
