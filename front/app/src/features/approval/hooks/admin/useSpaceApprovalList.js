import { useState, useEffect, useMemo } from 'react';
import { fetchApprovalList } from '../../api/admin/approvalApi';

export const useSpaceApprovalList = () => {
  // 1. 상태 정의
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  // 2. API 호출 로직 (async/await 사용)
  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 실제 API 엔드포인트로 교체하세요
      const response = await fetchApprovalList();
      if (response.status !== 200) {
        throw new Error(
          `데이터를 불러오는데 실패했습니다. (상태 코드: ${response.status})`
        );
      }

      setRawData(response.data);
    } catch (err) {
      console.error('API 요청 중 오류 발생:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. 마운트 시 데이터 로드
  useEffect(() => {
    fetchApprovalData();
  }, []);

  // 4. 통계 데이터 계산 (데이터 변경 시에만 재계산)
  const counts = useMemo(
    () => ({
      ALL: rawData.length,
      P: rawData.filter((d) => d.status === 'P').length,
      A: rawData.filter((d) => d.status === 'A').length,
      R: rawData.filter((d) => d.status === 'R').length,
    }),
    [rawData]
  );

  // 5. 필터링 로직 (상태 및 데이터 변경 시 재계산)
  const filteredData = useMemo(() => {
    return rawData.filter((item) => {
      const matchesTab = currentTab === 'ALL' || item.status === currentTab;
      const matchesType = selectedType === 'ALL' || item.type === selectedType;
      return matchesTab && matchesType;
    });
  }, [currentTab, selectedType, rawData]);

  // 6. 결과 반환
  return {
    currentTab,
    setCurrentTab,
    selectedType,
    setSelectedType,
    counts,
    filteredData,
    rawData,
    loading,
    error,
    refetch: fetchApprovalData, // 데이터 새로고침이 필요할 경우를 대비해 제공
  };
};
