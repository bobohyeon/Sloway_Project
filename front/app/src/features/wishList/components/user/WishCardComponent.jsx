import React from 'react';
import styled from 'styled-components';
import { FaHeart } from 'react-icons/fa';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #eee;
  transition: transform 0.2s;
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  }
`;

const ImageBox = styled.div`
  width: 100%;
  height: 200px;
  background: #f1f4ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  position: relative;
`;

const HeartBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: white;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d46a4f;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  padding: 18px;

  .type-tag {
    font-size: 11px;
    color: #888;
    margin-bottom: 8px;
  }
  .title {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #333;
  }
  .info {
    font-size: 13px;
    color: #999;
    margin-bottom: 12px;
  }
  .price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f5f5f5;
    padding-top: 12px;

    .rating {
      color: #768966;
      font-weight: 700;
      font-size: 14px;
    }
    .price {
      font-size: 16px;
      font-weight: 800;
      color: #333;
    }
    .unit {
      font-size: 12px;
      color: #999;
      font-weight: 400;
    }
  }
`;

function WishCardComponent({ data, onToggleWish }) {
  return (
    <Grid>
      {data.map((item) => (
        <Card key={item.id}>
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
                  /{item.type === 'OFFICE' ? '4h' : '박'}
                </span>
              </span>
            </div>
          </Content>
        </Card>
      ))}
    </Grid>
  );
}

export default WishCardComponent;
