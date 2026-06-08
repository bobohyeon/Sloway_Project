import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaHotel, FaBriefcase, FaLeaf, FaImage } from 'react-icons/fa';
// 훅에서 선언해둔 한글 치환 매핑 테이블 가져오기
import { STATUS_TEXT } from '../../../hooks/host/place/useSpaceList';
import RejectButtonWithModal from '../approvalCheck/RejectButtonWithModal';

const SpaceCard = styled.div`
  background: white;
  border-radius: 15px;
  border: 1px solid #eee;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: #768966;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  }
`;

const ThumbnailArea = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: #f1f4ee;
  margin-right: 24px;
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .fallback-icon {
    font-size: 24px;
    color: #bcaaa4;
  }
`;

const ContentArea = styled.div`
  flex: 1;

  .status-row {
    margin-bottom: 8px;
    display: flex;
    gap: 6px;
    align-items: center;
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

// [수정] PENDING, APPROVED, REJECTED 상태별로 색상이 명확하게 분기되도록 리팩토링
const StatusTag = styled.span`
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid;

  ${({ $status }) => {
    switch ($status) {
      case 'P': // 검수 대기 (그레이 계열)
        return `
          background: #f5f5f5;
          color: #888888;
          border-color: #e0e0e0;
        `;
      case 'R': // 반려됨 (붉은 계열)
        return `
          background: #ffebee;
          color: #c62828;
          border-color: #ffcdd2;
        `;
      case 'A': // 운영 중 (시그니처 그린 계열)
      default:
        return `
          background: #76896610;
          color: #768966;
          border-color: #76896630;
        `;
    }
  }}
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

  /* 비활성화 시 공통 스타일 */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7; /* 약간 흐리게 */
  }

  &.manage-btn {
    background: white;
    border: 1px solid #ddd;
    color: #666;
    &:hover {
      background: #f9f9f9;
      border-color: #ccc;
    }
    /* 비활성화 시 관리 버튼 색상 */
    &:disabled {
      background: #f3f3f3;
      color: #ccc;
      border-color: #e0e0e0;
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
    /* 비활성화 시 이미지 버튼 색상 */
    &:disabled {
      background: #8e9e90;
      border-color: #ccc;
    }
  }
`;

const TypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.02em;

  ${({ $type }) => {
    switch ($type) {
      case 'STATION':
        return `background-color: #e3f2fd; color: #1976d2;`;
      case 'OFFICE':
        return `background-color: #f3e5f5; color: #7b1fa2;`;
      case 'WORK_STAY':
        return `background-color: #e8f5e9; color: #2e7d32;`;
      default:
        return `background-color: #f5f5f5; color: #616161;`;
    }
  }}
`;

const getTypeInfo = (type) => {
  switch (type) {
    case 'STATION':
      return { label: '숙소', icon: <FaHotel size={12} /> };
    case 'OFFICE':
      return { label: '오피스', icon: <FaBriefcase size={12} /> };
    case 'WORK_STAY':
      return { label: '워크앤스테이', icon: <FaLeaf size={12} /> };
    default:
      return { label: type, icon: null };
  }
};

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
      {data.map((space) => {
        const { label, icon } = getTypeInfo(space.type);

        return (
          <SpaceCard
            key={space.id}
            onClick={() => navigate(`/host/space/${space.id}`)}
          >
            {/* [수정] S3 주소가 들어간 이미지 바인딩 처리 (없으면 대체 아이콘 노출) */}
            <ThumbnailArea>
              {space.thumbnail ? (
                <img src={space.thumbnail} alt={space.title} />
              ) : (
                <FaImage className="fallback-icon" />
              )}
            </ThumbnailArea>

            <ContentArea>
              <div className="status-row">
                <TypeBadge $type={space.type}>
                  {icon}
                  {label}
                </TypeBadge>

                <StatusTag $status={space.status}>
                  {STATUS_TEXT[space.status] || space.status}
                </StatusTag>
                {space.status === 'R' && (
                  <RejectButtonWithModal no={space.id} type={'place'} />
                )}
              </div>

              <h3>{space.title}</h3>
              <div className="info-row">
                <span>📍 {space.location}</span>
                <span>
                  ⭐ {Number(space.rating).toFixed(1)} ({space.reviews}개)
                </span>
                <span>• 당월 예약 {space.monthlyBookings}건</span>
              </div>
            </ContentArea>

            <RightArea>
              <div className="price-label">최저 이용 금액</div>
              <div className="price-value">
                {space.price > 0
                  ? `${Number(space.price).toLocaleString()}원~`
                  : '가격 미등록'}
              </div>
              <div className="button-group">
                <ActionButton
                  className="image-btn"
                  disabled={space.status === 'P'}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    navigate(`/host/space/${space.id}/images`);
                  }}
                >
                  🖼️ 이미지 관리
                </ActionButton>
                <ActionButton
                  className="manage-btn"
                  disabled={space.status === 'P'}
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
        );
      })}
    </>
  );
}

export default SpaceListComponent;
