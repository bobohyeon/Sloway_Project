import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpaceDetailLayout from '../../../layouts/host/detail/SpaceDetailLayout';
import SpaceDetailComponent from '../../../components/host/detail/place/SpaceDetailComponent';

function SpaceDetailPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [spaces] = useState([
    {
      id: 1,
      type: 'STATION',
      title: '강릉 바다 스테이 101호',
      location: '강원 강릉',
      rating: 4.9,
    },
    {
      id: 2,
      type: 'STATION',
      title: '강릉 바다 스테이 102호',
      location: '강원 강릉',
      rating: 4.9,
    },
    {
      id: 3,
      type: 'STATION',
      title: '강릉 바다 스테이 201호',
      location: '강원 강릉',
      rating: 4.9,
    },
    {
      id: 4,
      type: 'OFFICE',
      title: '성수 브릭오피스 팀룸',
      location: '서울 성수',
      rating: 4.4,
    },
    {
      id: 5,
      type: 'OFFICE',
      title: '성수 브릭오피스 개인룸',
      location: '서울 성수',
      rating: 4.4,
    },
    {
      id: 6,
      type: 'WORK_STAY',
      title: '제주 애월당 단독룸',
      location: '제주 애월',
      rating: 4.8,
    },
    {
      id: 7,
      type: 'WORK_STAY',
      title: '제주 애월당 오피스룸',
      location: '제주 애월',
      rating: 4.8,
    },
  ]);

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

  const filteredData =
    activeTab === 'ALL' ? spaces : spaces.filter((s) => s.type === activeTab);

  return (
    <SpaceDetailLayout
      title="내 공간 목록"
      description="등록된 숙소, 오피스, 워크앤스테이를 관리하세요."
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <SpaceDetailComponent data={filteredData} />
    </SpaceDetailLayout>
  );
}
export default SpaceDetailPage;
