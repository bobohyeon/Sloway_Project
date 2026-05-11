import React, { useState } from 'react';
import WishListLayout from '../../layouts/user/WishListLayout';
import WishCardComponent from '../../components/user/WishCardComponent';

function WishListPage() {
  const [activeTab, setActiveTab] = useState('ALL');

  // mock 데이터: 시안 이미지 참고
  const [wishes, setWishes] = useState([
    {
      id: 1,
      type: 'WORK_STAY',
      typeLabel: '워크앤스테이',
      title: '청평 숲속 파인뷰 스테이',
      location: '경기 가평',
      rating: 4.9,
      price: 185000,
      icon: '🌲',
      wishDate: '04.15',
    },
    {
      id: 2,
      type: 'OFFICE',
      typeLabel: '코워킹오피스',
      title: '강릉 바다향 커먼워크',
      location: '강원 강릉',
      rating: 4.8,
      price: 28000,
      icon: '🌊',
      wishDate: '04.12',
    },
    {
      id: 3,
      type: 'STATION',
      typeLabel: '숙소',
      title: '제주 돌담집 리트릿',
      location: '제주 서귀포',
      rating: 4.9,
      price: 220000,
      icon: '🏝️',
      wishDate: '04.10',
    },
    {
      id: 4,
      type: 'WORK_STAY',
      typeLabel: '워크앤스테이',
      title: '남해 올리브 팜스테이',
      location: '경남 남해',
      rating: 4.92,
      price: 165000,
      icon: '✉️',
      wishDate: '04.08',
    },
  ]);

  const tabs = [
    { key: 'ALL', label: '전체', count: wishes.length },
    {
      key: 'WORK_STAY',
      label: '워크앤스테이',
      count: wishes.filter((i) => i.type === 'WORK_STAY').length,
    },
    {
      key: 'OFFICE',
      label: '코워킹오피스',
      count: wishes.filter((i) => i.type === 'OFFICE').length,
    },
    {
      key: 'STATION',
      label: '숙소',
      count: wishes.filter((i) => i.type === 'STATION').length,
    },
  ];

  const filteredData =
    activeTab === 'ALL' ? wishes : wishes.filter((i) => i.type === activeTab);

  const handleToggleWish = (id) => {
    if (window.confirm('찜 목록에서 삭제하시겠습니까?')) {
      setWishes(wishes.filter((w) => w.id !== id));
    }
  };

  return (
    <WishListLayout
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <WishCardComponent data={filteredData} onToggleWish={handleToggleWish} />
    </WishListLayout>
  );
}

export default WishListPage;
