import React from 'react';
import styled from 'styled-components';
import { FaHotel, FaBriefcase, FaLeaf, FaStar } from 'react-icons/fa';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
  width: 100%;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #eee;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  }
`;

const ImageArea = styled.div`
  width: 100%;
  height: 180px;
  background-color: #f1f4ee; /* 시안 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .fallback-icon {
    font-size: 50px;
    color: #768966;
    opacity: 0.6;
  }
`;

const Content = styled.div`
  padding: 20px;

  .date-row {
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    color: #999;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin: 0 0 15px 0;
  }

  .footer-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid #f5f5f5;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #768966;
    font-weight: 700;
    font-size: 14px;
  }
`;

// 타입에 따른 react-icons 반환 함수
const getTypeIcon = (type) => {
  switch (type) {
    case 'STATION':
      return <FaHotel className="fallback-icon" />;
    case 'OFFICE':
      return <FaBriefcase className="fallback-icon" />;
    case 'WORK_STAY':
      return <FaLeaf className="fallback-icon" />;
    default:
      return <FaHotel className="fallback-icon" />;
  }
};

function SpaceDetailComponent({ data, onCardClick }) {
  return (
    <Grid>
      {data.map((item) => (
        <Card key={item.id} onClick={() => onCardClick(item.id)}>
          <ImageArea>
            {/* 썸네일 이미지가 있으면 이미지를 보여주고, 없으면 아이콘 노출 */}
            {item.thumbnail ? (
              <img src={item.thumbnail} alt={item.title} />
            ) : (
              getTypeIcon(item.type)
            )}
          </ImageArea>

          <Content>
            <div className="date-row">
              등록일 {item.created_at || '2026.05.12'}
            </div>

            <h3>{item.title}</h3>

            <div className="footer-row">
              <div className="rating">
                <FaStar size={14} /> {item.rating}
              </div>
            </div>
          </Content>
        </Card>
      ))}
    </Grid>
  );
}

export default SpaceDetailComponent;
