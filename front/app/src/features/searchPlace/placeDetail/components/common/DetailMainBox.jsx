import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // FaRegHeart 추가

// --- 기존 스타일 유지 및 ActionBtn 추가 ---
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

// 주신 ActionBtn 스타일 적용
const HeartBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e8dfd0;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 2;

  /* 찜한 상태일 때의 스타일 */
  color: #e65100;
  border-color: #e65100;
  background: #fff3e0;

  &:hover {
    background: #ffeccf;
    border-color: #e65100;
  }
`;

const Content = styled.div`
  padding: 16px;
  /* ... 기존 컨텐츠 스타일 동일 ... */
`;

const WishCardComponent = ({ data, onToggleWish }) => {
  const navigate = useNavigate();

  const pathMap = {
    WORK_STAY: 'workstays',
    OFFICE: 'coworking-offices',
    STATION: 'stations',
  };

  return (
    <Grid>
      {data.map((item) => (
        <Card
          key={item.no}
          onClick={() =>
            navigate(`/${pathMap[item.type] || 'accommodations'}/${item.no}`)
          }
        >
          <ImageBox>
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.placeTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              '🏠'
            )}

            {/* 개선된 하트 버튼 */}
            <HeartBtn
              onClick={(e) => {
                e.stopPropagation();
                onToggleWish(item.no);
              }}
            >
              <FaHeart />
            </HeartBtn>
          </ImageBox>

          <Content>
            <div className="type-tag">{item.type}</div>
            <div className="title">{item.placeTitle}</div>
            <div className="info">📍 {item.address}</div>
            <div className="price-row">
              <span className="rating">⭐ {item.rating}</span>
              <span className="price">
                {item.price?.toLocaleString()}원
                <span className="unit">
                  {item.type === 'OFFICE' ? ' /시간' : ' /박'}
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
