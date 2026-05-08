import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SpaceCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #eee;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #768966;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #f1f4ee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
  margin-right: 24px;
  flex-shrink: 0;
`;

const ContentArea = styled.div`
  flex: 1;

  .status-row {
    margin-bottom: 8px;
  }

  h3 {
    font-size: 19px;
    margin: 0 0 10px 0;
    color: #333;
    font-weight: 700;
  }

  .info-row {
    font-size: 13px;
    color: #888;
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;

const StatusTag = styled.span`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  /* 운영 중일 때와 검수 대기일 때의 시각적 구분만 남김 */
  background: ${(props) => (props.$isPending ? '#f5f5f5' : '#76896610')};
  color: ${(props) => (props.$isPending ? '#999' : '#768966')};
  border: 1px solid ${(props) => (props.$isPending ? '#e0e0e0' : '#76896630')};
`;

const RightArea = styled.div`
  text-align: right;
  margin-left: 20px;

  .price-label {
    font-size: 14px;
    color: #999;
    margin-bottom: 4px;
  }

  .price-value {
    font-size: 20px;
    font-weight: 800;
    margin-bottom: 16px;
    color: #333;
  }

  .button-group {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.manage-btn {
    background: white;
    border: 1px solid #ddd;
    color: #666;
    &:hover {
      background: #f9f9f9;
      border-color: #ccc;
    }
  }

  &.image-btn {
    background: #768966;
    border: 1px solid #768966;
    color: white;
    &:hover {
      background: #627254;
      border-color: #627254;
    }
  }
`;

function SpaceListComponent({ data = [] }) {
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', color: '#bbb' }}>
        등록된 공간이 없습니다.
      </div>
    );
  }

  return (
    <>
      {data.map((space) => (
        <SpaceCard
          key={space.id}
          onClick={() => {
            navigate(`/host/space/${space.id}`);
          }}
        >
          <Thumbnail>{space.icon}</Thumbnail>

          <ContentArea>
            <div className="status-row">
              <StatusTag $isPending={space.status === '검수 대기'}>
                {space.status}
              </StatusTag>
            </div>
            <h3>{space.title}</h3>
            <div className="info-row">
              <span>📍 {space.location}</span>
              <span>
                ⭐ {space.rating} ({space.reviews})
              </span>
              <span>• 예약 {space.monthlyBookings}건</span>
            </div>
          </ContentArea>

          <RightArea>
            <div className="price-label">이용 금액</div>
            <div className="price-value">
              {Number(space.price).toLocaleString()}원~
            </div>
            <div className="button-group">
              <ActionButton
                className="image-btn"
                onClick={(evt) => {
                  evt.stopPropagation();
                  navigate(`/host/space/${space.id}/images`);
                }}
              >
                🖼️ 이미지 관리
              </ActionButton>
              <ActionButton
                className="manage-btn"
                onClick={(evt) => {
                  evt.stopPropagation();
                  navigate(`/host/space/${space.id}/edit`);
                }}
              >
                공간 정보 수정
              </ActionButton>
            </div>
          </RightArea>
        </SpaceCard>
      ))}
    </>
  );
}

export default SpaceListComponent;
