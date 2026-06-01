import { useState, useMemo, useEffect } from 'react';
import {
  getAdminMembers,
  suspendMember,
  unsuspendMember,
} from '../api/adminApi';

// 백엔드 MemberStatus(A/S/B/W) → 프론트 status 문자열
const STATUS_MAP = {
  A: 'ACTIVE',
  S: 'SUSPENDED',
  B: 'BANNED',
  W: 'WITHDRAWN',
};

const PAGE_SIZE = 10;

// 정지 옵션 — 7일 / 30일 / 영구
export const SUSPEND_OPTIONS = [
  { value: 'DAYS_7', label: '7일 정지', days: 7, isPermanent: false },
  { value: 'DAYS_30', label: '30일 정지', days: 30, isPermanent: false },
  { value: 'PERMANENT', label: '영구 정지', days: null, isPermanent: true },
];

export function useMemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // 회원 목록 조회
  const fetchMembers = () => {
    setLoading(true);
    getAdminMembers()
      .then((data) => {
        const mapped = data.content.map((m) => ({
          memberId: m.memberNo,
          email: m.email,
          name: m.name,
          phone: m.phone,
          role: m.role,
          status: STATUS_MAP[m.status] ?? 'ACTIVE',
          createdAt: m.createdAt ? m.createdAt.split('T')[0] : '',
          suspendedUntil: null,
        }));
        setMembers(mapped);
      })
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 탭 카운트
  const counts = useMemo(
    () => ({
      ALL: members.length,
      ACTIVE: members.filter((m) => m.status === 'ACTIVE').length,
      SUSPENDED: members.filter((m) => m.status === 'SUSPENDED').length,
      BANNED: members.filter((m) => m.status === 'BANNED').length,
      WITHDRAWN: members.filter((m) => m.status === 'WITHDRAWN').length,
    }),
    [members]
  );

  // 필터·검색·정렬
  const filtered = useMemo(() => {
    let list = members;

    if (statusTab !== 'ALL') {
      list = list.filter((m) => m.status === statusTab);
    }
    if (roleFilter !== 'ALL') {
      list = list.filter((m) => m.role === roleFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.email.toLowerCase().includes(q) || m.name.toLowerCase().includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      if (sortOrder === 'NEWEST') {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return a.createdAt.localeCompare(b.createdAt);
    });

    return list;
  }, [members, statusTab, roleFilter, sortOrder, search]);

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 필터 변경 시 1페이지로 리셋
  const handleStatusTab = (tab) => {
    setStatusTab(tab);
    setPage(1);
  };
  const handleRole = (e) => {
    setRoleFilter(e.target.value);
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

  // 정지 처리 (모달에서 옵션·사유 받아 호출)
  const suspend = async (member, option, reason) => {
    await suspendMember(
      member.memberId,
      reason,
      option.isPermanent ? null : option.days
    );
    fetchMembers();
  };

  // 해제 처리
  const unsuspend = async (member) => {
    const label = member.status === 'BANNED' ? '영구 정지' : '정지';
    if (!window.confirm(`${member.name} 회원의 ${label}를 해제하시겠습니까?`))
      return;
    await unsuspendMember(member.memberId);
    fetchMembers();
  };

  return {
    loading,
    counts,
    statusTab,
    roleFilter,
    sortOrder,
    search,
    pageData,
    currentPage,
    totalPages,
    setPage,
    handleStatusTab,
    handleRole,
    handleSort,
    handleSearch,
    suspend,
    unsuspend,
  };
}
