import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';

// --- 스타일 컴포넌트 (참고용) ---
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const Card = styled.div`
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ImageBox = styled.div`
  position: relative;
  height: 180px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const HeartBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  color: #ff4d4f;
  background: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 2;
`;

const Content = styled.div`
  padding: 16px;
  .type-tag {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 4px;
  }
  .title {
    font-weight: bold;
    font-size: 1.1rem;
    margin-bottom: 8px;
  }
  .info {
    font-size: 0.9rem;
    color: #444;
    margin-bottom: 12px;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rating {
      font-weight: 500;
    }
    .price {
      font-weight: bold;
      font-size: 1.1rem;
    }
    .unit {
      font-size: 0.8rem;
      color: #888;
      margin-left: 2px;
    }
  }
`;
const WishCardComponent = ({ data, onToggleWish }) => {
  const navigate = useNavigate();

  // 1. 유형별 경로 매핑 (DB의 type 값과 URL 경로를 연결)
  const pathMap = {
    WORK_STAY: 'workstays',
    OFFICE: 'coworking-offices',
    ACCOMMODATION: 'accommodations',
  };

  const handleCardClick = (item) => {
    // 매핑된 경로가 있으면 해당 경로로, 없으면 기본값(예: accommodations) 설정
    const basePath = pathMap[item.type] || 'accommodations';
    navigate(`/${basePath}/${item.id}`);
  };

  return (
    <Grid>
      {data.map((item) => (
        <Card key={item.id} onClick={() => handleCardClick(item)}>
          <ImageBox>
            {item.icon}
            <HeartBadge
              onClick={(e) => {
                e.stopPropagation();
                onToggleWish(item.id);
              }}
            >
              <FaHeart />
            </HeartBadge>
          </ImageBox>

          <Content>
            <div className="type-tag">
              {item.typeLabel} · 찜한 날 {item.wishDate}
            </div>
            <div className="title">{item.title}</div>
            <div className="info">📍 {item.location}</div>
            <div className="price-row">
              <span className="rating">⭐ {item.rating}</span>
              <span className="price">
                {item.price.toLocaleString()}원
                <span className="unit">
                  {item.type === 'OFFICE' ? '1h' : '박'}
                </span>
              </span>
            </div>
          </Content>
        </Card>
      ))}
    </Grid>
  );
};

export default WishCardComponent;
