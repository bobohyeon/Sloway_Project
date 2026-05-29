import React from 'react';
import styled from 'styled-components';
import { FaHotel, FaBriefcase, FaLeaf, FaStar } from 'react-icons/fa';
import { STATUS_TEXT } from '../../../../hooks/host/place/useSpaceList';
import RejectButtonWithModal from '../../approvalCheck/RejectButtonWithModal';

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
  background-color: #f1f4ee;
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

  /* 상단 영역을 감싸는 컨테이너 추가 */
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .date-row {
    font-size: 12px;
    color: #999;
    /* margin-bottom은 header-row가 담당하므로 삭제 */
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

// [💡 추가] 데이터가 비어있을 때 노출할 센터링 문구 스타일
const EmptyMessage = styled.div`
  grid-column: 1 / -1; /* 그리드 전체 칸을 가로질러 채우기 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #999;
  font-size: 16px;
  font-weight: 500;
  background: #fafbfa;
  border-radius: 20px;
  border: 1px dashed #e2e8dd;
`;

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

// 상위 페이지에서 넘겨받을 헬퍼 함수(getTypeLabel) 추가 적용이 가능하도록 구조 열어둠
function SpaceDetailComponent({ data = [], onCardClick, typeLabel }) {
  if (
    !data ||
    data.length === 0 ||
    (data.length === 1 && !data[0].id && !data[0].title)
  ) {
    return <EmptyMessage>아직 등록된 {typeLabel}이(가) 없습니다.</EmptyMessage>;
  }

  return (
    <Grid>
      {data.map((item) => (
        <Card key={item.id} onClick={() => onCardClick(item.id)}>
          <ImageArea>
            {item.thumbnail ? (
              <img src={item.thumbnail} alt={item.title} />
            ) : (
              getTypeIcon(item.type)
            )}
          </ImageArea>

          <Content>
            <div className="header-row">
              <StatusTag $status={item.status}>
                {STATUS_TEXT[item.status] || item.status}
              </StatusTag>
              {item.status === 'R' && (
                <RejectButtonWithModal no={item.id} type={item.type} />
              )}
            </div>
            <div className="date-row">
              등록일 {item.created_at || '2026.05.12'}
            </div>

            <h3>{item.title || '이름 없음'}</h3>

            <div className="footer-row">
              <div className="rating">
                <FaStar size={14} /> {item.rating || 0}
              </div>
            </div>
          </Content>
        </Card>
      ))}
    </Grid>
  );
}

export default SpaceDetailComponent;
