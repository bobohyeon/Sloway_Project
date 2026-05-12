import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpaceDetailLayout from '../../../layouts/host/detail/SpaceDetailLayout';
import SpaceDetailComponent from '../../../components/host/detail/place/SpaceDetailComponent';

function SpaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');

  // 1. 공간(Place) 정보: 현재 건물의 대분류 타입 정의
  const [placeInfo] = useState({
    name: '강릉 바다 스테이',
    type: 'WORK_STAY', // STATION, OFFICE, WORK_STAY 중 하나
  });

  const [units] = useState([
    {
      id: 1,
      type: 'WORK_STAY',
      title: '101호',
      thumbnail: '',
      createdAt: '2026.05.01',
      rating: 4.9,
    },
    {
      id: 2,
      type: 'WORK_STAY',
      title: '102호',
      thumbnail: '',
      createdAt: '2026.05.02',
      rating: 4.8,
    },
    {
      id: 3,
      type: 'WORK_STAY',
      title: '201호',
      thumbnail: '',
      createdAt: '2026.05.10',
      rating: 4.9,
    },
    {
      id: 4,
      type: 'STATION',
      title: '202호',
      thumbnail: '',
      createdAt: '2026.05.10',
      rating: 4.9,
    },
    {
      id: 5,
      type: 'STATION',
      title: '301호',
      thumbnail: '',
      createdAt: '2026.05.10',
      rating: 4.9,
    },
  ]);

  // 유형 한글 변환 헬퍼
  const getTypeLabel = (type) => {
    switch (type) {
      case 'STATION':
        return '숙소';
      case 'OFFICE':
        return '오피스';
      case 'WORK_STAY':
        return '워크앤스테이';
      default:
        return '';
    }
  };

  // 3. 탭 구성 (상세 페이지 내에서도 '전체' 개수 표시용)

  const handleBack = () => {
    navigate('/host/space/list'); // 목록 페이지로 이동 로직
  };

  const handleCardClick = (unitId) => {
    const basePath = {
      STATION: 'lodging',
      WORK_STAY: 'workstay',
      OFFICE: 'coworking',
    }[placeInfo.type];

    navigate(`/host/${basePath}/${unitId}`);
  };

  return (
    <SpaceDetailLayout
      title={`${placeInfo.name} ${getTypeLabel(placeInfo.type)} 목록`}
      description={`등록된 ${getTypeLabel(placeInfo.type)}를 관리하고 정보를 수정하세요.`}
      onBack={handleBack}
    >
      <SpaceDetailComponent
        data={units}
        onCardClick={handleCardClick}
        showTypeBadge={false} // 상세 리스트에서는 유형 배지 숨김 처리
      />
    </SpaceDetailLayout>
  );
}

export default SpaceDetailPage;
