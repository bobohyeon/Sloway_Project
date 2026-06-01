import { useState, useMemo, useEffect } from 'react';
import { getAdminHosts } from '../api/adminApi';

// 백엔드 ApprovalState(P/A/R/V) → 프론트 문자열
const STATE_MAP = {
  P: 'PENDING',
  A: 'APPROVED',
  R: 'REJECTED',
  V: 'REVOKED',
};

const PAGE_SIZE = 10;

export function useHostApplyList() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAdminHosts()
      .then((data) => {
        const mapped = data.content.map((h) => ({
          hostId: h.hostNo,
          businessName: h.businessName,
          businessNo: h.businessNo,
          name: h.memberName,
          email: h.memberEmail,
          state: STATE_MAP[h.approvalState] ?? 'PENDING',
          createdAt: h.createdAt ? h.createdAt.split('T')[0] : '',
        }));
        setHosts(mapped);
      })
      .catch(() => setHosts([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = useMemo(
    () => ({
      ALL: hosts.length,
      PENDING: hosts.filter((h) => h.state === 'PENDING').length,
      APPROVED: hosts.filter((h) => h.state === 'APPROVED').length,
      REJECTED: hosts.filter((h) => h.state === 'REJECTED').length,
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
  };
}
