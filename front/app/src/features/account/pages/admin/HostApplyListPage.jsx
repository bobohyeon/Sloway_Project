import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaUsers,
  FaCheckCircle,
  FaUserSlash,
  FaBuilding,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useHostApplyList } from '../../hooks/useHostApplyList';
import * as S from './HostApplyListPage.styled';
import { getPageNumbers } from '../../utils/pagination';

const STATE_LABEL = {
  PENDING: '승인 대기',
  APPROVED: '승인',
  REJECTED: '반려',
  REVOKED: '취소',
};

function HostApplyListPage() {
  const navigate = useNavigate();
  const {
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
  } = useHostApplyList();

  return (
    <S.PageContainer>
      <PageLayout
        title="호스트 신청 관리"
        description="호스트 가입 신청을 검토하고 승인·반려하세요"
      >
        {/* 통계 카드 (탭 역할) */}
        <S.StatsGrid>
          <S.StatCard
            $active={statusTab === 'ALL'}
            onClick={() => handleStatusTab('ALL')}
          >
            <S.StatIcon $bg="#a8b89f">
              <FaUsers />
            </S.StatIcon>
            <S.StatBody>
              <S.StatLabel>전체</S.StatLabel>
              <S.StatValue>{counts.ALL.toLocaleString()}</S.StatValue>
            </S.StatBody>
          </S.StatCard>

          <S.StatCard
            $active={statusTab === 'PENDING'}
            onClick={() => handleStatusTab('PENDING')}
          >
            <S.StatIcon $bg="#D9A441">
              <FaBuilding />
            </S.StatIcon>
            <S.StatBody>
              <S.StatLabel>승인 대기</S.StatLabel>
              <S.StatValue>{counts.PENDING.toLocaleString()}</S.StatValue>
            </S.StatBody>
          </S.StatCard>

          <S.StatCard
            $active={statusTab === 'APPROVED'}
            onClick={() => handleStatusTab('APPROVED')}
          >
            <S.StatIcon $bg="#7A8B71">
              <FaCheckCircle />
            </S.StatIcon>
            <S.StatBody>
              <S.StatLabel>승인</S.StatLabel>
              <S.StatValue>{counts.APPROVED.toLocaleString()}</S.StatValue>
            </S.StatBody>
          </S.StatCard>

          <S.StatCard
            $active={statusTab === 'REJECTED'}
            onClick={() => handleStatusTab('REJECTED')}
          >
            <S.StatIcon $bg="#C9433D">
              <FaUserSlash />
            </S.StatIcon>
            <S.StatBody>
              <S.StatLabel>반려</S.StatLabel>
              <S.StatValue>{counts.REJECTED.toLocaleString()}</S.StatValue>
            </S.StatBody>
          </S.StatCard>
        </S.StatsGrid>

        {/* 필터 바 */}
        <S.FilterBar>
          <S.SearchWrap>
            <FaSearch />
            <S.SearchInput
              placeholder="이름·이메일·사업자명·사업자번호로 검색"
              value={search}
              onChange={handleSearch}
            />
          </S.SearchWrap>

          <S.FilterRight>
            <S.StyledSelect value={sortOrder} onChange={handleSort}>
              <option value="NEWEST">최신 신청순</option>
              <option value="OLDEST">오래된 신청순</option>
            </S.StyledSelect>
          </S.FilterRight>
        </S.FilterBar>

        {/* 테이블 */}
        <S.TableWrap>
          <S.Table>
            <thead>
              <tr>
                <S.Th $w="70px">번호</S.Th>
                <S.Th>신청자</S.Th>
                <S.Th $w="220px">사업자명</S.Th>
                <S.Th $w="150px">사업자번호</S.Th>
                <S.Th $w="120px">신청일</S.Th>
                <S.Th $w="110px">상태</S.Th>
                <S.Th $w="120px">관리</S.Th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <S.Td colSpan={7}>
                    <S.EmptyMessage>
                      {loading ? '불러오는 중...' : '신청 내역이 없습니다.'}
                    </S.EmptyMessage>
                  </S.Td>
                </tr>
              ) : (
                pageData.map((h) => (
                  <tr key={h.hostId}>
                    <S.Td>{h.hostId}</S.Td>
                    <S.Td>
                      <S.HostCell>
                        <S.HostName>{h.name}</S.HostName>
                        <S.HostEmail>{h.email}</S.HostEmail>
                      </S.HostCell>
                    </S.Td>
                    <S.Td>{h.businessName}</S.Td>
                    <S.Td>{h.businessNo}</S.Td>
                    <S.Td>{h.createdAt}</S.Td>
                    <S.Td>
                      <S.StateBadge $state={h.state}>
                        {STATE_LABEL[h.state]}
                      </S.StateBadge>
                    </S.Td>
                    <S.Td>
                      <S.ActionBtn
                        onClick={() =>
                          navigate(`/admin/host/apply/${h.hostId}`)
                        }
                      >
                        상세
                      </S.ActionBtn>
                    </S.Td>
                  </tr>
                ))
              )}
            </tbody>
          </S.Table>
        </S.TableWrap>

        {/* 페이지네이션 */}
        {totalPages > 1 &&
          (() => {
            const {
              pages,
              hasPrevBlock,
              hasNextBlock,
              prevBlockPage,
              nextBlockPage,
            } = getPageNumbers(currentPage, totalPages);
            return (
              <S.Pagination>
                <S.PageBtn
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  이전
                </S.PageBtn>

                {/* 이전 묶음으로 점프 */}
                {hasPrevBlock && (
                  <S.PageBtn onClick={() => setPage(prevBlockPage)}>
                    …
                  </S.PageBtn>
                )}

                {pages.map((p) => (
                  <S.PageBtn
                    key={p}
                    $active={p === currentPage}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </S.PageBtn>
                ))}

                {/* 다음 묶음으로 점프 */}
                {hasNextBlock && (
                  <S.PageBtn onClick={() => setPage(nextBlockPage)}>
                    …
                  </S.PageBtn>
                )}

                <S.PageBtn
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  다음
                </S.PageBtn>
              </S.Pagination>
            );
          })()}
      </PageLayout>
    </S.PageContainer>
  );
}

export default HostApplyListPage;
