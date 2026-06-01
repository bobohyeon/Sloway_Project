import { useState, useMemo, useEffect } from 'react';
import { getAdminHosts, revokeHost, restoreHost } from '../api/adminApi';

// 백엔드 ApprovalState → 프론트 문자열
const STATE_MAP = {
  P: 'PENDING',
  A: 'ACTIVE', // 승인됨 = 정상운영
  R: 'REJECTED',
  V: 'REVOKED', // 박탈 = 정지
};

const PAGE_SIZE = 10;

export function useHostList() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL'); // ALL/ACTIVE/REVOKED
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchHosts = () => {
    setLoading(true);

    getAdminHosts()
      .then((data) => {
        // 승인(A)/박탈(V)만 — 대기(P)/반려(R)는 신청 목록 소관
        const mapped = data.content
          .map((h) => ({
            hostId: h.hostNo,
            businessName: h.businessName,
            businessNo: h.businessNo,
            name: h.memberName,
            email: h.memberEmail,
            state: STATE_MAP[h.approvalState] ?? 'ACTIVE',
            createdAt: h.createdAt ? h.createdAt.split('T')[0] : '',
            rejectReason: h.rejectReason, // ← 추가 (박탈 사유)
          }))

          .filter((h) => h.state === 'ACTIVE' || h.state === 'REVOKED');
        setHosts(mapped);
      })

      .catch(() => setHosts([]))

      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHosts();
  }, []);

  const counts = useMemo(
    () => ({
      ALL: hosts.length,
      ACTIVE: hosts.filter((h) => h.state === 'ACTIVE').length,
      REVOKED: hosts.filter((h) => h.state === 'REVOKED').length,
    }),
    [hosts]
  );

  const filtered = useMemo(() => {
    let list = hosts;

    if (statusTab !== 'ALL') {
      list = list.filter((h) => h.state === statusTab);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (h) =>
          h.name?.toLowerCase().includes(q) ||
          h.email?.toLowerCase().includes(q) ||
          h.businessName?.toLowerCase().includes(q) ||
          h.businessNo?.includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      if (sortOrder === 'NEWEST') return b.createdAt.localeCompare(a.createdAt);
      return a.createdAt.localeCompare(b.createdAt);
    });

    return list;
  }, [hosts, statusTab, search, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleStatusTab = (tab) => {
    setStatusTab(tab);
    setPage(1);
  };
  const handleSort = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // 박탈 (모달에서 사유 받음)
  const revoke = async (hostId, reason) => {
    await revokeHost(hostId, reason);
    fetchHosts();
  };
  // 복구 (박탈 취소)
  const restore = async (host) => {
    if (
      !window.confirm(
        `${host.businessName}(${host.name}) 호스트 자격을 복구하시겠습니까?`
      )
    )
      return;
    await restoreHost(host.hostId);
    fetchHosts();
  };

  return {
    loading,
    counts,
    statusTab,
    sortOrder,
    search,
    pageData,
    currentPage,
    totalPages,
    setPage,
    handleStatusTab,
    handleSort,
    handleSearch,
    revoke,
    restore,
  };
}
