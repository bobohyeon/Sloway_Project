import { useState } from 'react';
import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 6fr 3.5fr 0.5fr;
  gap: 8px;
  border-radius: 16px;
  overflow: hidden;
  width: 100%;
  max-width: 1200px;
  height: 420px;
  @media (max-width: 768px) {
    height: 260px;
  }
`;

const MainImg = styled.div`
  background: ${COLOR.cream};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const SubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
`;

const SubImg = styled.div`
  background: ${({ $shade }) => $shade || COLOR.cream};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;


const NavPanel = styled.div`
  background: ${COLOR.cream};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const NavBtn = styled.button`
  background: rgba(40, 40, 40, 0.72);
  border: 1.5px solid rgba(0, 0, 0, 0.45);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover:not(:disabled) {
    background: rgba(20, 20, 20, 0.88);
  }
  &:disabled {
    opacity: 0.25;
    cursor: default;
  }
`;

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
  position: relative;
  overflow: hidden;
`;

const ModalImgLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: -6px;
  align-self: flex-start;
`;

const SHADES = [
  '#E8DFD0',
  '#D8E0D0',
  '#E0E8D8',
  '#D0D8E0',
  '#E8E0D8',
  '#D8E8E0',
  '#E0D8E8',
  '#E8D8D0',
  '#D8E0D8',
  '#D0D0E8',
];

const IMG_STYLE = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

function DetailImageBox({ icon = '🌴', images = [] }) {
  const [open, setOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const hasImages = images.length > 0;
  const total = hasImages ? images.length : 1;

  const prev = (e) => {
    e.stopPropagation();
    setCurrentIdx((i) => (i - 1 + total) % total);
  };
  const next = (e) => {
    e.stopPropagation();
    setCurrentIdx((i) => (i + 1) % total);
  };

  const getImg = (offset) => (hasImages ? images[(currentIdx + offset) % total] : null);
  const shade = (offset) => SHADES[(currentIdx + offset) % SHADES.length];

  return (
    <>
      <Grid>
        {/* 6fr: 메인 이미지 */}
        <MainImg onClick={() => setOpen(true)}>
          {getImg(0) ? (
            <img src={getImg(0)} alt="대표" style={IMG_STYLE} />
          ) : (
            icon
          )}
        </MainImg>

        {/* 3.5fr: 서브 이미지 2장 (위/아래) */}
        <SubGrid>
          <SubImg $shade={shade(1)} onClick={() => setOpen(true)}>
            {getImg(1) && <img src={getImg(1)} alt="" style={IMG_STYLE} />}
          </SubImg>
          <SubImg $shade={shade(2)} onClick={() => setOpen(true)}>
            {getImg(2) && <img src={getImg(2)} alt="" style={IMG_STYLE} />}
          </SubImg>
        </SubGrid>

        {/* 0.5fr: 이전/다음 네비게이션 */}
        <NavPanel>
          <NavBtn onClick={prev}>‹</NavBtn>
          <span style={{ fontSize: 10, color: COLOR.gray400 || '#999' }}>
            {currentIdx + 1}/{total}
          </span>
          <NavBtn onClick={next}>›</NavBtn>
        </NavPanel>
      </Grid>

      {open && (
        <Overlay onClick={() => setOpen(false)}>
          <ModalHeader>
            <span style={{ fontWeight: 600, fontSize: 15 }}>
              사진 {hasImages ? images.length : 0}장
            </span>
            <CloseBtn onClick={() => setOpen(false)}>✕</CloseBtn>
          </ModalHeader>
          <ModalBody onClick={(e) => e.stopPropagation()}>
            {hasImages ? (
              images.map((url, i) => (
                <div key={i} style={{ width: '100%' }}>
                  <ModalImg $shade={SHADES[i % SHADES.length]}>
                    <img src={url} alt="" style={IMG_STYLE} />
                  </ModalImg>
                  <ModalImgLabel>사진 {i + 1}</ModalImgLabel>
                </div>
              ))
            ) : (
              <ModalImg $shade={COLOR.cream}>{icon}</ModalImg>
            )}
          </ModalBody>
        </Overlay>
      )}
    </>
  );
}

export default DetailImageBox;
