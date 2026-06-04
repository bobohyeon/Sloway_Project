import { useState, useMemo, useEffect } from 'react';
import {
  addLikePlace,
  deleteLikePlace,
  fetchLikePlaceList,
} from '../api/wishListApi';

export const useWishList = () => {
  const [activeTab, setActiveTab] = useState('ALL');
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const TYPE_MAP = {
    WORK_STAY: '워크앤스테이',
    OFFICE: '오피스',
    STATION: '숙소',
  };

  // 데이터 불러오기
  const loadWishes = async () => {
    try {
      const response = await fetchLikePlaceList();
      const formattedData = response.data.map((item) => ({
        ...item,
        type: TYPE_MAP[item.type] || item.type,
      }));
      setWishes(formattedData);
    } catch (error) {
      console.error('위시리스트 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishes();
  }, []);

  // 탭 구성 및 카운트
  const tabs = useMemo(
    () => [
      { key: 'ALL', label: '전체', count: wishes.length },
      {
        key: '워크앤스테이',
        label: '워크앤스테이',
        count: wishes.filter((i) => i.type === '워크앤스테이').length,
      },
      {
        key: '오피스',
        label: '오피스',
        count: wishes.filter((i) => i.type === '오피스').length,
      },
      {
        key: '숙소',
        label: '숙소',
        count: wishes.filter((i) => i.type === '숙소').length,
      },
    ],
    [wishes]
  );

  // 필터링
  const filteredData = useMemo(
    () =>
      activeTab === 'ALL' ? wishes : wishes.filter((i) => i.type === activeTab),
    [activeTab, wishes]
  );

  // 위시리스트 삭제 (토글)
  const handleToggleWish = async (likeNo) => {
    try {
      await deleteLikePlace(likeNo); // 서버 삭제
      setWishes((prev) => prev.filter((w) => w.no !== likeNo)); // 상태 업데이트
    } catch (error) {
      console.error('위시리스트 삭제 실패:', error);
    }
  };

  const handleAddWish = async (placeNo) => {
    try {
      await addLikePlace(placeNo);
    } catch (error) {
      console.error('위시리스트 추가 실패:', error);
    }
  };
  return {
    activeTab,
    setActiveTab,
    tabs,
    filteredData,
    handleToggleWish,
    loading,
    handleAddWish,
  };
};
