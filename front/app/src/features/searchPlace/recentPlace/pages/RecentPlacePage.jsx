import { useState } from 'react';
import styled from 'styled-components';
import {
  PageTitle,
  PageSub,
  COLOR,
} from '../../../rsvn/components/user/RsvnStyled';
import RecentCard from '../components/user/RecentCard';

const DUMMY = [
  {
    id: 1,
    type: '워크앤스테이',
    timeAgo: '방금 전',
    title: '청평 숲속 파인뷰 스테이',
    location: '경기 가평',
    rating: 4.9,
    price: 185000,
    icon: '🌲',
  },
  {
    id: 2,
    type: '코워킹오피스',
    timeAgo: '5분 전',
    title: '강릉 바다향 커먼워크',
    location: '강원 강릉',
    rating: 4.8,
    price: 28000,
    icon: '🌊',
  },
  {
    id: 3,
    type: '숙소',
    timeAgo: '2시간 전',
    title: '제주 돌담집 리트릿',
    location: '제주 서귀포',
    rating: 4.9,
    price: 220000,
    icon: '🌴',
  },
  {
    id: 4,
    type: '워크앤스테이',
    timeAgo: '어제',
    title: '남해 올리브 팜스테이',
    location: '경남 남해',
    rating: 4.92,
    price: 165000,
    icon: '✉️',
  },
  {
    id: 5,
    type: '숙소',
    timeAgo: '3일 전',
    title: '양양 파도소리 빌라',
    location: '강원 양양',
    rating: 4.95,
    price: 240000,
    icon: '🌅',
  },
  {
    id: 6,
    type: '코워킹오피스',
    timeAgo: '5일 전',
    title: '성수 브릭라운지',
    location: '서울 성수',
    rating: 4.88,
    price: 25000,
    icon: '🧱',
  },
  {
    id: 7,
    type: '워크앤스테이',
    timeAgo: '1주 전',
    title: '속초 설악 글램스테이',
    location: '강원 속초',
    rating: 4.87,
    price: 210000,
    icon: '⛰️',
  },
];

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

function RecentPlacePage() {
  const [items, setItems] = useState(DUMMY);

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAll = () => {
    setItems([]);
  };

  return (
    <div>
      <PageTitle>최근 본 공간</PageTitle>
      <PageSub>
        최근 조회한 공간 {items.length}개 · 최대 10개까지 표시됩니다
      </PageSub>

      {items.length > 0 ? (
        <>
          <ListHeader>
            <TotalCount>총 {items.length}개</TotalCount>
            <ClearBtn onClick={handleClearAll}>전체 지우기</ClearBtn>
          </ListHeader>
          <CardList>
            {items.map((item) => (
              <RecentCard key={item.id} item={item} onDelete={handleDelete} />
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
    </div>
  );
}

export default RecentPlacePage;
