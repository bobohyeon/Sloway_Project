import React from 'react';
import styled from 'styled-components';
import RecentCard from './recentCard';
import DetailPage from '../../../placeDetail/pages/common/DetailPage';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px; /* 카드 사이 간격 */
`;

// 이미지와 똑같이 보이기 위한 임시 더미 데이터
const DUMMY_DATA = [
  {
    id: 1,
    type: '워크앤스테이',
    timeAgo: '방금 전',
    title: '청평 숲속 파인뷰 스테이',
    location: '경기 가평',
    rating: 4.9,
    price: '185,000',
    icon: '🌲',
  },
  {
    id: 2,
    type: '코워킹오피스',
    timeAgo: '5분 전',
    title: '강릉 바다향 커먼워크',
    location: '강원 강릉',
    rating: 4.8,
    price: '28,000',
    icon: '🌊',
  },
  {
    id: 3,
    type: '숙소',
    timeAgo: '2시간 전',
    title: '제주 돌담집 리트릿',
    location: '제주 서귀포',
    rating: 4.9,
    price: '220,000',
    icon: '🌴',
  },
  {
    id: 4,
    type: '워크앤스테이',
    timeAgo: '어제',
    title: '남해 올리브 팜스테이',
    location: '경남 남해',
    rating: 4.92,
    price: '165,000',
    icon: '✉️',
  },
  {
    id: 5,
    type: '숙소',
    timeAgo: '3일 전',
    title: '양양 파도소리 빌라',
    location: '강원 양양',
    rating: 4.95,
    price: '240,000',
    icon: '🌅',
  },
  {
    id: 6,
    type: '코워킹오피스',
    timeAgo: '5일 전',
    title: '성수 브릭라운지',
    location: '서울 성수',
    rating: 4.88,
    price: '25,000',
    icon: '🧱',
  },
  {
    id: 7,
    type: '워크앤스테이',
    timeAgo: '1주 전',
    title: '속초 설악 글램스테이',
    location: '강원 속초',
    rating: 4.87,
    price: '210,000',
    icon: '⛰️',
  },
];

function RecentCardList() {
  return (
    <ListContainer>
      {DUMMY_DATA.map((item) => (
        <RecentCard key={item.id} data={item} />
      ))}
    </ListContainer>
  );
}

export default RecentCardList;
