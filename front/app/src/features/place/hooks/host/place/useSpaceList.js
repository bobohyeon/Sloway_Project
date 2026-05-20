import { useState, useEffect } from 'react';
import { fetchPlaceListByHostNo } from '../../../api/host/place/placeApi';

export const STATUS_TEXT = {
  P: '검수 대기',
  A: '운영 중',
  R: '반려됨',
};

export default function useSpaceList() {
  const [activeTab, setActiveTab] = useState('ALL');

  // 1. 백엔드에서 받아올 실제 전체 공간 리스트 상태
  const [spaces, setSpaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. API 연동 효과 정의 파트
  useEffect(() => {
    async function fetchHostSpaces() {
      try {
        setIsLoading(true);
        const response = await fetchPlaceListByHostNo();

        if (response && response.data) {
          setSpaces(response.data);
        }
      } catch (error) {
        console.error('공간 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHostSpaces();
  }, []);

  // 3. 탭 구성 및 실시간 데이터 카운트 로직
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

  // 4. 활성화된 탭 기준 필터링 데이터 가공
  const filteredData =
    activeTab === 'ALL' ? spaces : spaces.filter((s) => s.type === activeTab);

  return {
    activeTab,
    setActiveTab,
    spaces,
    tabs,
    filteredData,
    isLoading,
  };
}
