import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchRecommendPlaceList,
  fetchTopPlaceList,
  fetchRandomPlace,
} from '../api/recommendApi';

export const useRecommend = () => {
  const navigate = useNavigate();
  const [RECOMMENDED, setRECOMMENDED] = useState([]);
  const [TOP_SPACES, setTOP_SPACES] = useState([]);
  const [RANDOM_PLACE, setRANDOM_PLACE] = useState(null);
  const [loading, setLoading] = useState(true);
  const TYPE_MAP = {
    STATION: '숙소',
    OFFICE: '오피스',
    WORK_STAY: '워크앤스테이',
  };
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // 1. 병렬 처리를 위해 Promise.all 사용 권장
        const [recommendedResp, topSpacesResp, randomResp] = await Promise.all([
          fetchRecommendPlaceList(),
          fetchTopPlaceList(),
          fetchRandomPlace(),
        ]);

        setRECOMMENDED(recommendedResp.data || []);
        setTOP_SPACES(topSpacesResp.data || []);
        setRANDOM_PLACE(randomResp.data || null); // 데이터 세팅
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const goSearch = () => {
    navigate('/spaces/search');
  };

  const goDetail = (type, id) => {
    const path =
      type === '오피스'
        ? `/coworking-offices/${id}`
        : type === '워크앤스테이'
          ? `/workstays/${id}`
          : `/accommodations/${id}`;
    navigate(path);
  };

  const goBannerBook = () => {
    navigate('/accommodations/3');
  };

  return {
    RECOMMENDED,
    TOP_SPACES,
    loading,
    TYPE_MAP,
    RANDOM_PLACE,
    goSearch,
    goDetail,
    goBannerBook,
    navigate,
  };
};
