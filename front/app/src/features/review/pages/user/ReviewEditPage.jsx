import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnStatusBadge from '../../../rsvn/components/user/RsvnStatusBadge';
import {
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

import { findOneReview, editReview } from '../../api/reviewApi';

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

function ReviewEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [text, setText] = useState('');
  const [photos, setPhotos] = useState([]);
  const [spaceType, setSpaceType] = useState(null);
  const [spaceName, setSpaceName] = useState(null);
  const [usedDate, setUsedDate] = useState('');
  const fileInputRef = useRef(null);

  // 새 사진 추가 (photos 에 File 객체로 push — 기존 사진은 URL 문자열)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || photos.length >= 5) {
      return;
    }
    setPhotos((p) => [...p, file]);
    e.target.value = '';
  };

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const data = await findOneReview(id);
        setScores([
          data.scoreTotal,
          data.scoreOffice,
          data.scoreAmenity,
          data.scoreFocus,
        ]);
        setText(data.content);
        setSpaceName(data.spaceName);
        setSpaceType(data.spaceType);
        setPhotos(data.imageUrls ?? []);   // 기존 첨부 사진 로드 (응답 필드명: imageUrls)

        const checkIn = data.checkIn?.slice(0, 10).replaceAll('-', '.');
        const checkOut = data.checkOut?.slice(0, 10).replaceAll('-', '.');
        setUsedDate(`${checkIn} ~ ${checkOut}`);
      } catch {
        alert('리뷰 데이터를 불러오지 못했어요');
      }
    };

    fetchReview();
  }, [id]);

  const setScore = (idx, val) => {
    const next = [...scores];
    next[idx] = val;
    setScores(next);
  };

  async function handleSubmit() {
    // 기존 사진(URL 문자열) = 유지 목록 / 새 사진(File 객체) = 업로드 대상 으로 분리
    const keepUrls = photos.filter((p) => typeof p === 'string');
    const newFiles = photos.filter((p) => typeof p !== 'string');

    const formData = new FormData();
    formData.append(
      'dto',
      new Blob(
        [
          JSON.stringify({
            scoreTotal: scores[0],
            scoreOffice: scores[1],
            scoreAmenity: scores[2],
            scoreFocus: scores[3],
            content: text,
            imgUrls: keepUrls, // 유지할 기존 이미지 URL 목록 (여기 없는 기존 사진은 백엔드가 삭제)
          }),
        ],
        { type: 'application/json' }
      )
    );
    newFiles.forEach((file) => formData.append('images', file));

    try {
      await editReview(id, formData);
      navigate('/user/review');
    } catch {
      alert('수정에 실패했어요');
    }
  }

  return (
    <PageLayout
      title="리뷰 수정"
      description="작성한 리뷰를 수정하세요"
      backTo="/user/review"
      backLabel="내 리뷰"
      maxWidth={800}
    >
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
            <RsvnStatusBadge type="type" label={spaceType} />
            <div style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 2px' }}>
              {spaceName}
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              📅 이용일 · {usedDate}
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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {photos.map((photo, i) => (
            <PhotoSlot key={i} $filled style={{ overflow: 'hidden', padding: 0 }}>
              <img
                src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                alt={`리뷰 사진 ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 8,
                }}
              />
              <RemoveBtn
                onClick={() => setPhotos((p) => p.filter((_, j) => j !== i))}
              >
                ✕
              </RemoveBtn>
            </PhotoSlot>
          ))}
          {photos.length < 5 && (
            <PhotoSlot
              onClick={() => fileInputRef.current?.click()}
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
        <BtnOutline onClick={() => navigate('/user/review')}>취소</BtnOutline>
        <BtnPrimary onClick={handleSubmit}>수정 완료</BtnPrimary>
      </BottomBtns>
    </PageLayout>
  );
}

export default ReviewEditPage;
