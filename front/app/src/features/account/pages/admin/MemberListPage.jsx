import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaSearch,
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─────────────────────────────────────────────
// 더미 데이터 — 백엔드 연동 시 GET /api/admin/users 로 교체
// ─────────────────────────────────────────────
const RAW_MEMBERS = [
  {
    memberId: 10001,
    email: 'minjun.kim@example.com',
    name: '김민준',
    phone: '010-1234-5678',
    role: 'USER',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-04-15',
    lastLoginAt: '2025-05-13',
    suspendedUntil: null,
  },
  {
    memberId: 10002,
    email: 'seoyeon.lee@example.com',
    name: '이서연',
    phone: '010-2345-6789',
    role: 'HOST',
    provider: 'KAKAO',
    status: 'ACTIVE',
    createdAt: '2025-04-16',
    lastLoginAt: '2025-05-12',
    suspendedUntil: null,
  },
  {
    memberId: 10003,
    email: 'doyun.park@example.com',
    name: '박도윤',
    phone: '010-3456-7890',
    role: 'USER',
    provider: 'GOOGLE',
    status: 'SUSPENDED',
    createdAt: '2025-04-17',
    lastLoginAt: '2025-05-01',
    suspendedUntil: '2025-05-20',
  },
  {
    memberId: 10004,
    email: 'jia.choi@example.com',
    name: '최지아',
    phone: '010-4567-8901',
    role: 'USER',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-04-18',
    lastLoginAt: '2025-05-14',
    suspendedUntil: null,
  },
  {
    memberId: 10005,
    email: 'haeun.jung@example.com',
    name: '정하은',
    phone: '010-5678-9012',
    role: 'HOST',
    provider: 'LOCAL',
    status: 'WITHDRAWN',
    createdAt: '2025-04-19',
    lastLoginAt: '2025-04-30',
    suspendedUntil: null,
  },
  {
    memberId: 10006,
    email: 'siwoo.kang@example.com',
    name: '강시우',
    phone: '010-6789-0123',
    role: 'USER',
    provider: 'KAKAO',
    status: 'ACTIVE',
    createdAt: '2025-04-20',
    lastLoginAt: '2025-05-10',
    suspendedUntil: null,
  },
  {
    memberId: 10007,
    email: 'yejin.cho@example.com',
    name: '조예진',
    phone: '010-7890-1234',
    role: 'USER',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-04-21',
    lastLoginAt: '2025-05-11',
    suspendedUntil: null,
  },
  {
    memberId: 10008,
    email: 'jihoo.yoon@example.com',
    name: '윤지후',
    phone: '010-8901-2345',
    role: 'HOST',
    provider: 'GOOGLE',
    status: 'SUSPENDED',
    createdAt: '2025-04-22',
    lastLoginAt: '2025-05-05',
    suspendedUntil: '2025-06-01',
  },
  {
    memberId: 10009,
    email: 'subin.han@example.com',
    name: '한수빈',
    phone: '010-9012-3456',
    role: 'USER',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-04-23',
    lastLoginAt: '2025-05-13',
    suspendedUntil: null,
  },
  {
    memberId: 10010,
    email: 'taeho.song@example.com',
    name: '송태호',
    phone: '010-0123-4567',
    role: 'USER',
    provider: 'KAKAO',
    status: 'ACTIVE',
    createdAt: '2025-04-24',
    lastLoginAt: '2025-05-09',
    suspendedUntil: null,
  },
  {
    memberId: 10011,
    email: 'yuna.bae@example.com',
    name: '배유나',
    phone: '010-1122-3344',
    role: 'HOST',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-04-25',
    lastLoginAt: '2025-05-14',
    suspendedUntil: null,
  },
  {
    memberId: 10012,
    email: 'junseo.lim@example.com',
    name: '임준서',
    phone: '010-2233-4455',
    role: 'USER',
    provider: 'LOCAL',
    status: 'WITHDRAWN',
    createdAt: '2025-04-26',
    lastLoginAt: '2025-05-02',
    suspendedUntil: null,
  },
  {
    memberId: 10013,
    email: 'aram.shin@example.com',
    name: '신아람',
    phone: '010-3344-5566',
    role: 'USER',
    provider: 'GOOGLE',
    status: 'ACTIVE',
    createdAt: '2025-04-27',
    lastLoginAt: '2025-05-12',
    suspendedUntil: null,
  },
  {
    memberId: 10014,
    email: 'gunwoo.oh@example.com',
    name: '오건우',
    phone: '010-4455-6677',
    role: 'HOST',
    provider: 'KAKAO',
    status: 'ACTIVE',
    createdAt: '2025-04-28',
    lastLoginAt: '2025-05-13',
    suspendedUntil: null,
  },
  {
    memberId: 10015,
    email: 'nayoon.go@example.com',
    name: '고나윤',
    phone: '010-5566-7788',
    role: 'USER',
    provider: 'LOCAL',
    status: 'SUSPENDED',
    createdAt: '2025-04-29',
    lastLoginAt: '2025-04-29',
    suspendedUntil: '2025-05-15',
  },
  {
    memberId: 10016,
    email: 'siyeon.moon@example.com',
    name: '문시연',
    phone: '010-6677-8899',
    role: 'USER',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-04-30',
    lastLoginAt: '2025-05-14',
    suspendedUntil: null,
  },
  {
    memberId: 10017,
    email: 'hyunwoo.son@example.com',
    name: '손현우',
    phone: '010-7788-9900',
    role: 'USER',
    provider: 'KAKAO',
    status: 'ACTIVE',
    createdAt: '2025-05-01',
    lastLoginAt: '2025-05-13',
    suspendedUntil: null,
  },
  {
    memberId: 10018,
    email: 'dahye.ryu@example.com',
    name: '류다혜',
    phone: '010-8899-0011',
    role: 'HOST',
    provider: 'GOOGLE',
    status: 'ACTIVE',
    createdAt: '2025-05-02',
    lastLoginAt: '2025-05-10',
    suspendedUntil: null,
  },
  {
    memberId: 10019,
    email: 'minseo.hwang@example.com',
    name: '황민서',
    phone: '010-9900-1122',
    role: 'USER',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-05-03',
    lastLoginAt: '2025-05-12',
    suspendedUntil: null,
  },
  {
    memberId: 10020,
    email: 'yejun.no@example.com',
    name: '노예준',
    phone: '010-1010-2020',
    role: 'USER',
    provider: 'LOCAL',
    status: 'WITHDRAWN',
    createdAt: '2025-05-04',
    lastLoginAt: '2025-05-05',
    suspendedUntil: null,
  },
  {
    memberId: 10021,
    email: 'aein.heo@example.com',
    name: '허애인',
    phone: '010-2020-3030',
    role: 'USER',
    provider: 'KAKAO',
    status: 'ACTIVE',
    createdAt: '2025-05-05',
    lastLoginAt: '2025-05-14',
    suspendedUntil: null,
  },
  {
    memberId: 10022,
    email: 'jihye.kwon@example.com',
    name: '권지혜',
    phone: '010-3030-4040',
    role: 'HOST',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-05-06',
    lastLoginAt: '2025-05-13',
    suspendedUntil: null,
  },
  {
    memberId: 10023,
    email: 'sangwoo.an@example.com',
    name: '안상우',
    phone: '010-4040-5050',
    role: 'USER',
    provider: 'GOOGLE',
    status: 'SUSPENDED',
    createdAt: '2025-05-07',
    lastLoginAt: '2025-05-08',
    suspendedUntil: '2025-05-22',
  },
  {
    memberId: 10024,
    email: 'rin.lee@example.com',
    name: '이린',
    phone: '010-5050-6060',
    role: 'USER',
    provider: 'LOCAL',
    status: 'ACTIVE',
    createdAt: '2025-05-08',
    lastLoginAt: '2025-05-13',
    suspendedUntil: null,
  },
  {
    memberId: 10025,
    email: 'donghyun.kim@example.com',
    name: '김동현',
    phone: '010-6060-7070',
    role: 'USER',
    provider: 'KAKAO',
    status: 'ACTIVE',
    createdAt: '2025-05-09',
    lastLoginAt: '2025-05-14',
    suspendedUntil: null,
  },
  {
    memberId: 10026,
    email: 'banned.user@example.com',
    name: '강시우',
    phone: '010-7070-8080',
    role: 'USER',
    provider: 'KAKAO',
    status: 'BANNED',
    createdAt: '2025-05-10',
    lastLoginAt: '2025-05-10',
    suspendedUntil: null,
  },
];

const STATUS_LABEL = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  BANNED: '영구정지',
  WITHDRAWN: '탈퇴',
};

// 정지 옵션 — 7일 / 30일 / 영구 (디테일 페이지와 동일 — 추후 공통 추출)
const SUSPEND_OPTIONS = [
  { value: 'DAYS_7', label: '7일 정지', days: 7, isPermanent: false },
  { value: 'DAYS_30', label: '30일 정지', days: 30, isPermanent: false },
  { value: 'PERMANENT', label: '영구 정지', days: null, isPermanent: true },
];

const PROVIDER_LABEL = {
  LOCAL: '일반',
  KAKAO: '카카오',
  GOOGLE: '구글',
};

const ROLE_LABEL = {
  USER: '일반회원',
  HOST: '호스트',
};

const PAGE_SIZE = 10;

// 전화번호 마스킹 (보안 — 관리자라도 PII 노출 최소화)
const maskPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
};

function MemberListPage() {
  const navigate = useNavigate();
  const [members, setMembers] = useState(RAW_MEMBERS);
  const [statusTab, setStatusTab] = useState('ALL');
  const [providerFilter, setProviderFilter] = useState('ALL');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // 정지 모달 상태
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendOption, setSuspendOption] = useState('DAYS_7');
  const [suspendReason, setSuspendReason] = useState('');

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
    if (providerFilter !== 'ALL') {
      list = list.filter((m) => m.provider === providerFilter);
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
  }, [members, statusTab, providerFilter, roleFilter, sortOrder, search]);

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
  const handleProvider = (e) => {
    setProviderFilter(e.target.value);
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

  // 정지 모달 열기
  const openSuspendModal = (member) => {
    setSuspendTarget(member);
    setSuspendOption('DAYS_7');
    setSuspendReason('');
  };

  // 정지 처리
  const confirmSuspend = () => {
    if (!suspendReason.trim()) {
      alert('정지 사유를 입력해주세요.');
      return;
    }

    const option = SUSPEND_OPTIONS.find((o) => o.value === suspendOption);
    if (!option) return;

    // 영구정지 한번 더 확인
    if (option.isPermanent) {
      const confirmed = window.confirm(
        `${suspendTarget.name} 회원을 영구 정지하시겠습니까?\n관리자가 직접 해제하지 않는 한 영원히 서비스를 이용할 수 없습니다.`
      );
      if (!confirmed) return;
    }

    let until = null;
    if (!option.isPermanent) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + option.days);
      until = endDate.toISOString().slice(0, 10);
    }

    // TODO: PATCH /api/admin/users/{id}/status { status, days, reason, isPermanent }
    setMembers((prev) =>
      prev.map((m) =>
        m.memberId === suspendTarget.memberId
          ? {
              ...m,
              status: option.isPermanent ? 'BANNED' : 'SUSPENDED',
              suspendedUntil: until,
            }
          : m
      )
    );
    setSuspendTarget(null);
  };

  // 해제 처리
  const handleUnsuspend = (member) => {
    const label = member.status === 'BANNED' ? '영구 정지' : '정지';
    if (!window.confirm(`${member.name} 회원의 ${label}를 해제하시겠습니까?`))
      return;
    // TODO: PATCH /api/admin/users/{id}/status { status: 'ACTIVE' }
    setMembers((prev) =>
      prev.map((m) =>
        m.memberId === member.memberId
          ? { ...m, status: 'ACTIVE', suspendedUntil: null }
          : m
      )
    );
  };

  return (
    <PageContainer>
      <PageLayout
        title="회원 관리"
        description="가입한 일반회원·호스트를 조회하고 상태를 관리하세요"
      >
        {/* 통계 카드 */}
        <StatsGrid>
          <StatCard
            $active={statusTab === 'ALL'}
            onClick={() => handleStatusTab('ALL')}
          >
            <StatIcon $bg="#a8b89f">
              <FaUsers />
            </StatIcon>
            <StatBody>
              <StatLabel>전체 회원</StatLabel>
              <StatValue>{counts.ALL.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'ACTIVE'}
            onClick={() => handleStatusTab('ACTIVE')}
          >
            <StatIcon $bg="#7A8B71">
              <FaUserCheck />
            </StatIcon>
            <StatBody>
              <StatLabel>활성</StatLabel>
              <StatValue>{counts.ACTIVE.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'SUSPENDED'}
            onClick={() => handleStatusTab('SUSPENDED')}
          >
            <StatIcon $bg="#D9A441">
              <FaUserSlash />
            </StatIcon>
            <StatBody>
              <StatLabel>정지</StatLabel>
              <StatValue>{counts.SUSPENDED.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'BANNED'}
            onClick={() => handleStatusTab('BANNED')}
          >
            <StatIcon $bg="#C9433D">
              <FaUserSlash />
            </StatIcon>
            <StatBody>
              <StatLabel>영구정지</StatLabel>
              <StatValue>{counts.BANNED.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'WITHDRAWN'}
            onClick={() => handleStatusTab('WITHDRAWN')}
          >
            <StatIcon $bg="#B0B0B0">
              <FaUserTimes />
            </StatIcon>
            <StatBody>
              <StatLabel>탈퇴</StatLabel>
              <StatValue>{counts.WITHDRAWN.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>
        </StatsGrid>

        {/* 필터 바 */}
        <FilterBar>
          <SearchWrap>
            <FaSearch />
            <SearchInput
              placeholder="이메일 또는 이름으로 검색"
              value={search}
              onChange={handleSearch}
            />
          </SearchWrap>

          <FilterRight>
            <StyledSelect value={roleFilter} onChange={handleRole}>
              <option value="ALL">전체 권한</option>
              <option value="USER">일반회원</option>
              <option value="HOST">호스트</option>
            </StyledSelect>

            <StyledSelect value={providerFilter} onChange={handleProvider}>
              <option value="ALL">전체 가입유형</option>
              <option value="LOCAL">일반</option>
              <option value="KAKAO">카카오</option>
              <option value="GOOGLE">구글</option>
            </StyledSelect>

            <StyledSelect value={sortOrder} onChange={handleSort}>
              <option value="NEWEST">최신 가입순</option>
              <option value="OLDEST">오래된 가입순</option>
            </StyledSelect>
          </FilterRight>
        </FilterBar>

        {/* 테이블 */}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th $w="80px">번호</Th>
                <Th>이메일</Th>
                <Th $w="100px">이름</Th>
                <Th $w="130px">연락처</Th>
                <Th $w="110px">권한</Th>
                <Th $w="100px">가입유형</Th>
                <Th $w="110px">상태</Th>
                <Th $w="110px">가입일</Th>
                <Th $w="200px">관리</Th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <Td colSpan={9}>
                    <EmptyMessage>조회된 회원이 없습니다.</EmptyMessage>
                  </Td>
                </tr>
              ) : (
                pageData.map((m) => (
                  <tr key={m.memberId}>
                    <Td>{m.memberId}</Td>
                    <Td>{m.email}</Td>
                    <Td>{m.name}</Td>
                    <Td>{maskPhone(m.phone)}</Td>
                    <Td>
                      <Badge $variant={m.role === 'HOST' ? 'host' : 'user'}>
                        {ROLE_LABEL[m.role]}
                      </Badge>
                    </Td>
                    <Td>{PROVIDER_LABEL[m.provider]}</Td>
                    <Td>
                      <StatusBadge $status={m.status}>
                        {STATUS_LABEL[m.status]}
                      </StatusBadge>
                    </Td>
                    <Td>{m.createdAt}</Td>
                    <Td>
                      <ActionGroup>
                        <ActionBtn
                          onClick={() =>
                            navigate(`/admin/members/${m.memberId}`)
                          }
                        >
                          상세
                        </ActionBtn>
                        {m.status === 'ACTIVE' && (
                          <ActionBtn
                            $danger
                            onClick={() => openSuspendModal(m)}
                          >
                            정지
                          </ActionBtn>
                        )}
                        {(m.status === 'SUSPENDED' ||
                          m.status === 'BANNED') && (
                          <ActionBtn
                            $primary
                            onClick={() => handleUnsuspend(m)}
                          >
                            해제
                          </ActionBtn>
                        )}
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

      {/* 정지 모달 */}
      {suspendTarget && (
        <ModalOverlay onClick={() => setSuspendTarget(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle>회원 정지</ModalTitle>
            <ModalDesc>
              <strong>{suspendTarget.name}</strong> ({suspendTarget.email})
              회원을 정지합니다.
            </ModalDesc>

            <FormGroup>
              <FormLabel>정지 유형 *</FormLabel>
              <SuspendOptions>
                {SUSPEND_OPTIONS.map((opt) => (
                  <SuspendOptionCard
                    key={opt.value}
                    $active={suspendOption === opt.value}
                    $danger={opt.isPermanent}
                    onClick={() => setSuspendOption(opt.value)}
                  >
                    <SuspendRadio
                      $active={suspendOption === opt.value}
                      $danger={opt.isPermanent}
                    />
                    <div>
                      <SuspendOptionLabel $danger={opt.isPermanent}>
                        {opt.label}
                      </SuspendOptionLabel>
                      <SuspendOptionDesc>
                        {opt.isPermanent
                          ? '관리자가 해제하기 전까지 영원히 이용 불가'
                          : `${opt.days}일 후 자동 해제`}
                      </SuspendOptionDesc>
                    </div>
                  </SuspendOptionCard>
                ))}
              </SuspendOptions>
            </FormGroup>

            <FormGroup>
              <FormLabel>정지 사유 *</FormLabel>
              <FormTextarea
                rows="3"
                placeholder="회원에게 전달될 정지 사유를 입력하세요"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                maxLength={200}
              />
              <HelpText>{suspendReason.length} / 200</HelpText>
            </FormGroup>

            <ModalActions>
              <ModalBtn onClick={() => setSuspendTarget(null)}>취소</ModalBtn>
              <ModalBtn $danger onClick={confirmSuspend}>
                정지 처리
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

export default MemberListPage;

// ─────────────────────────────────────────────
// Styled Components
// ─────────────────────────────────────────────
const PageContainer = styled.div`
  padding: 20px;
  background-color: #f4efe6;
  min-height: 95.2%;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 700px) {
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

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${(p) => (p.$variant === 'host' ? '#FFE9C2' : '#E8F0DF')};
  color: ${(p) => (p.$variant === 'host' ? '#B07A19' : '#5A6B4F')};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#E8F0DF'
      : $status === 'SUSPENDED'
        ? '#FBE4C2'
        : $status === 'BANNED'
          ? '#F7D4D1'
          : '#EEE'};
  color: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#5A6B4F'
      : $status === 'SUSPENDED'
        ? '#9B6A1F'
        : $status === 'BANNED'
          ? '#9B3A36'
          : '#888'};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 6px;
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 150ms ease;
  font-family: inherit;

  ${(p) =>
    p.$danger
      ? `
      background: #fff;
      color: #C9433D;
      border: 1px solid #E8B5B2;
      &:hover { background: #FDF1F0; }
    `
      : p.$primary
        ? `
      background: #7A8B71;
      color: white;
      border: 1px solid #7A8B71;
      &:hover { background: #6B7A63; }
    `
        : `
      background: #fff;
      color: #555;
      border: 1px solid #ddd;
      &:hover { background: #f9faf8; border-color: #a8b89f; color: #333; }
    `}
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

// 모달
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: white;
  border-radius: 14px;
  padding: 28px 28px 24px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  animation: modalIn 200ms ease-out;

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
`;

const ModalDesc = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

// 정지 옵션 라디오 카드 (디테일 페이지와 동일)
const SuspendOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SuspendOptionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1.5px solid
    ${(p) => (p.$active ? (p.$danger ? '#C9433D' : '#a8b89f') : '#e8e6e0')};
  background: ${(p) =>
    p.$active ? (p.$danger ? '#FDF1F0' : '#F5F8F1') : '#fff'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: ${(p) => (p.$danger ? '#C9433D' : '#a8b89f')};
  }
`;

const SuspendRadio = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid
    ${(p) => (p.$active ? (p.$danger ? '#C9433D' : '#7A8B71') : '#cfcbc2')};
  flex-shrink: 0;
  position: relative;

  ${(p) =>
    p.$active &&
    `
    &::after {
      content: '';
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 7px; height: 7px;
      border-radius: 50%;
      background: ${p.$danger ? '#C9433D' : '#7A8B71'};
    }
  `}
`;

const SuspendOptionLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${(p) => (p.$danger ? '#C9433D' : '#333')};
`;

const SuspendOptionDesc = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 2px;
`;

const FormLabel = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e8e6e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  transition: border-color 200ms ease;

  &:focus {
    border-color: #a8b89f;
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e8e6e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  font-family: inherit;
  resize: vertical;
  transition: border-color 200ms ease;

  &:focus {
    border-color: #a8b89f;
    box-shadow: 0 0 0 2px rgba(168, 184, 159, 0.2);
  }
`;

const HelpText = styled.div`
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const ModalBtn = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: all 150ms ease;

  ${(p) =>
    p.$danger
      ? `
    background: #C9433D;
    color: white;
    border: 1px solid #C9433D;
    &:hover { background: #B33A35; }
  `
      : `
    background: #fff;
    color: #666;
    border: 1px solid #ddd;
    &:hover { background: #f9faf8; }
  `}
`;
