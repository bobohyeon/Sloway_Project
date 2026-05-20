import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SpaceDetailLayout from '../../../layouts/host/detail/SpaceDetailLayout';
import SpaceDetailComponent from '../../../components/host/detail/place/SpaceDetailComponent';
import useSpaceDetail from '../../../hooks/host/place/useSpaceDetail';

function SpaceDetailPage() {
  // 구조 분해 할당으로 훅의 자원들을 가져옵니다.
  const { placeInfo, units, getTypeLabel, handleCardClick } = useSpaceDetail();

  return (
    <SpaceDetailLayout
      title={`${placeInfo.name} ${getTypeLabel(placeInfo.type)} 목록`}
      description={`등록된 ${getTypeLabel(placeInfo.type)}를 관리하고 정보를 수정하세요.`}
      onBack={'/host/space/list'}
    >
      <SpaceDetailComponent
        data={units}
        onCardClick={handleCardClick}
        typeLabel={getTypeLabel(placeInfo.type)}
      />
    </SpaceDetailLayout>
  );
}

export default SpaceDetailPage;
