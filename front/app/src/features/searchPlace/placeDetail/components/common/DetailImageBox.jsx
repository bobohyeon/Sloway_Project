import styled from 'styled-components';

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
  background: #e8dfd0;
  height: 100%;
`;

const SubGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 8px;
`;

const SubImg = styled.div`
  background: ${({ $idx }) =>
    ['#D8E8D8', '#EEF5EE', '#F2EDE4', '#E8DFD0'][$idx] || '#E8DFD0'};
`;

function DetailImageBox() {
  return (
    <Grid>
      <MainImg />
      <SubGrid>
        {[0, 1, 2, 3].map((idx) => (
          <SubImg key={idx} $idx={idx} />
        ))}
      </SubGrid>
    </Grid>
  );
}

export default DetailImageBox;
