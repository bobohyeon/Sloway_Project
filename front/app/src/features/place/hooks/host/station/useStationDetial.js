import { useState, useEffect, useMemo } from 'react';
import { 
  fetchStationDetailDashboard, 
  fetchDetailImageList 
} from '../../../api/host/place/masterPlaceApi';

export const useStationDetail = (typePath, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 이미지 데이터 객체 전체를 담을 상태 (초기값 null)
  const [placeImgData, setPlaceImgData] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        // Promise.all로 병렬 처리: 속도 향상
        const [dashboardData, imageResp] = await Promise.all([
          fetchStationDetailDashboard(typePath, id),
          fetchDetailImageList(typePath, id)
        ]);

        setData(dashboardData);
        setPlaceImgData(imageResp);
        console.log(imageResp);
        
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id, typePath]);

  // 이미지 정렬 로직 (placeImgData.placeImages 배열에 접근)
  const sortedImages = useMemo(() => {
    
    const images = placeImgData?.placeImages || [];
    return [...images].sort((a, b) => a.sort - b.sort);
  }, [placeImgData]);

  const openModal = (index = 0) => {
    setCurrentIdx(index);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  return { 
    data, loading, error, 
    sortedImages, 
    isModalOpen, currentIdx, openModal, closeModal, setCurrentIdx 
  };
};