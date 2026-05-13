import { useState } from 'react';
import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-radius: 16px;
  overflow: hidden;
  height: 420px;
  cursor: pointer;
  @media (max-width: 768px) {
    height: 260px;
  }
`;

const MainImg = styled.div`
  background: ${COLOR.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 80px;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const SubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
`;

const SubImg = styled.div`
  background: ${({ $shade }) => $shade || COLOR.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  position: relative;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const MoreOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
`;

// ── 모달 (전체 사진 보기) ──────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModalHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
`;

const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  font-size: 22px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }
`;

const ModalBody = styled.div`
  width: 100%;
  max-width: 860px;
  padding: 70px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  overflow-y: auto;
  max-height: 100vh;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
  }
`;

const ModalImg = styled.div`
  width: 100%;
  height: 300px;
  border-radius: 12px;
  background: ${({ $shade }) => $shade || COLOR.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 72px;
`;

const ModalImgLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: -6px;
  align-self: flex-start;
`;

// 최대 10장 더미 (백엔드 연결 시 images[] props로 교체)
const DUMMY_IMGS = [
  { emoji: '🌿', shade: '#E8DFD0', label: '외관' },
  { emoji: '🚗', shade: '#D8E0D0', label: '주차장' },
  { emoji: '🖼️', shade: '#E0E8D8', label: '거실' },
  { emoji: '🛏', shade: '#D0D8E0', label: '침실 1' },
  { emoji: '🛁', shade: '#E8E0D8', label: '욕실' },
  { emoji: '🍳', shade: '#D8E8E0', label: '주방' },
  { emoji: '💻', shade: '#E0D8E8', label: '업무 공간' },
  { emoji: '🌅', shade: '#E8D8D0', label: '테라스 뷰' },
  { emoji: '🪴', shade: '#D8E0D8', label: '정원' },
  { emoji: '🌙', shade: '#D0D0E8', label: '야경' },
];

function DetailImageBox({ icon = '🌴' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Grid onClick={() => setOpen(true)}>
        <MainImg>{icon}</MainImg>
        <SubGrid>
          {DUMMY_IMGS.slice(0, 3).map((img, i) => (
            <SubImg key={i} $shade={img.shade}>
              {img.emoji}
            </SubImg>
          ))}
          <SubImg $shade={DUMMY_IMGS[3].shade}>
            {DUMMY_IMGS[3].emoji}
            <MoreOverlay>+{DUMMY_IMGS.length - 4}장 더보기</MoreOverlay>
          </SubImg>
        </SubGrid>
      </Grid>

      {open && (
        <Overlay onClick={() => setOpen(false)}>
          <ModalHeader>
            <span style={{ fontWeight: 600, fontSize: 15 }}>
              사진 {DUMMY_IMGS.length + 1}장
            </span>
            <CloseBtn onClick={() => setOpen(false)}>✕</CloseBtn>
          </ModalHeader>
          <ModalBody onClick={(e) => e.stopPropagation()}>
            {/* 메인 이미지 */}
            <ModalImg $shade={COLOR.cream}>{icon}</ModalImg>
            <ModalImgLabel>대표 사진</ModalImgLabel>
            {/* 나머지 10장 */}
            {DUMMY_IMGS.map((img, i) => (
              <div key={i} style={{ width: '100%' }}>
                <ModalImg $shade={img.shade}>{img.emoji}</ModalImg>
                <ModalImgLabel>{img.label}</ModalImgLabel>
              </div>
            ))}
          </ModalBody>
        </Overlay>
      )}
    </>
  );
}

export default DetailImageBox;
