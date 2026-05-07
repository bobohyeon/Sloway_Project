import React, { useState, useMemo } from 'react';
import SpaceListLayout from '../../../layouts/host/list/SpaceListLayout';
import SpaceSummaryComponent from '../../../components/host/list/SpaceSummaryComponent';
import SpaceListComponent from '../../../components/host/list/SpaceListComponent';

function SpaceListPage() {
  const [activeTab, setActiveTab] = useState('전체');

  const [spaces, setSpaces] = useState([
    {
      id: 1,
      type: '워크앤스테이',
      status: '운영 중',
      title: '청평 숲속 파인뷰 스테이',
      location: '경기 가평',
      rating: '4.9',
      reviews: '127',
      monthlyBookings: 8,
      price: '185,000',
      icon: '🌲',
    },
    {
      id: 2,
      type: '코워킹오피스',
      status: '운영 중',
      title: '성수 브릭라운지',
      location: '서울 성수',
      rating: '4.88',
      reviews: '312',
      monthlyBookings: 24,
      price: '25,000',
      icon: '🧱',
    },
    {
      id: 3,
      type: '숙소',
      status: '검수 대기',
      title: '제주 돌담집 리트릿',
      location: '제주 서귀포',
      rating: '4.9',
      reviews: '89',
      monthlyBookings: 5,
      price: '220,000',
      icon: '🏝️',
    },
    {
      id: 4,
      type: '숙소',
      status: '검수 대기',
      title: '제주 돌담집 리트릿',
      location: '제주 서귀포',
      rating: '4.9',
      reviews: '89',
      monthlyBookings: 5,
      price: '320,000',
      icon: '🏝️',
    },
  ]);

  // 1. 카운트 계산 로직 추가 (Layout의 탭 옆에 숫자를 띄우기 위함)
  const counts = useMemo(
    () => ({
      전체: spaces.length,
      숙소: spaces.filter((s) => s.type === '숙소').length,
      워크앤스테이: spaces.filter((s) => s.type === '워크앤스테이').length,
      코워킹오피스: spaces.filter((s) => s.type === '코워킹오피스').length,
    }),
    [spaces]
  );

  // 2. 탭에 따른 필터링 로직 (ListComponent에 전달할 데이터)
  const filteredSpaces = useMemo(() => {
    return activeTab === '전체'
      ? spaces
      : spaces.filter((s) => s.type === activeTab);
  }, [activeTab, spaces]);

  return (
    <SpaceListLayout
      // 3. Layout이 필요로 하는 props들을 정확히 전달
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      counts={counts}
      summarySection={<SpaceSummaryComponent spaces={spaces} />}
      listSection={<SpaceListComponent data={filteredSpaces} />}
    />
  );
}

export default SpaceListPage;
