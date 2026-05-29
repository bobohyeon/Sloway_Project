import { useState, useEffect } from 'react';
import {
  approvePlace,
  fetchApprovalDetail,
  rejectPlace,
} from '../../api/admin/approvalApi';
import { useNavigate } from 'react-router-dom';

export const useSpaceApproval = (type, id) => {
  const [loading, setLoading] = useState(true);
  const [spaceData, setSpaceData] = useState(null);
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchApprovalDetail(type, id);
        console.log(response);

        setSpaceData(response.data);
      } catch (error) {
        console.error('데이터 로드 실패', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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
    const vo = {
      rejectedReason: reason,
    };

    const resp = await rejectPlace(spaceData.id, vo);

    if (resp.status === 200) {
      alert('반려 처리되었습니다.');
      navigate(`/admin/space/review`);
    }
  };

  return { reason, setReason, spaceData, loading, handleApprove, handleReject };
};
