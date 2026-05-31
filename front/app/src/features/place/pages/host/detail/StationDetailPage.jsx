import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // 실제 환경이라면 필요
import StationDetailLayout from '../../../layouts/host/detail/StationDetailLayout';
import { getSpaceTypePath } from '../../../hooks/host/stationUtils';
import { useStationDetail } from '../../../hooks/host/station/useStationDetial';

function StationDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // 2. URL 경로에서 :id 값 추출 (예: /host/space/:id)
  const location = useLocation();

  // ✨ 유틸 함수에 현재 정적 주소(pathname)를 던져서 'lodging', 'coworking', 'workStay'를 얻습니다.
  const typePath = getSpaceTypePath(location.pathname);

  // 1. 커스텀 훅 호출
  const { data: spaceData, loading, error } = useStationDetail(typePath, id);

  // 2. 버튼 클릭 시 이동 핸들러 (유틸로 구해온 typePath 그대로 재사용)
  const handleUpdateDetail = () => {
    navigate(`/host/${typePath}/${id}/edit`);
  };

  const handleImageUpdate = () => {
    navigate(`/host/${typePath}/${id}/images`);
  };


  if (loading) return <div>데이터 로딩 중...</div>;
  if (error) return <div>데이터를 불러오는 중 에러가 발생했습니다.</div>;
  if (!spaceData) return <div>조회된 정보가 없습니다.</div>;

  return (
    <StationDetailLayout
      data={spaceData}
      onBack={'/host/space/list'}
      handleUpdateDetail={handleUpdateDetail}
      handleImageUpdate={handleImageUpdate}
    />
  );
}

export default StationDetailPage;
