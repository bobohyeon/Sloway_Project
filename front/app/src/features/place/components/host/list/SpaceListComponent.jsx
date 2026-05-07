import React from 'react';
import styled from 'styled-components';

const SpaceCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #eee;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #f1f4ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin-right: 20px;
  flex-shrink: 0;
`;

const ContentArea = styled.div`
  flex: 1;
  .type-status {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
  }
  h3 {
    font-size: 18px;
    margin-bottom: 8px;
    color: #333;
  }
  .info {
    font-size: 13px;
    color: #888;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const Tag = styled.span`
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: ${(props) => (props.type === 'status' ? '#f1f1f1' : '#fff4f0')};
  color: ${(props) => (props.type === 'status' ? '#888' : '#d46a4f')};
  border: 1px solid ${(props) => (props.type === 'status' ? '#ddd' : '#ffedcc')};
`;

const RightArea = styled.div`
  text-align: right;
  .price {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  .actions {
    display: flex;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  background: white;
  font-size: 13px;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
`;

function SpaceListComponent({ data = [] }) {
  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
        해당 카테고리에 등록된 공간이 없습니다.
      </div>
    );
  }

  return (
    <>
      {data.map((space) => (
        <SpaceCard key={space.id}>
          <Thumbnail>{space.icon}</Thumbnail>
          <ContentArea>
            <div className="type-status">
              <Tag>{space.type}</Tag>
              <Tag type="status">{space.status}</Tag>
            </div>
            <h3>{space.title}</h3>
            <div className="info">
              <span>📍 {space.location}</span>
              <span>
                ⭐ {space.rating} ({space.reviews})
              </span>
              <span>• 이번 달 {space.monthlyBookings}건 예약</span>
            </div>
          </ContentArea>
          <RightArea>
            <div className="price">{space.price.toLocaleString()} 원~</div>
            <div className="actions">
              <ActionButton>🖼️ 이미지</ActionButton>
              <ActionButton>📝 수정</ActionButton>
            </div>
          </RightArea>
        </SpaceCard>
      ))}
    </>
  );
}

export default SpaceListComponent;
