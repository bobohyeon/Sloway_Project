import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { FaHeart } from 'react-icons/fa';

// --- 스타일 컴포넌트 ---
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const fadeOut = keyframes`
  0% { 
    opacity: 1; 
    transform: scale(1);
    max-height: 500px; /* 카드의 평균 높이보다 크게 설정 */
    margin-bottom: 20px; /* 기존 gap에 대응 */
  }
  100% { 
    opacity: 0; 
    transform: scale(0.9);
    max-height: 0; 
    margin-bottom: 0;
    padding-top: 0;
    padding-bottom: 0;
    border: 0;
  }
`;

const Card = styled.div`
  /* 기존 스타일 유지 */
  background-color : #f8f8f8;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  ${(props) =>
    props.$isDeleting &&
    css`
      animation: ${fadeOut} 0.5s ease-in-out forwards;
      pointer-events: none; /* 애니메이션 도중 클릭 방지 */
    `}
`;
const ImageBox = styled.div`
  position: relative;
  height: 180px;
  background: #eeeeee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

// 수정된 하트 버튼 스타일 (원형/배경 제거)
const HeartButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff4d4f;
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.2s;
  z-index: 2;

  &:hover {
    transform: scale(1.1);
  }
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
    justify-content: flex-end;
    align-items: center;
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
  const [deletingId, setDeletingId] = React.useState(null);
  const navigate = useNavigate();

  const handleRemove = (e, id) => {
    e.stopPropagation();
    setDeletingId(id); // 애니메이션 시작

    // 애니메이션이 끝난 후(0.5초 뒤) 실제 삭제 처리
    setTimeout(() => {
      onToggleWish(id);
      setDeletingId(null);
    }, 500);
  };

  return (
    <Grid>
      {data.map((item) => (
        <Card
          key={item.no}
          $isDeleting={deletingId === item.no} // 삭제 중인지 여부 전달
          onClick={() => navigate(`/spaces/${item.placeNo}/rooms`)}
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

            {/* 수정된 하트 버튼 적용 */}
            <HeartButton onClick={(e) => handleRemove(e, item.no)}>
              <FaHeart />
            </HeartButton>
          </ImageBox>

          <Content>
            <div className="type-tag">
              {item.type} · 찜한 날{' '}
              {item.createdAt
                ? new Date(item.createdAt).toLocaleDateString()
                : ''}
            </div>
            <div className="title">{item.placeTitle}</div>
            <div className="info">📍 {item.address}</div>
            <div className="price-row">
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
