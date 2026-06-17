import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { COLOR } from '../../../rsvn/components/user/RsvnStyled';
import RecentCard from '../components/user/RecentCard';
import {
  findRecentViewed,
  deleteRecentViewed,
  deleteAllRecentViewed,
} from '../api/recentApi';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const TotalCount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #555;
`;

const ClearBtn = styled.button`
  font-size: 13px;
  color: ${COLOR.sage};
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: #6a7a61;
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyBox = styled.div`
  text-align: center;
  padding: 60px 0;
  color: ${COLOR.gray400};
  font-size: 14px;
`;

// spaceType → 라우트 경로 매핑
const SPACE_PATH = {
  WORK_STAY: 'workstays',
  OFFICE: 'coworking-offices',
  STATION: 'stations',
};

const TYPE_ICON = { WORK_STAY: '🌿', OFFICE: '💻', STATION: '🛌' };

// viewAt(LocalDateTime) → "방금 전", "5분 전" 등 상대 시간 문자열
function timeAgo(viewAt) {
  if (!viewAt) return '';
  const diff = Math.floor((Date.now() - new Date(viewAt).getTime()) / 1000);
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return `${Math.floor(diff / 604800)}주 전`;
}

// RecentViewedResDto → RecentCard 호환 객체
function toRecentCard(dto) {
  return {
    id: dto.no, // 삭제 시 사용하는 키
    placeNo: dto.placeNo,
    entityNo: dto.entityNo, // 공간 상세 페이지 이동에 사용
    type: dto.type,
    title: dto.title,
    location: dto.address,
    timeAgo: timeAgo(dto.viewAt),
    rating: null, // ResDto에 평점 없음
    price: null, // ResDto에 가격 없음
    icon: TYPE_ICON[dto.type] ?? '🏠',
    thumbnailUrl: dto.thumbnailUrl ?? null,
  };
}

function RecentPlacePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    findRecentViewed()
      .then((data) => setItems(data.map(toRecentCard)))
      .catch((e) => console.error(e));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteRecentViewed(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      alert('삭제에 실패했어요');
    }
  };

  const handleClearAll = async () => {
    try {
      await deleteAllRecentViewed();
      setItems([]);
    } catch {
      alert('전체 삭제에 실패했어요');
    }
  };

  const handleCardClick = (item) => {
    const path = SPACE_PATH[item.type] || 'workstays';
    navigate(`/${path}/${item.placeNo}`);
  };

  return (
    <PageLayout title="최근 본 공간" maxWidth={1200}>
      {items.length > 0 ? (
        <>
          <ListHeader>
            <TotalCount>총 {items.length}개</TotalCount>
            <ClearBtn onClick={handleClearAll}>전체 지우기</ClearBtn>
          </ListHeader>
          <CardList>
            {items.map((item) => (
              <RecentCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onClick={handleCardClick}
              />
            ))}
          </CardList>
        </>
      ) : (
        <EmptyBox>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🕐</div>
          <div>최근 본 공간이 없어요</div>
          <div style={{ fontSize: 12, marginTop: 6 }}>
            공간 상세 페이지를 방문하면 여기에 표시돼요
          </div>
        </EmptyBox>
      )}
    </PageLayout>
  );
}

export default RecentPlacePage;
