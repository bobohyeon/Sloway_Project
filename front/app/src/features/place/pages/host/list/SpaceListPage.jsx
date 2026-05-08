import React, { useState } from 'react';
import SpaceListLayout from '../../../layouts/host/list/SpaceListLayout';
import SpaceSummaryComponent from '../../../components/host/list/SpaceSummaryComponent';
import SpaceListComponent from '../../../components/host/list/SpaceListComponent';

function SpaceListPage() {
  // 유형 구분이 없으므로 탭 상태를 제거하거나 '전체'로 고정할 수 있습니다.
  const [spaces, setSpaces] = useState([
    {
      id: 101,
      status: '운영 중',
      title: '청평 숲속 파인뷰 스테이',
      location: '경기 가평',
      rating: '4.9',
      reviews: '127',
      monthlyBookings: 8,
      price: 185000,
      icon: '🌲',
    },
    {
      id: 202,
      status: '운영 중',
      title: '성수 브릭라운지',
      location: '서울 성수',
      rating: '4.88',
      reviews: '312',
      monthlyBookings: 24,
      price: 25000,
      icon: '🧱',
    },
    {
      id: 303,
      status: '검수 대기',
      title: '제주 돌담집 리트릿',
      location: '제주 서귀포',
      rating: '4.9',
      reviews: '89',
      monthlyBookings: 5,
      price: 220000,
      icon: '🏝️',
    },
    {
      id: 304,
      status: '검수 대기',
      title: '제주 돌담집 리트릿',
      location: '제주 서귀포',
      rating: '4.9',
      reviews: '89',
      monthlyBookings: 5,
      price: 220000,
      icon: '🏝️',
    },
    {
      id: 305,
      status: '운영 중',
      title: '제주 돌담집 리트릿',
      location: '제주 서귀포',
      rating: '4.9',
      reviews: '89',
      monthlyBookings: 5,
      price: 220000,
      icon: '🏝️',
    },
  ]);

  // 유형 정보가 없으므로 카운트는 전체 개수만 전달하거나 레이아웃에 맞춰 단순화합니다.
  const counts = {
    전체: spaces.length,
  };

  return (
    <SpaceListLayout
      activeTab="전체"
      setActiveTab={() => {}} // 탭 기능 비활성화
      counts={counts}
      summarySection={<SpaceSummaryComponent spaces={spaces} />}
      listSection={<SpaceListComponent data={spaces} />}
    />
  );
}

export default SpaceListPage;
