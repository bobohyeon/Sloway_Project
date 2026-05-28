import { useState, useCallback, useEffect } from 'react';
import {
  addAmenityApi,
  deleteAmenityApi,
  fetchAmenityListApi,
  updateAmenityApi,
} from '../../api/admin/amenityApi';

export const useAmenity = () => {
  const [amenityList, setAmenityList] = useState([]); // 초기값 빈 배열

  // 백엔드 데이터 불러오기
  const loadData = async () => {
    try {
      // [API] GET: 데이터 조회
      const resp = await fetchAmenityListApi();

      setAmenityList(resp.data.amenityList);
    } catch (e) {
      console.error('데이터 로드 실패', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const debounce = (callback, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(...args), delay);
    };
  };

  const syncToBackend = async (row) => {
    try {
      await updateAmenityApi(row.no, row);
    } catch (e) {
      console.error('업데이트 실패', e);
    }
  };

  const debouncedSync = useCallback(debounce(syncToBackend, 1000), []);

  const handleUpdate = (id, field, value) => {
    const targetRow = amenityList.find((row) => row.no === Number(id));
    if (!targetRow) return;

    // 업데이트할 기본 객체 생성
    let updatedRow = { ...targetRow, [field]: value };

    // [상호 배타적 로직 적용]
    if (value === 'Y') {
      if (field === 'commonYn') {
        // '공통'을 켜면 나머지는 모두 'N'
        updatedRow = {
          ...updatedRow,
          workStayYn: 'N',
          officeYn: 'N',
          stationYn: 'N',
        };
      } else {
        // '기타' 항목 중 하나를 켜면 '공통'은 'N'
        updatedRow = { ...updatedRow, commonYn: 'N' };
      }
    }

    // 상태 업데이트
    setAmenityList((prev) =>
      prev.map((row) => (row.no === Number(id) ? updatedRow : row))
    );

    // API 호출 (이때는 전체가 업데이트된 updatedRow를 전송)
    if (field === 'name') {
      debouncedSync(updatedRow);
    } else {
      syncToBackend(updatedRow);
    }
  };

  const handleAdd = async () => {
    try {
      // [API] POST: 서버에 추가 요청
      const resp = await addAmenityApi();

      setAmenityList((prev) => [resp.data, ...prev]);

      console.log('새 행 추가 완료 (맨 위로 이동)');
    } catch (e) {
      console.error('추가 실패', e);
    }
  };

  const handleRemove = async (no) => {
    try {
      // [API] DELETE: ID로 삭제 요청
      await deleteAmenityApi(no);
      setAmenityList((prev) => prev.filter((row) => row.no !== no));
    } catch (e) {
      console.error('삭제 실패', e);
    }
  };

  return { amenityList, handleUpdate, handleAdd, handleRemove };
};
