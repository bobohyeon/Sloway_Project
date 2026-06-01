import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaUserTimes,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useMemberList } from '../../hooks/useMemberList';
import SuspendModal from '../../components/admin/SuspendModal';
import {
  PageContainer,
  StatsGrid,
  StatCard,
  StatIcon,
  StatBody,
  StatLabel,
  StatValue,
  FilterBar,
  SearchWrap,
  SearchInput,
  FilterRight,
  StyledSelect,
  TableWrap,
  Table,
  Th,
  Td,
  EmptyMessage,
  Badge,
  StatusBadge,
  ActionGroup,
  ActionBtn,
  Pagination,
  PageBtn,
} from './MemberListPage.styled';

const STATUS_LABEL = {
  ACTIVE: '활성',
  SUSPENDED: '정지',
  BANNED: '영구정지',
  WITHDRAWN: '탈퇴',
};

const ROLE_LABEL = {
  USER: '일반회원',
  HOST: '호스트',
};

// 전화번호 마스킹 (보안 — 관리자라도 PII 노출 최소화)
const maskPhone = (phone) => {
  if (!phone) return '-';
  return phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3');
};

function MemberListPage() {
  const navigate = useNavigate();
  const {
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
  } = useMemberList();

  // 정지 모달 대상 (null이면 닫힘)
  const [suspendTarget, setSuspendTarget] = React.useState(null);

  // 모달의 "정지 처리" → 훅의 suspend 호출 + 모달 닫기
  const handleSuspendConfirm = async (option, reason) => {
    try {
      await suspend(suspendTarget, option, reason);
      setSuspendTarget(null);
    } catch (err) {
      alert(err.response?.data?.message ?? '정지 처리에 실패했습니다.');
    }
  };

  const handleUnsuspend = async (member) => {
    try {
      await unsuspend(member);
    } catch (err) {
      alert(err.response?.data?.message ?? '해제 처리에 실패했습니다.');
    }
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
                <Th $w="110px">상태</Th>
                <Th $w="110px">가입일</Th>
                <Th $w="200px">관리</Th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <Td colSpan={8}>
                    <EmptyMessage>
                      {loading ? '불러오는 중...' : '조회된 회원이 없습니다.'}
                    </EmptyMessage>
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
                            onClick={() => setSuspendTarget(m)}
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
        <SuspendModal
          target={suspendTarget}
          onClose={() => setSuspendTarget(null)}
          onConfirm={handleSuspendConfirm}
        />
      )}
    </PageContainer>
  );
}

export default MemberListPage;
