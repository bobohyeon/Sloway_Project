import { useState, useEffect } from 'react';
import {
  getAdminHostDetail,
  approveHost,
  rejectHost,
  reReviewHost,
} from '../api/adminApi';
const STATE_MAP = {
  P: 'PENDING',
  A: 'APPROVED',
  R: 'REJECTED',
  V: 'REVOKED',
};

export function useHostApplyDetail(hostId) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = () => {
    setLoading(true);
    getAdminHostDetail(hostId)
      .then((h) => {
        setApplication({
          hostId: h.hostNo,
          name: h.memberName,
          email: h.memberEmail,
          phone: h.memberPhone,
          birthDate: h.memberBirthDate,
          businessName: h.businessName,
          businessNo: h.businessNo,
          businessDocUrl: h.businessDocUrl,
          state: STATE_MAP[h.approvalState] ?? 'PENDING',
          createdAt: h.createdAt
            ? h.createdAt.replace('T', ' ').slice(0, 16)
            : '',
          approvedAt: h.approvedAt
            ? h.approvedAt.replace('T', ' ').slice(0, 16)
            : null,
          rejectReason: h.rejectReason,
          lastRejectReason: h.lastRejectReason,
        });
      })
      .catch(() => setApplication(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (hostId) fetchDetail();
  }, [hostId]);

  const approve = async () => {
    await approveHost(hostId);
    fetchDetail();
  };

  const reject = async (reason) => {
    await rejectHost(hostId, reason);
    fetchDetail();
  };

  const reReview = async () => {
    await reReviewHost(hostId);
    fetchDetail();
  };

  return { application, loading, approve, reject, reReview };
}
