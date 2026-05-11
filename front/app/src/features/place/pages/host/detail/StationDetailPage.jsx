import React from 'react';
import { useNavigate } from 'react-router-dom'; // 실제 환경이라면 필요
import StationDetailLayout from '../../../layouts/host/detail/StationDetailLayout';

function StationDetailPage() {
  const navigate = useNavigate();

  // 실제로는 API 호출로 받아올 데이터
  const spaceData = {
    title: '청평 숲속 파인뷰 스테이',
    type: '워크앤스테이',
    status: '운영 중',
    location: '경기 가평군 청평면',
    rating: 4.9,
    reviews: 127,
    bookings: 8,
    revenue: '2,040,000',
    basicInfo: {
      name: '청평 숲속 파인뷰 스테이',
      type: '워크앤스테이',
      address: '경기 가평군 청평면',
      capacity: '4명 (기준 2명)',
      price: '185,000',
      weekendPrice: '220,000',
      checkIn: '오후 3:00',
      checkOut: '오전 11:00',
    },
    facilities: [
      '듀얼 모니터',
      '회의실',
      '프린터',
      '폰부스',
      '광랜 WIFI',
      '공용 라운지',
      '주방',
      '주차',
    ],
    recentBookings: [
      {
        id: 1,
        name: '박민수',
        code: 'SW-20260424-892',
        date: '5/10-5/12',
        price: '370,000',
      },
      {
        id: 2,
        name: '홍길동',
        code: 'SW-20260424-847',
        date: '5/8-5/10',
        price: '326,500',
      },
      {
        id: 3,
        name: '김수현',
        code: 'SW-20260420-712',
        date: '4/30-5/2',
        price: '370,000',
      },
    ],
  };

  const handleBack = () => {
    navigate('/host/space/list'); // 목록 페이지로 이동 로직
  };
  const imageUpdate = () => {
    navigate(``);
  };

  return <StationDetailLayout data={spaceData} onBack={handleBack} />;
}

export default StationDetailPage;
