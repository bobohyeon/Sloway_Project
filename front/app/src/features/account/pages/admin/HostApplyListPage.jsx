import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaSearch,
  FaHourglassHalf,
  FaCheckCircle,
  FaTimesCircle,
  FaUserPlus,
  FaFileAlt,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─────────────────────────────────────────────
// 더미 데이터 — 백엔드 연동 시 GET /api/admin/hosts/applications 로 교체
// ─────────────────────────────────────────────
const RAW_APPLICATIONS = [
  // PENDING (대기)
  {
    applicationId: 'HA-2025-001',
    memberId: 10101,
    email: 'seoyeon.lee@example.com',
    name: '이서연',
    phone: '010-2345-6789',
    businessNumber: '123-45-67890',
    businessName: '제주살이 게스트하우스',
    businessDocUrl: '/uploads/business/seoyeon_biz.pdf',
    applyStatus: 'PENDING',
    appliedAt: '2025-05-13',
    processedAt: null,
    processedBy: null,
    rejectReason: null,
  },
  {
    applicationId: 'HA-2025-002',
    memberId: 10102,
    email: 'jihoon.park@example.com',
    name: '박지훈',
    phone: '010-3456-7890',
    businessNumber: '234-56-78901',
    businessName: '강릉 워케이션 하우스',
    businessDocUrl: '/uploads/business/jihoon_biz.pdf',
    applyStatus: 'PENDING',
    appliedAt: '2025-05-13',
    processedAt: null,
    processedBy: null,
    rejectReason: null,
  },
  {
    applicationId: 'HA-2025-003',
    memberId: 10103,
    email: 'minju.kim@example.com',
    name: '김민주',
    phone: '010-4567-8901',
    businessNumber: '345-67-89012',
    businessName: '성수 코워킹 스튜디오',
    businessDocUrl: '/uploads/business/minju_biz.pdf',
    applyStatus: 'PENDING',
    appliedAt: '2025-05-12',
    processedAt: null,
    processedBy: null,
    rejectReason: null,
  },
  {
    applicationId: 'HA-2025-004',
    memberId: 10104,
    email: 'sungho.choi@example.com',
    name: '최성호',
    phone: '010-5678-9012',
    businessNumber: '456-78-90123',
    businessName: '판교 테크 오피스',
    businessDocUrl: '/uploads/business/sungho_biz.pdf',
    applyStatus: 'PENDING',
    appliedAt: '2025-05-12',
    processedAt: null,
    processedBy: null,
    rejectReason: null,
  },
  {
    applicationId: 'HA-2025-005',
    memberId: 10105,
    email: 'yejin.lim@example.com',
    name: '임예진',
    phone: '010-6789-0123',
    businessNumber: '567-89-01234',
    businessName: '양양 서핑 워크스테이',
    businessDocUrl: '/uploads/business/yejin_biz.pdf',
    applyStatus: 'PENDING',
    appliedAt: '2025-05-11',
    processedAt: null,
    processedBy: null,
    rejectReason: null,
  },
  {
    applicationId: 'HA-2025-006',
    memberId: 10106,
    email: 'hyunwoo.son@example.com',
    name: '손현우',
    phone: '010-7890-1234',
    businessNumber: '678-90-12345',
    businessName: '부산 해운대 리트릿',
    businessDocUrl: '/uploads/business/hyunwoo_biz.pdf',
    applyStatus: 'PENDING',
    appliedAt: '2025-05-10',
    processedAt: null,
    processedBy: null,
    rejectReason: null,
  },

  // APPROVED (승인 완료)
  {
    applicationId: 'HA-2025-007',
    memberId: 10107,
    email: 'donghyun.jung@example.com',
    name: '정동현',
    phone: '010-8901-2345',
    businessNumber: '789-01-23456',
    businessName: '경주 한옥 게스트하우스',
    businessDocUrl: '/uploads/business/donghyun_biz.pdf',
    applyStatus: 'APPROVED',
    appliedAt: '2025-05-09',
    processedAt: '2025-05-10',
    processedBy: '관리자 A',
    rejectReason: null,
  },
  {
    applicationId: 'HA-2025-008',
    memberId: 10108,
    email: 'sumin.han@example.com',
    name: '한수민',
    phone: '010-9012-3456',
    businessNumber: '890-12-34567',
    businessName: '제주 협재 오션뷰',
    businessDocUrl: '/uploads/business/sumin_biz.pdf',
    applyStatus: 'APPROVED',
    appliedAt: '2025-05-08',
    processedAt: '2025-05-09',
    processedBy: '관리자 A',
    rejectReason: null,
  },
  {
    applicationId: 'HA-2025-009',
    memberId: 10109,
    email: 'taeho.song@example.com',
    name: '송태호',
    phone: '010-0123-4567',
    businessNumber: '901-23-45678',
    businessName: '여수 밤바다 스테이',
    businessDocUrl: '/uploads/business/taeho_biz.pdf',
    applyStatus: 'APPROVED',
    appliedAt: '2025-05-07',
    processedAt: '2025-05-08',
    processedBy: '관리자 B',
    rejectReason: null,
  },

  // REJECTED (반려)
  {
    applicationId: 'HA-2025-010',
    memberId: 10110,
    email: 'fake.host@example.com',
    name: '김위장',
    phone: '010-1111-2222',
    businessNumber: '000-00-00000',
    businessName: '미상 호스트',
    businessDocUrl: '/uploads/business/fake_biz.pdf',
    applyStatus: 'REJECTED',
    appliedAt: '2025-05-06',
    processedAt: '2025-05-07',
    processedBy: '관리자 A',
    rejectReason: '사업자등록증 사본 식별 불가 — 원본 스캔본으로 재제출 요청',
  },
  {
    applicationId: 'HA-2025-011',
    memberId: 10111,
    email: 'no.biz@example.com',
    name: '이무허',
    phone: '010-2222-3333',
    businessNumber: '111-11-11111',
    businessName: '개인 거주지',
    businessDocUrl: '/uploads/business/nobiz.pdf',
    applyStatus: 'REJECTED',
    appliedAt: '2025-05-05',
    processedAt: '2025-05-06',
    processedBy: '관리자 B',
    rejectReason: '사업자등록 미완료 — 사업자등록 후 재신청 부탁드립니다',
  },
  {
    applicationId: 'HA-2025-012',
    memberId: 10112,
    email: 'wrong.cat@example.com',
    name: '박오분',
    phone: '010-3333-4444',
    businessNumber: '222-22-22222',
    businessName: '음식점 (워케이션 부적합)',
    businessDocUrl: '/uploads/business/wrong_biz.pdf',
    applyStatus: 'REJECTED',
    appliedAt: '2025-05-04',
    processedAt: '2025-05-05',
    processedBy: '관리자 A',
    rejectReason: '워케이션 서비스 운영 가능 업종이 아님 (음식점업)',
  },
];

const STATUS_LABEL = {
  PENDING: '대기',
  APPROVED: '승인',
  REJECTED: '반려',
};

const PAGE_SIZE = 10;

// 휴대폰 마스킹 (PII 보호 — 회원 목록과 동일 정책)
const maskPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
};

function HostApplyListPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState(RAW_APPLICATIONS);
  const [statusTab, setStatusTab] = useState('PENDING'); // 기본은 대기 (처리 우선)
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // 탭 카운트
  const counts = useMemo(
    () => ({
      ALL: applications.length,
      PENDING: applications.filter((a) => a.applyStatus === 'PENDING').length,
      APPROVED: applications.filter((a) => a.applyStatus === 'APPROVED').length,
      REJECTED: applications.filter((a) => a.applyStatus === 'REJECTED').length,
    }),
    [applications]
  );

  // 필터 + 검색 + 정렬
  const filtered = useMemo(() => {
    let list = applications;

    if (statusTab !== 'ALL') {
      list = list.filter((a) => a.applyStatus === statusTab);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (a) =>
          a.email.toLowerCase().includes(q) ||
          a.name.toLowerCase().includes(q) ||
          a.businessName.toLowerCase().includes(q) ||
          a.businessNumber.includes(q)
      );
    }

    list = [...list].sort((a, b) => {
      if (sortOrder === 'NEWEST') {
        return b.appliedAt.localeCompare(a.appliedAt);
      }
      return a.appliedAt.localeCompare(b.appliedAt);
    });

    return list;
  }, [applications, statusTab, sortOrder, search]);

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageData = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 필터 변경 시 1페이지 리셋
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

  // 처리 대기 카운트 (헤더 표시용)
  const pendingCount = counts.PENDING;

  return (
    <PageContainer>
      <PageLayout
        title="호스트 신청 관리"
        description="호스트 가입 신청을 검토하고 승인 또는 반려하세요"
      >
        {/* 상단 안내 — 처리 대기 건수 강조 */}
        {pendingCount > 0 && (
          <PendingAlert>
            <FaHourglassHalf />
            <div>
              <strong>처리 대기 {pendingCount}건</strong>
              <span>
                신청자는 처리 결과를 알림으로 받습니다. 빠른 검토 부탁드립니다.
              </span>
            </div>
          </PendingAlert>
        )}

        {/* 통계 카드 */}
        <StatsGrid>
          <StatCard
            $active={statusTab === 'ALL'}
            onClick={() => handleStatusTab('ALL')}
          >
            <StatIcon $bg="#a8b89f">
              <FaUserPlus />
            </StatIcon>
            <StatBody>
              <StatLabel>전체 신청</StatLabel>
              <StatValue>{counts.ALL.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'PENDING'}
            onClick={() => handleStatusTab('PENDING')}
          >
            <StatIcon $bg="#D9A441">
              <FaHourglassHalf />
            </StatIcon>
            <StatBody>
              <StatLabel>처리 대기</StatLabel>
              <StatValue>{counts.PENDING.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'APPROVED'}
            onClick={() => handleStatusTab('APPROVED')}
          >
            <StatIcon $bg="#7A8B71">
              <FaCheckCircle />
            </StatIcon>
            <StatBody>
              <StatLabel>승인 완료</StatLabel>
              <StatValue>{counts.APPROVED.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'REJECTED'}
            onClick={() => handleStatusTab('REJECTED')}
          >
            <StatIcon $bg="#C9433D">
              <FaTimesCircle />
            </StatIcon>
            <StatBody>
              <StatLabel>반려</StatLabel>
              <StatValue>{counts.REJECTED.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>
        </StatsGrid>

        {/* 필터바 */}
        <FilterBar>
          <SearchWrap>
            <FaSearch />
            <SearchInput
              placeholder="이메일·이름·사업자명·사업자번호로 검색"
              value={search}
              onChange={handleSearch}
            />
          </SearchWrap>

          <FilterRight>
            <StyledSelect value={sortOrder} onChange={handleSort}>
              <option value="NEWEST">최신 신청순</option>
              <option value="OLDEST">오래된 신청순</option>
            </StyledSelect>
          </FilterRight>
        </FilterBar>

        {/* 테이블 */}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th $w="130px">신청번호</Th>
                <Th>신청자</Th>
                <Th $w="200px">사업자명</Th>
                <Th $w="140px">사업자번호</Th>
                <Th $w="110px">신청일</Th>
                <Th $w="110px">상태</Th>
                <Th $w="160px">관리</Th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <Td colSpan={7}>
                    <EmptyMessage>조회된 신청이 없습니다.</EmptyMessage>
                  </Td>
                </tr>
              ) : (
                pageData.map((a) => (
                  <tr key={a.applicationId}>
                    <Td>{a.applicationId}</Td>
                    <Td>
                      <ApplicantCell>
                        <ApplicantName>{a.name}</ApplicantName>
                        <ApplicantSub>{a.email}</ApplicantSub>
                        <ApplicantSub>{maskPhone(a.phone)}</ApplicantSub>
                      </ApplicantCell>
                    </Td>
                    <Td>{a.businessName}</Td>
                    <Td>{a.businessNumber}</Td>
                    <Td>{a.appliedAt}</Td>
                    <Td>
                      <StatusBadge $status={a.applyStatus}>
                        {STATUS_LABEL[a.applyStatus]}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <ActionGroup>
                        <ActionBtn
                          onClick={() =>
                            navigate(`/admin/host/apply/${a.applicationId}`)
                          }
                        >
                          상세
                        </ActionBtn>
                        <IconBtn
                          as="a"
                          href={a.businessDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="사업자등록증 새 탭에서 보기"
                        >
                          <FaFileAlt />
                        </IconBtn>
                      </ActionGroup>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </TableWrap>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination>
            <PageBtn
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              이전
            </PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PageBtn
                key={p}
                $active={p === currentPage}
                onClick={() => setPage(p)}
              >
                {p}
              </PageBtn>
            ))}
            <PageBtn
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              다음
            </PageBtn>
          </Pagination>
        )}
      </PageLayout>
    </PageContainer>
  );
}

export default HostApplyListPage;

// ─────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────
const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  min-height: 95.2%;
`;

const PendingAlert = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  background: #fef6e8;
  border-left: 3px solid #d9a441;
  border-radius: 8px;
  margin-bottom: 20px;

  svg {
    font-size: 18px;
    color: #d9a441;
    flex-shrink: 0;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    font-size: 14px;
    color: #9b6a1f;
    font-weight: 600;
  }

  span {
    font-size: 13px;
    color: #666;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  border: ${(p) => (p.$active ? '2px solid #a8b89f' : '1px solid #eee')};
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
  transition: all 200ms ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
`;

const StatIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: ${(p) => p.$bg};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
`;

const StatBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: #888;
`;

const StatValue = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #333;
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 14px 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 240px;
  padding: 8px 14px;
  border: 1.5px solid #e8e6e0;
  border-radius: 8px;
  background: #fff;
  transition: all 200ms ease;

  &:focus-within {
    border-color: #a8b89f;
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }

  svg {
    color: #aaa;
    flex-shrink: 0;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  background: transparent;
  color: #333;

  &::placeholder {
    color: #bbb;
  }
`;

const FilterRight = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StyledSelect = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1.5px solid #a8b89f;
  background-color: #fff;
  color: #555;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 200ms ease;

  &:hover {
    border-color: #86927e;
    background-color: #f9faf8;
  }

  &:focus {
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }
`;

const TableWrap = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  background: #faf8f3;
  color: #555;
  font-weight: 600;
  text-align: left;
  padding: 14px 16px;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  width: ${(p) => p.$w || 'auto'};
`;

const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid #f4f1eb;
  color: #444;
  vertical-align: middle;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #aaa;
  font-size: 14px;
`;

const ApplicantCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ApplicantName = styled.span`
  font-weight: 600;
  color: #333;
`;

const ApplicantSub = styled.span`
  font-size: 12px;
  color: #888;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'PENDING'
      ? '#FBE4C2'
      : $status === 'APPROVED'
        ? '#E8F0DF'
        : $status === 'REJECTED'
          ? '#F7D4D1'
          : '#EEE'};
  color: ${({ $status }) =>
    $status === 'PENDING'
      ? '#9B6A1F'
      : $status === 'APPROVED'
        ? '#5A6B4F'
        : $status === 'REJECTED'
          ? '#9B3A36'
          : '#888'};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 150ms ease;
  font-family: inherit;
  background: #fff;
  color: #555;
  border: 1px solid #ddd;

  &:hover {
    background: #f9faf8;
    border-color: #a8b89f;
    color: #333;
  }
`;

const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #ddd;
  color: #7a8b71;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 150ms ease;
  text-decoration: none;

  &:hover {
    background: #f5f8f1;
    border-color: #a8b89f;
    color: #5a6b4f;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
`;

const PageBtn = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? '#a8b89f' : '#e0ddd5')};
  background: ${(p) => (p.$active ? '#a8b89f' : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : '#555')};
  cursor: pointer;
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  font-family: inherit;
  transition: all 150ms ease;

  &:hover:not(:disabled) {
    border-color: #a8b89f;
    color: ${(p) => (p.$active ? '#fff' : '#7A8B71')};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;
