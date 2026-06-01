import React, { useState } from 'react';
import {
  FaSearch,
  FaBuilding,
  FaCheckCircle,
  FaUserSlash,
} from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useHostList } from '../../hooks/useHostList';
import * as S from './HostListPage.styled';

const STATE_LABEL = {
  ACTIVE: '정상 운영',
  REVOKED: '정지',
};

function HostListPage() {
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
    revoke,
    restore,
  } = useHostList();

  // 박탈 모달
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [revokeReason, setRevokeReason] = useState('');

  // 박탈 사유 보기 모달
  const [reasonTarget, setReasonTarget] = useState(null);

  const openRevoke = (host) => {
    setRevokeTarget(host);
    setRevokeReason('');
  };

  const handleRevokeConfirm = async () => {
    if (!revokeReason.trim()) {
      alert('박탈 사유를 입력해주세요.');
      return;
    }
    if (
      !window.confirm(
        `${revokeTarget.businessName}(${revokeTarget.name}) 호스트의 자격을 박탈하시겠습니까?`
      )
    )
      return;

    try {
      await revoke(revokeTarget.hostId, revokeReason);
      setRevokeTarget(null);
    } catch (err) {
      alert(err.response?.data?.message ?? '박탈 처리에 실패했습니다.');
    }
  };

  const handleRestore = async (host) => {
    try {
      await restore(host);
    } catch (err) {
      alert(err.response?.data?.message ?? '복구 처리에 실패했습니다.');
    }
  };

  return (
    <S.PageContainer>
      <PageLayout
        title="호스트 목록"
        description="운영 중인 호스트를 조회하고 자격을 관리하세요"
      >
        {/* 통계 카드 (탭) */}
        <S.StatsGrid>
          <S.StatCard
            $active={statusTab === 'ALL'}
            onClick={() => handleStatusTab('ALL')}
          >
            <S.StatIcon $bg="#a8b89f">
              <FaBuilding />
            </S.StatIcon>
            <S.StatBody>
              <S.StatLabel>전체</S.StatLabel>
              <S.StatValue>{counts.ALL.toLocaleString()}</S.StatValue>
            </S.StatBody>
          </S.StatCard>

          <S.StatCard
            $active={statusTab === 'ACTIVE'}
            onClick={() => handleStatusTab('ACTIVE')}
          >
            <S.StatIcon $bg="#7A8B71">
              <FaCheckCircle />
            </S.StatIcon>
            <S.StatBody>
              <S.StatLabel>정상 운영</S.StatLabel>
              <S.StatValue>{counts.ACTIVE.toLocaleString()}</S.StatValue>
            </S.StatBody>
          </S.StatCard>

          <S.StatCard
            $active={statusTab === 'REVOKED'}
            onClick={() => handleStatusTab('REVOKED')}
          >
            <S.StatIcon $bg="#C9433D">
              <FaUserSlash />
            </S.StatIcon>
            <S.StatBody>
              <S.StatLabel>정지</S.StatLabel>
              <S.StatValue>{counts.REVOKED.toLocaleString()}</S.StatValue>
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
              <option value="NEWEST">최신순</option>
              <option value="OLDEST">오래된순</option>
            </S.StyledSelect>
          </S.FilterRight>
        </S.FilterBar>

        {/* 테이블 */}
        <S.TableWrap>
          <S.Table>
            <thead>
              <tr>
                <S.Th $w="70px">번호</S.Th>
                <S.Th>호스트</S.Th>
                <S.Th $w="200px">사업자명</S.Th>
                <S.Th $w="140px">사업자번호</S.Th>
                <S.Th $w="240px">상태</S.Th>
                <S.Th $w="120px">관리</S.Th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <S.Td colSpan={6}>
                    <S.EmptyMessage>
                      {loading ? '불러오는 중...' : '호스트가 없습니다.'}
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
                    <S.Td>
                      <S.StateBadge $state={h.state}>
                        {STATE_LABEL[h.state]}
                      </S.StateBadge>
                      {h.state === 'REVOKED' && h.rejectReason && (
                        <S.ReasonLink onClick={() => setReasonTarget(h)}>
                          사유 보기
                        </S.ReasonLink>
                      )}
                    </S.Td>
                    <S.Td>
                      <S.ActionGroup>
                        {h.state === 'ACTIVE' && (
                          <S.ActionBtn $danger onClick={() => openRevoke(h)}>
                            자격 박탈
                          </S.ActionBtn>
                        )}
                        {h.state === 'REVOKED' && (
                          <S.ActionBtn onClick={() => handleRestore(h)}>
                            복구
                          </S.ActionBtn>
                        )}
                      </S.ActionGroup>
                    </S.Td>
                  </tr>
                ))
              )}
            </tbody>
          </S.Table>
        </S.TableWrap>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <S.Pagination>
            <S.PageBtn
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              이전
            </S.PageBtn>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <S.PageBtn
                key={p}
                $active={p === currentPage}
                onClick={() => setPage(p)}
              >
                {p}
              </S.PageBtn>
            ))}
            <S.PageBtn
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              다음
            </S.PageBtn>
          </S.Pagination>
        )}
      </PageLayout>

      {/* 박탈 모달 */}
      {revokeTarget && (
        <S.ModalOverlay onClick={() => setRevokeTarget(null)}>
          <S.ModalCard onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>호스트 자격 박탈</S.ModalTitle>
            <S.ModalDesc>
              <strong>
                {revokeTarget.businessName} ({revokeTarget.name})
              </strong>{' '}
              호스트의 자격을 박탈합니다. 박탈 후 호스트 권한이 회수됩니다.
            </S.ModalDesc>
            <S.FormTextarea
              rows="4"
              placeholder="박탈 사유를 입력하세요 (예: 사업자등록 위조 적발)"
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
              maxLength={300}
            />
            <S.HelpText>{revokeReason.length} / 300</S.HelpText>
            <S.ModalActions>
              <S.ModalBtn onClick={() => setRevokeTarget(null)}>
                취소
              </S.ModalBtn>
              <S.ModalBtn $danger onClick={handleRevokeConfirm}>
                박탈 처리
              </S.ModalBtn>
            </S.ModalActions>
          </S.ModalCard>
        </S.ModalOverlay>
      )}

      {/* 박탈 사유 보기 모달 */}
      {reasonTarget && (
        <S.ModalOverlay onClick={() => setReasonTarget(null)}>
          <S.ModalCard onClick={(e) => e.stopPropagation()}>
            <S.ModalTitle>박탈 사유</S.ModalTitle>
            <S.ModalDesc>
              <strong>
                {reasonTarget.businessName} ({reasonTarget.name})
              </strong>{' '}
              호스트의 자격이 박탈된 사유입니다.
            </S.ModalDesc>
            <S.ReasonBox>{reasonTarget.rejectReason}</S.ReasonBox>
            <S.ModalActions>
              <S.ModalBtn onClick={() => setReasonTarget(null)}>
                닫기
              </S.ModalBtn>
            </S.ModalActions>
          </S.ModalCard>
        </S.ModalOverlay>
      )}
    </S.PageContainer>
  );
}

export default HostListPage;
