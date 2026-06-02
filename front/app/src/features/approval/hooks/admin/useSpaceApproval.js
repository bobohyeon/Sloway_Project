import { useState, useEffect, useMemo } from 'react';
import {
  approvePlace,
  fetchApprovalDetail,
  rejectPlace,
} from '../../api/admin/approvalApi';
import { useNavigate } from 'react-router-dom';

// 데이터 변환 어댑터: 서버의 필드명을 프론트 표준으로 매핑
const adaptImage = (img) => ({
  no: img.no,
  url: img.currentUrl, // 서버의 currentUrl -> preview
  sortNo: img.sortNo        // 서버의 sortNo -> sort
});

export const useSpaceApproval = (type, id) => {
  const [loading, setLoading] = useState(true);
  const [spaceData, setSpaceData] = useState(null);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchApprovalDetail(type, id);
        const rawData = response.data;        

        // 이미지가 존재할 경우에만 어댑터를 통해 표준화
        const standardizedData = {
          ...rawData,
          images: rawData.images?.map(adaptImage) || [],
          subImages: rawData.subImages?.map(adaptImage) || []
        };
        console.log(standardizedData);
        
        setSpaceData(standardizedData);
      } catch (error) {
        console.error('데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [type, id]);

  const handleApprove = async () => {
    const resp = await approvePlace(spaceData.id);
    if (resp.status === 200) {
      alert('최종 승인 처리되었습니다.');
      navigate(`/admin/space/review`);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    const vo = { rejectedReason: reason };
    const resp = await rejectPlace(spaceData.id, vo);

    if (resp.status === 200) {
      alert('반려 처리되었습니다.');
      navigate(`/admin/space/review`);
    }
  };

  return { 
    reason, 
    setReason, 
    spaceData, 
    loading, 
    handleApprove, 
    handleReject 
  };
};