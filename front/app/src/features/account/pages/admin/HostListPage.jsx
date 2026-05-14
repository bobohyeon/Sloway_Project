import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  FaSearch,
  FaUsers,
  FaCheckCircle,
  FaUserSlash,
  FaBuilding,
  FaExclamationTriangle,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─────────────────────────────────────────────
// 더미 데이터 — 백엔드 연동 시 GET /api/admin/hosts 로 교체
// ─────────────────────────────────────────────
const RAW_HOSTS = [
  // ACTIVE (정상 운영)
  {
    hostId: 1,
    memberId: 10101,
    email: 'seoyeon.lee@example.com',
    name: '이서연',
    phone: '010-2345-6789',
    businessNumber: '123-45-67890',
    businessName: '제주살이 게스트하우스',
    approvedAt: '2025-04-20',
    spaceCount: 3,
    ongoingReservationCount: 5,
    totalRevenue: 12_500_000,
    unsettledAmount: 1_250_000,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },
  {
    hostId: 2,
    memberId: 10107,
    email: 'donghyun.jung@example.com',
    name: '정동현',
    phone: '010-8901-2345',
    businessNumber: '789-01-23456',
    businessName: '경주 한옥 게스트하우스',
    approvedAt: '2025-05-10',
    spaceCount: 2,
    ongoingReservationCount: 3,
    totalRevenue: 4_800_000,
    unsettledAmount: 480_000,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },
  {
    hostId: 3,
    memberId: 10108,
    email: 'sumin.han@example.com',
    name: '한수민',
    phone: '010-9012-3456',
    businessNumber: '890-12-34567',
    businessName: '제주 협재 오션뷰',
    approvedAt: '2025-05-09',
    spaceCount: 1,
    ongoingReservationCount: 2,
    totalRevenue: 3_200_000,
    unsettledAmount: 0,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },
  {
    hostId: 4,
    memberId: 10109,
    email: 'taeho.song@example.com',
    name: '송태호',
    phone: '010-0123-4567',
    businessNumber: '901-23-45678',
    businessName: '여수 밤바다 스테이',
    approvedAt: '2025-05-08',
    spaceCount: 4,
    ongoingReservationCount: 8,
    totalRevenue: 18_700_000,
    unsettledAmount: 2_300_000,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },
  {
    hostId: 5,
    memberId: 10115,
    email: 'jihye.kwon@example.com',
    name: '권지혜',
    phone: '010-3030-4040',
    businessNumber: '112-34-56789',
    businessName: '강릉 산하루 코워킹',
    approvedAt: '2025-04-25',
    spaceCount: 2,
    ongoingReservationCount: 0,
    totalRevenue: 6_500_000,
    unsettledAmount: 0,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },
  {
    hostId: 6,
    memberId: 10120,
    email: 'dahye.ryu@example.com',
    name: '류다혜',
    phone: '010-8899-0011',
    businessNumber: '345-67-89012',
    businessName: '부산 광안리 워크룸',
    approvedAt: '2025-04-22',
    spaceCount: 1,
    ongoingReservationCount: 1,
    totalRevenue: 1_800_000,
    unsettledAmount: 250_000,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },
  {
    hostId: 7,
    memberId: 10125,
    email: 'gunwoo.oh@example.com',
    name: '오건우',
    phone: '010-4455-6677',
    businessNumber: '456-78-90123',
    businessName: '판교 테크 코워킹',
    approvedAt: '2025-04-28',
    spaceCount: 5,
    ongoingReservationCount: 12,
    totalRevenue: 32_400_000,
    unsettledAmount: 4_100_000,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },
  {
    hostId: 8,
    memberId: 10130,
    email: 'yuna.bae@example.com',
    name: '배유나',
    phone: '010-1122-3344',
    businessNumber: '567-89-01234',
    businessName: '양양 서핑 워크스테이',
    approvedAt: '2025-04-25',
    spaceCount: 2,
    ongoingReservationCount: 4,
    totalRevenue: 9_200_000,
    unsettledAmount: 0,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },
  {
    hostId: 9,
    memberId: 10135,
    email: 'newhost.kim@example.com',
    name: '김신규',
    phone: '010-5566-7788',
    businessNumber: '678-90-12345',
    businessName: '서울 성수 스튜디오',
    approvedAt: '2025-05-12',
    spaceCount: 0,
    ongoingReservationCount: 0,
    totalRevenue: 0,
    unsettledAmount: 0,
    status: 'ACTIVE',
    revokedAt: null,
    revokeReason: null,
  },

  // REVOKED (자격 취소)
  {
    hostId: 10,
    memberId: 10140,
    email: 'bad.host@example.com',
    name: '나불량',
    phone: '010-7777-8888',
    businessNumber: '789-01-23456',
    businessName: '신뢰불가 호스트',
    approvedAt: '2025-04-10',
    spaceCount: 0,
    ongoingReservationCount: 0,
    totalRevenue: 5_400_000,
    unsettledAmount: 0,
    status: 'REVOKED',
    revokedAt: '2025-05-08',
    revokeReason: '게스트 환불 거부 분쟁 3건 누적 — 호스트 약관 위반',
  },
  {
    hostId: 11,
    memberId: 10145,
    email: 'scam.host@example.com',
    name: '박사기',
    phone: '010-9999-0000',
    businessNumber: '890-12-34567',
    businessName: '미허위 펜션',
    approvedAt: '2025-04-05',
    spaceCount: 0,
    ongoingReservationCount: 0,
    totalRevenue: 1_200_000,
    unsettledAmount: 0,
    status: 'REVOKED',
    revokedAt: '2025-05-01',
    revokeReason: '사업자등록 위조 적발',
  },
];

const STATUS_LABEL = {
  ACTIVE: '정상',
  REVOKED: '자격 취소',
};

const PAGE_SIZE = 10;

const formatMoney = (n) => (n ?? 0).toLocaleString() + '원';

const maskPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
};

function HostListPage() {
  const navigate = useNavigate();
  const [hosts, setHosts] = useState(RAW_HOSTS);
  const [statusTab, setStatusTab] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('NEWEST');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // 자격 취소 모달
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');
  const [revokeConfirmText, setRevokeConfirmText] = useState('');
  const [revokeAgreed, setRevokeAgreed] = useState(false);

  // 탭 카운트
  const counts = useMemo(
    () => ({
      ALL: hosts.length,
      ACTIVE: hosts.filter((h) => h.status === 'ACTIVE').length,
      REVOKED: hosts.filter((h) => h.status === 'REVOKED').length,
    }),
    [hosts]
  );

  // 필터/검색/정렬
  const filtered = useMemo(() => {
    let list = hosts;
    if (statusTab !== 'ALL') {
      list = list.filter((h) => h.status === statusTab);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (h) =>
          h.email.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q) ||
          h.businessName.toLowerCase().includes(q) ||
          h.businessNumber.includes(q)
      );
    }
    list = [...list].sort((a, b) => {
      if (sortOrder === 'NEWEST')
        return b.approvedAt.localeCompare(a.approvedAt);
      if (sortOrder === 'OLDEST')
        return a.approvedAt.localeCompare(b.approvedAt);
      if (sortOrder === 'REVENUE') return b.totalRevenue - a.totalRevenue;
      if (sortOrder === 'SPACE_COUNT') return b.spaceCount - a.spaceCount;
      return 0;
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

  // 자격 취소 모달 열기
  const openRevokeModal = (host) => {
    setRevokeTarget(host);
    setRevokeReason('');
    setRevokeConfirmText('');
    setRevokeAgreed(false);
  };

  const revokeConfirmReady =
    revokeConfirmText === '자격을 취소합니다' &&
    revokeAgreed &&
    revokeReason.trim().length > 0;

  const confirmRevoke = () => {
    if (!revokeConfirmReady) return;
    // TODO: PATCH /api/admin/hosts/{id}/revoke { reason }
    setHosts((prev) =>
      prev.map((h) =>
        h.hostId === revokeTarget.hostId
          ? {
              ...h,
              status: 'REVOKED',
              spaceCount: 0, // 운영 공간 비공개 처리
              ongoingReservationCount: 0, // 진행 중 예약 자동 환불
              revokedAt: new Date().toISOString().slice(0, 10),
              revokeReason: revokeReason,
            }
          : h
      )
    );
    setRevokeTarget(null);
    alert('호스트 자격이 취소되었습니다.');
  };

  // 자격 복원
  const handleRestore = (host) => {
    if (
      !window.confirm(
        `${host.name} (${host.businessName})의 호스트 자격을 복원하시겠습니까?`
      )
    )
      return;
    // TODO: PATCH /api/admin/hosts/{id}/restore
    setHosts((prev) =>
      prev.map((h) =>
        h.hostId === host.hostId
          ? { ...h, status: 'ACTIVE', revokedAt: null, revokeReason: null }
          : h
      )
    );
  };

  return (
    <PageContainer>
      <PageLayout
        title="호스트 자격 관리"
        description="승인된 호스트의 운영 현황을 조회하고 자격을 관리하세요"
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
              <StatLabel>전체 호스트</StatLabel>
              <StatValue>{counts.ALL.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'ACTIVE'}
            onClick={() => handleStatusTab('ACTIVE')}
          >
            <StatIcon $bg="#7A8B71">
              <FaCheckCircle />
            </StatIcon>
            <StatBody>
              <StatLabel>정상 운영</StatLabel>
              <StatValue>{counts.ACTIVE.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>

          <StatCard
            $active={statusTab === 'REVOKED'}
            onClick={() => handleStatusTab('REVOKED')}
          >
            <StatIcon $bg="#C9433D">
              <FaUserSlash />
            </StatIcon>
            <StatBody>
              <StatLabel>자격 취소</StatLabel>
              <StatValue>{counts.REVOKED.toLocaleString()}</StatValue>
            </StatBody>
          </StatCard>
        </StatsGrid>

        {/* 필터바 */}
        <FilterBar>
          <SearchWrap>
            <FaSearch />
            <SearchInput
              placeholder="이름·이메일·사업자명·사업자번호로 검색"
              value={search}
              onChange={handleSearch}
            />
          </SearchWrap>

          <FilterRight>
            <StyledSelect value={sortOrder} onChange={handleSort}>
              <option value="NEWEST">최신 승인순</option>
              <option value="OLDEST">오래된 승인순</option>
              <option value="REVENUE">매출 높은순</option>
              <option value="SPACE_COUNT">공간 많은순</option>
            </StyledSelect>
          </FilterRight>
        </FilterBar>

        {/* 테이블 */}
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <Th $w="70px">번호</Th>
                <Th>호스트</Th>
                <Th $w="200px">사업자명</Th>
                <Th $w="90px">공간</Th>
                <Th $w="110px">진행예약</Th>
                <Th $w="140px">매출</Th>
                <Th $w="110px">승인일</Th>
                <Th $w="110px">상태</Th>
                <Th $w="160px">관리</Th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <Td colSpan={9}>
                    <EmptyMessage>조회된 호스트가 없습니다.</EmptyMessage>
                  </Td>
                </tr>
              ) : (
                pageData.map((h) => (
                  <tr key={h.hostId}>
                    <Td>{h.hostId}</Td>
                    <Td>
                      <HostCell>
                        <HostName>{h.name}</HostName>
                        <HostSub>{h.email}</HostSub>
                      </HostCell>
                    </Td>
                    <Td>{h.businessName}</Td>
                    <Td>
                      <CountValue $muted={h.spaceCount === 0}>
                        {h.spaceCount}개
                      </CountValue>
                    </Td>
                    <Td>
                      <CountValue $muted={h.ongoingReservationCount === 0}>
                        {h.ongoingReservationCount}건
                      </CountValue>
                    </Td>
                    <Td>
                      <MoneyValue $muted={h.totalRevenue === 0}>
                        {formatMoney(h.totalRevenue)}
                      </MoneyValue>
                    </Td>
                    <Td>{h.approvedAt}</Td>
                    <Td>
                      <StatusBadge $status={h.status}>
                        {STATUS_LABEL[h.status]}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <ActionGroup>
                        <ActionBtn
                          onClick={() =>
                            navigate(`/admin/host/list/${h.hostId}`)
                          }
                        >
                          상세
                        </ActionBtn>
                        {h.status === 'ACTIVE' && (
                          <ActionBtn $danger onClick={() => openRevokeModal(h)}>
                            자격 취소
                          </ActionBtn>
                        )}
                        {h.status === 'REVOKED' && (
                          <ActionBtn $primary onClick={() => handleRestore(h)}>
                            자격 복원
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

      {/* 자격 취소 모달 (3중 잠금) */}
      {revokeTarget && (
        <ModalOverlay onClick={() => setRevokeTarget(null)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalTitle $danger>호스트 자격 취소</ModalTitle>
            <ModalDesc>
              <strong>{revokeTarget.name}</strong> ({revokeTarget.businessName}
              )의 호스트 자격을 취소합니다. 호스트 권한만 회수되며,
              일반회원으로는 유지됩니다.
            </ModalDesc>

            {/* 영향 미리보기 */}
            <ImpactBox>
              <ImpactTitle>
                <FaExclamationTriangle /> 이 작업의 영향
              </ImpactTitle>
              <ImpactItem>
                <ImpactLabel>운영 공간</ImpactLabel>
                <ImpactValue>
                  <strong>{revokeTarget.spaceCount}개</strong> → 즉시 비공개
                  처리
                </ImpactValue>
              </ImpactItem>
              <ImpactItem>
                <ImpactLabel>진행 중 예약</ImpactLabel>
                <ImpactValue>
                  {revokeTarget.ongoingReservationCount > 0 ? (
                    <ImpactWarn>
                      <strong>{revokeTarget.ongoingReservationCount}건</strong>{' '}
                      → 게스트들에게 자동 환불 처리
                    </ImpactWarn>
                  ) : (
                    <span>없음</span>
                  )}
                </ImpactValue>
              </ImpactItem>
              <ImpactItem>
                <ImpactLabel>미정산 금액</ImpactLabel>
                <ImpactValue>
                  {revokeTarget.unsettledAmount > 0 ? (
                    <ImpactWarn>
                      <strong>
                        {formatMoney(revokeTarget.unsettledAmount)}
                      </strong>{' '}
                      → 별도 정산 처리 필요
                    </ImpactWarn>
                  ) : (
                    <span>없음</span>
                  )}
                </ImpactValue>
              </ImpactItem>
            </ImpactBox>

            <FormGroup>
              <FormLabel>취소 사유 *</FormLabel>
              <FormTextarea
                rows="3"
                placeholder="자격 취소 사유를 입력하세요 (감사 로그에 기록되고 호스트에게 알림으로 전달됩니다)"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                maxLength={300}
              />
              <HelpText>{revokeReason.length} / 300</HelpText>
            </FormGroup>

            <FormGroup>
              <FormLabel>확인 문구 입력 *</FormLabel>
              <FormInput
                placeholder="자격을 취소합니다"
                value={revokeConfirmText}
                onChange={(e) => setRevokeConfirmText(e.target.value)}
              />
              <HelpText>
                정확히 "<strong>자격을 취소합니다</strong>"라고 입력해주세요.
              </HelpText>
            </FormGroup>

            <FormGroup>
              <CheckRow>
                <input
                  type="checkbox"
                  id="revoke-agree"
                  checked={revokeAgreed}
                  onChange={(e) => setRevokeAgreed(e.target.checked)}
                />
                <label htmlFor="revoke-agree">
                  위 영향 사항을 모두 확인했으며, 자격 취소에 동의합니다.
                </label>
              </CheckRow>
            </FormGroup>

            <ModalActions>
              <ModalBtn onClick={() => setRevokeTarget(null)}>취소</ModalBtn>
              <ModalBtn
                $danger
                disabled={!revokeConfirmReady}
                onClick={confirmRevoke}
              >
                자격 취소 처리
              </ModalBtn>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </PageContainer>
  );
}

export default HostListPage;

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
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
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

const HostCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const HostName = styled.span`
  font-weight: 600;
  color: #333;
`;

const HostSub = styled.span`
  font-size: 12px;
  color: #888;
`;

const CountValue = styled.span`
  color: ${(p) => (p.$muted ? '#bbb' : '#333')};
  font-weight: ${(p) => (p.$muted ? '400' : '500')};
`;

const MoneyValue = styled.span`
  color: ${(p) => (p.$muted ? '#bbb' : '#333')};
  font-weight: ${(p) => (p.$muted ? '400' : '500')};
  white-space: nowrap;
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
      : $status === 'REVOKED'
        ? '#F7D4D1'
        : '#EEE'};
  color: ${({ $status }) =>
    $status === 'ACTIVE'
      ? '#5A6B4F'
      : $status === 'REVOKED'
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
  white-space: nowrap;

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
  max-width: 500px;
  max-height: 92vh;
  overflow-y: auto;
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
  color: ${(p) => (p.$danger ? '#C9433D' : '#333')};
  margin: 0 0 8px 0;
`;

const ModalDesc = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 20px 0;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

// 영향 미리보기 박스
const ImpactBox = styled.div`
  background: #fef6e8;
  border-left: 3px solid #d9a441;
  border-radius: 6px;
  padding: 14px 16px;
  margin-bottom: 18px;
`;

const ImpactTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #9b6a1f;
  margin-bottom: 10px;

  svg {
    font-size: 12px;
  }
`;

const ImpactItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;

  &:not(:last-child) {
    border-bottom: 1px dashed #f0e3c8;
  }
`;

const ImpactLabel = styled.span`
  color: #666;
`;

const ImpactValue = styled.span`
  color: #333;

  strong {
    font-weight: 600;
  }
`;

const ImpactWarn = styled.span`
  color: #c9433d;

  strong {
    color: #c9433d;
    font-weight: 700;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
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

  strong {
    color: #c9433d;
    font-weight: 600;
  }
`;

const CheckRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input {
    cursor: pointer;
  }
  label {
    font-size: 13px;
    color: #555;
    cursor: pointer;
  }
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
    background: ${p.disabled ? '#E8B5B2' : '#C9433D'};
    color: white;
    border: 1px solid ${p.disabled ? '#E8B5B2' : '#C9433D'};
    ${p.disabled ? 'cursor: not-allowed;' : ''}
    &:hover:not(:disabled) { background: #B33A35; }
  `
      : `
    background: #fff;
    color: #666;
    border: 1px solid #ddd;
    &:hover { background: #f9faf8; }
  `}
`;
