import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  border-radius: 16px;
  overflow: hidden;
  height: 420px;

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
`;

const MoreOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
`;

// 나중에 images props 받아서 교체 예정
function DetailImageBox({ icon = '🌴', moreCount = 12 }) {
  return (
    <Grid>
      <MainImg>{icon}</MainImg>
      <SubGrid>
        <SubImg $shade="#E8DFD0">🌿</SubImg>
        <SubImg $shade="#D8E0D0">🚗</SubImg>
        <SubImg $shade="#E0E8D8">🖼️</SubImg>
        <SubImg $shade="#D0D8E0">
          <MoreOverlay>+{moreCount}</MoreOverlay>
        </SubImg>
      </SubGrid>
    </Grid>
  );
}

export default DetailImageBox;
