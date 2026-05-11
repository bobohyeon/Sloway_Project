import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SpaceCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  border: 1px solid #eee;
  cursor: pointer;
  &:hover {
    border-color: #768966;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

const IconBox = styled.div`
  width: 64px;
  height: 64px;
  background: #f1f4ee;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-right: 20px;
`;

const InfoArea = styled.div`
  flex: 1;
  .type-tag {
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 6px;
    display: inline-block;
    ${({ $type }) =>
      $type === 'STATION'
        ? 'background: #e3f2fd; color: #1976d2;'
        : $type === 'OFFICE'
          ? 'background: #f3e5f5; color: #7b1fa2;'
          : 'background: #e8f5e9; color: #388e3c;'}
  }
  h3 {
    font-size: 18px;
    margin: 0 0 6px 0;
    color: #333;
  }
  p {
    font-size: 14px;
    color: #888;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #ddd;
  background: white;
  &:hover {
    background: #f5f5f5;
    border-color: #ccc;
  }
  &.primary {
    background: #768966;
    color: white;
    border-color: #768966;
  }
`;

function SpaceDetailComponent({ data }) {
  const navigate = useNavigate();

  return (
    <>
      {data.map((space) => (
        <SpaceCard
          key={space.id}
          onClick={() => navigate(`/host/space/${space.id}`)}
        >
          <IconBox>
            {space.type === 'STATION'
              ? '🏠'
              : space.type === 'OFFICE'
                ? '🏢'
                : '🌿'}
          </IconBox>
          <InfoArea $type={space.type}>
            <span className="type-tag">{space.type}</span>
            <h3>{space.title}</h3>
            <p>
              📍 {space.location} | ⭐ {space.rating}
            </p>
          </InfoArea>
          <ButtonGroup>
            <ActionButton
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/host/space/${space.id}/images`);
              }}
            >
              이미지 관리
            </ActionButton>
            <ActionButton
              className="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/host/space/${space.id}/edit`);
              }}
            >
              공간 정보 수정
            </ActionButton>
          </ButtonGroup>
        </SpaceCard>
      ))}
    </>
  );
}
export default SpaceDetailComponent;
