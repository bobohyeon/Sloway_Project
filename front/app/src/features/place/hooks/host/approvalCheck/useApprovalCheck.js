import { useState } from 'react';
import { checkApproval } from '../../../api/host/approvalCheck/approvalCheckApi';

export default function useApprovalCheck(no, type) {
  const [reason, setReason] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = async (e) => {
    e.stopPropagation();

    try {
      const resp = await checkApproval(type, no);

      if (resp && resp.data) {
        setReason(resp.data.rejectedReason || '사유가 없습니다.');
      }
      setIsOpen(true);
    } catch (e) {
      console.error('반려 사유 조회 실패:', e);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return { isOpen, reason, handleClose, handleOpen };
}
