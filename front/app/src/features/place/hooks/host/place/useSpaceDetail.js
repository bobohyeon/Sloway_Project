import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchPlaceBrief,
  fetchPlaceDetailList,
} from '../../../api/host/place/placeApi';

export default function useSpaceDetail() {
  const { id } = useParams(); // URL 경로가 /host/space/:id 형태라면 이 id가 곧 placeNo가 됩니다.
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // 1. 공간(Place) 정보 요약 상태
  const [placeInfo, setPlaceInfo] = useState({
    name: '',
    type: '',
  });

  // 2. 등록된 세부 유닛(호수) 데이터 목록 상태
  const [units, setUnits] = useState([]);

  // 데이터 패칭 함수 정의
  const loadSpaceDetailData = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      // 두 API를 병렬로 동시에 호출하여 성능을 최적화합니다.
      const [briefRes, detailRes] = await Promise.all([
        fetchPlaceBrief(id),
        fetchPlaceDetailList(id),
      ]);

      // 백엔드 응답 구조(data)에 맞춰 데이터를 상태에 바인딩합니다.
      if (briefRes && briefRes.data) {
        setPlaceInfo({
          name: briefRes.data.title || briefRes.data.name, // 백엔드 DTO 필드명에 맞게 선택
          type: briefRes.data.type,
        });
      }

      if (detailRes && detailRes.data) {
        setUnits(detailRes.data);
      }
    } catch (error) {
      console.error('공간 상세 정보를 불러오는 중 에러 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 및 id 변경 시 API 호출 실행
  useEffect(() => {
    loadSpaceDetailData();
  }, [id]);

  // 유형 한글 변환 헬퍼 함수
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

  // 카드 클릭 시 세부 유닛 상세 페이지로 이동 핸들러
  const handleCardClick = (unitId) => {
    const basePath = {
      STATION: 'lodging',
      WORK_STAY: 'workstay',
      OFFICE: 'coworking',
    }[placeInfo.type];

    if (basePath) {
      navigate(`/host/${basePath}/${unitId}`);
    }
  };

  // 컴포넌트에서 필요한 상태와 함수들을 리턴
  return {
    id,
    placeInfo,
    units,
    activeTab,
    isLoading,
    setActiveTab,
    getTypeLabel,
    handleCardClick,
    refreshData: loadSpaceDetailData,
  };
}
