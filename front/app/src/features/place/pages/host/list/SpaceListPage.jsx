import React, { useState } from 'react';
import SpaceListLayout from '../../../layouts/host/list/SpaceListLayout';
import SpaceSummaryComponent from '../../../components/host/list/SpaceSummaryComponent';
import SpaceListComponent from '../../../components/host/list/SpaceListComponent';

function SpaceListPage() {
  // 1. activeTab 상태 추가
  const [activeTab, setActiveTab] = useState('ALL');

  // 2. 데이터에 type 속성 추가 (필터링 기준)
  const [spaces, setSpaces] = useState([
    {
      id: 101,
      type: 'STATION', // 추가
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
      type: 'OFFICE', // 추가
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
      type: 'WORK_STAY', // 추가
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
      type: 'STATION', // 추가
      status: '검수 대기',
      title: '양양 파도소리 빌라',
      location: '강원 양양',
      rating: '4.9',
      reviews: '45',
      monthlyBookings: 3,
      price: 240000,
      icon: '🏠',
    },
    {
      id: 305,
      type: 'OFFICE', // 추가
      status: '운영 중',
      title: '강릉 바다향 커먼워크',
      location: '강원 강릉',
      rating: '4.8',
      reviews: '56',
      monthlyBookings: 12,
      price: 28000,
      icon: '🌊',
    },
  ]);

  // 3. 탭 구성 및 카운트 로직
  const tabs = [
    { key: 'ALL', label: '전체', count: spaces.length },
    {
      key: 'STATION',
      label: '숙소',
      count: spaces.filter((s) => s.type === 'STATION').length,
    },
    {
      key: 'OFFICE',
      label: '오피스',
      count: spaces.filter((s) => s.type === 'OFFICE').length,
    },
    {
      key: 'WORK_STAY',
      label: '워크앤스테이',
      count: spaces.filter((s) => s.type === 'WORK_STAY').length,
    },
  ];

  // 4. 필터링된 데이터 추출
  const filteredData =
    activeTab === 'ALL' ? spaces : spaces.filter((s) => s.type === activeTab);

  return (
    <SpaceListLayout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={tabs} // 탭 목록
      summarySection={
        <SpaceSummaryComponent
          spaces={spaces} // 통계용 전체 데이터
        />
      }
      // 필터링된 데이터만 리스트에 전달
      listSection={<SpaceListComponent data={filteredData} />}
    />
  );
}

export default SpaceListPage;
