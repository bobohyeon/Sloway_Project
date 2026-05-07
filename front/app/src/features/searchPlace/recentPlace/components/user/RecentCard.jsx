import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// --- Styled Components ---
const CardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #eaeaea;
  border-radius: 12px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ImageBox = styled.div`
  width: 70px;
  height: 70px;
  background-color: #f5f5f5;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px; /* 이모지를 아이콘처럼 사용 */
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TypeTag = styled.span`
  background-color: rgba(168, 184, 159, 0.15); /* #A8B89F를 연하게 섞은 배경 */
  color: #6a7a61; /* #A8B89F보다 약간 짙은 글씨 */
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
`;

const TimeAgo = styled.span`
  font-size: 12px;
  color: #999;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
`;

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #ff8a00; /* 별점 오렌지색 */
  font-weight: 600;
`;

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`;

const PriceText = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #333;

  span {
    font-size: 13px;
    font-weight: 400;
    color: #666;
  }
`;

const DeleteButton = styled.button`
  background-color: #f5f5f5;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #eaeaea;
    color: #333;
  }
`;

// --- Component ---
function RecentCard({ data }) {
  const navi = useNavigate();

  const handleCardClick = () => {
    navi(`/detail/${data.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    console.log(`Delete item ${data.id}`);
  };

  return (
    <CardWrapper onClick={handleCardClick}>
      <LeftContent>
        <ImageBox>{data.icon}</ImageBox>
        <InfoBox>
          <TopRow>
            <TypeTag>{data.type}</TypeTag>
            <TimeAgo>{data.timeAgo}</TimeAgo>
          </TopRow>
          <Title>{data.title}</Title>
          <BottomRow>
            <span>📍 {data.location}</span>
            <span>·</span>
            <RatingWrapper>
              ★ <span>{data.rating}</span>
            </RatingWrapper>
          </BottomRow>
        </InfoBox>
      </LeftContent>

      <RightContent>
        <PriceText>
          {data.price}
          <span>원~</span>
        </PriceText>
        <DeleteButton onClick={handleDelete}>✕</DeleteButton>
      </RightContent>
    </CardWrapper>
  );
}

export default RecentCard;
