import { useState, useEffect } from 'react';
import { fetchMasterPlacesByType } from '../../api/host/place/placeApi';

export default function useFetchMasterPlaces() {
  const [masterPlaces, setMasterPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. 현재 브라우저 URL 경로 추출 (예: /host/lodging/insert)
    const path = window.location.pathname;

    // 2. URL 핵심 키워드를 백엔드 Enum 타입(STATION, OFFICE, WORK_STAY)으로 매핑
    let mappedType = '';
    if (path.includes('lodging')) mappedType = 'STATION';
    else if (path.includes('coworking')) mappedType = 'OFFICE';
    else if (path.includes('workstay')) mappedType = 'WORK_STAY';

    // 3. 🛠️ useEffect 내부에서 async 함수 정의 및 실행
    const getMasterPlaces = async () => {
      if (!mappedType) return;

      try {
        setIsLoading(true);

        // Axios 응답객체 전체를 받아옵니다.
        const resp = await fetchMasterPlacesByType(mappedType);
        const resultData = resp && resp.data ? resp.data : resp;

        setMasterPlaces(Array.isArray(resultData) ? resultData : []);
      } catch (err) {
        console.error('공통 마스터 공간 로드 실패:', err);
        setMasterPlaces([]); // 에러 발생 시 안전하게 빈 배열 세팅
      } finally {
        setIsLoading(false);
      }
    };

    getMasterPlaces();
  }, []); // 마운트 시 최초 1회 실행

  // 컴포넌트에서 쓸 데이터와 로딩 상태를 반환
  return { masterPlaces, isLoading };
}
