import { useState, useEffect } from 'react';
import {
  getAdminMemberDetail,
  suspendMember,
  unsuspendMember,
} from '../api/adminApi';

const STATUS_MAP = {
  A: 'ACTIVE',
  S: 'SUSPENDED',
  B: 'BANNED',
  W: 'WITHDRAWN',
};

export function useMemberDetail(memberId) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = () => {
    setLoading(true);
    getAdminMemberDetail(memberId)
      .then((m) => {
        setMember({
          memberId: m.memberNo,
          email: m.email,
          name: m.name,
          phone: m.phone,
          birthDate: m.birthDate,
          imgUrl: m.imgUrl,
          role: m.role,
          status: STATUS_MAP[m.status] ?? 'ACTIVE',
          createdAt: m.createdAt ? m.createdAt.split('T')[0] : '',
          emailVerified: !!m.verifiedAt, // 인증 시각 있으면 인증됨
          suspendReason: m.suspendReason,
          suspendUntil: m.suspendUntil ? m.suspendUntil.split('T')[0] : null,
        });
      })
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (memberId) fetchDetail();
  }, [memberId]);

  // 정지 (모달에서 option, reason 받음)
  const suspend = async (option, reason) => {
    await suspendMember(
      memberId,
      reason,
      option.isPermanent ? null : option.days
    );
    fetchDetail();
  };

  // 해제
  const unsuspend = async () => {
    const label = member.status === 'BANNED' ? '영구 정지' : '정지';
    if (!window.confirm(`${member.name} 회원의 ${label}를 해제하시겠습니까?`))
      return;
    await unsuspendMember(memberId);
    fetchDetail();
  };

  return { member, loading, suspend, unsuspend };
}
