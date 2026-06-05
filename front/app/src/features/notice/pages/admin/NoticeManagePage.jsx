import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import {
  Badge,
  Button,
  Checkbox,
  Modal,
  Pagination,
  EmptyState,
  Tabs,
  Card,
} from '../../../pay_shared/components';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import api from '../../../../app/api/axiosApi';

const CATEGORY_OPTIONS = [
  { label: '전체', value: '' },
  { label: '서비스', value: 'SERVICE' },
  { label: '이벤트', value: 'EVENT' },
  { label: '점검', value: 'INSPECTION' },
  { label: '기타', value: 'OTHER' },
];
const TAB_ITEMS = [
  { label: '전체', value: 'ALL' },
  { label: '게시중', value: 'ACTIVE' },
  { label: '미게시', value: 'INACTIVE' },
];
const fmtDate = (iso) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

export default function NoticeManagePage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState('ALL');
  const [category, setCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  const [notices, setNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchNotices = useCallback(async () => {
    const { data } = await api.get('/notice', {
      params: {
        page: page - 1,
        size: 10,
        sort: 'createdAt,DESC',
        status: tab,
        category: category || undefined,
        keyword: keyword || undefined,
      },
    });
    setNotices(data.content);
    setTotalPages(data.totalPages);
    setTotalElements(data.totalElements);
  }, [tab, category, keyword, page]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const paged = notices;
  const isAllSelected =
    paged.length > 0 && paged.every((n) => selectedIds.includes(n.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paged.map((n) => n.id).includes(id))
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...paged.map((n) => n.id)]),
      ]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    setKeyword(inputKeyword);
    setPage(1);
  };

  const handleDelete = async () => {
    await api.delete('/notice', { data: selectedIds });
    setSelectedIds([]);
    setDeleteModal(false);
    fetchNotices();
  };

  return (
    <PageLayout
      title="공지사항 관리"
      description="공지사항을 등록하고 노출 순서를 관리합니다"
      actions={
        <Button onClick={() => navigate('/admin/notice/form')}>
          + 공지사항 등록
        </Button>
      }
    >
      {/* 탭 */}
      <TabWrap>
        <Tabs
          items={TAB_ITEMS}
          value={tab}
          onChange={(v) => {
            setTab(v);
            setPage(1);
          }}
        />
      </TabWrap>

      {/* 검색/필터 영역 */}
      <FilterCard padded>
        <FilterRow>
          <FilterGroup>
            <FilterLabel>카테고리</FilterLabel>
            <CategoryBtnGroup>
              {CATEGORY_OPTIONS.map((c) => (
                <CategoryBtn
                  key={c.label}
                  $active={category === c.value}
                  onClick={() => {
                    setCategory(c.value);
                    setPage(1);
                  }}
                  type="button"
                >
                  {c.label}
                </CategoryBtn>
              ))}
            </CategoryBtnGroup>
          </FilterGroup>
          <SearchGroup>
            <SearchInput
              placeholder="제목으로 검색"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="공지사항 제목 검색"
            />
            <Button size="sm" variant="secondary" onClick={handleSearch}>
              검색
            </Button>
          </SearchGroup>
        </FilterRow>
      </FilterCard>

      {/* 목록 테이블 */}
      <TableCard elevated>
        <TableToolbar>
          <TableCount>
            총 <strong>{totalElements}</strong>건
            {selectedIds.length > 0 && (
              <SelectedCount>{selectedIds.length}개 선택됨</SelectedCount>
            )}
          </TableCount>
          {selectedIds.length > 0 && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setDeleteModal(true)}
            >
              선택 삭제
            </Button>
          )}
        </TableToolbar>

        {paged.length === 0 ? (
          <EmptyState
            icon="📋"
            title="등록된 공지사항이 없습니다"
            description="새 공지사항을 등록해 보세요."
            action={
              <Button onClick={() => navigate('/admin/notice/form')}>
                공지사항 등록
              </Button>
            }
          />
        ) : (
          <>
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th $w="44px">
                      <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </Th>
                    <Th $w="60px" $center>
                      번호
                    </Th>
                    <Th $w="80px" $center>
                      카테고리
                    </Th>
                    <Th>제목</Th>
                    <Th $w="80px" $center>
                      상태
                    </Th>
                    <Th $w="70px" $center>
                      조회수
                    </Th>
                    <Th $w="110px" $center>
                      등록일
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((notice) => (
                    <Tr key={notice.id}>
                      <Td>
                        <Checkbox
                          checked={selectedIds.includes(notice.id)}
                          onChange={() => handleSelect(notice.id)}
                        />
                      </Td>
                      <Td $center $muted>
                        {notice.id}
                      </Td>
                      <Td $center>
                        <Badge size="sm" variant="muted">
                          {CATEGORY_OPTIONS.find(
                            (c) => c.value === notice.category
                          )?.label ?? notice.category}
                        </Badge>
                      </Td>
                      <Td>
                        <TitleCell>
                          <TitleText
                            onClick={() =>
                              navigate(`/notice/${notice.id}`, {
                                state: { from: '/admin/notice' },
                              })
                            }
                          >
                            {notice.title}
                          </TitleText>
                        </TitleCell>
                      </Td>
                      <Td $center>
                        <Badge
                          size="sm"
                          variant={
                            notice.status === 'ACTIVE' ? 'success' : 'muted'
                          }
                        >
                          {TAB_ITEMS.find((t) => t.value === notice.status)
                            ?.label ?? notice.status}
                        </Badge>
                      </Td>
                      <Td $center $muted>
                        {notice.viewCount}
                      </Td>
                      <Td $center $muted>
                        {fmtDate(notice.createdAt)}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </>
        )}
      </TableCard>

      {/* 삭제 확인 모달 */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="공지사항 삭제"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModal(false)}>
              취소
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              삭제
            </Button>
          </>
        }
      >
        <ModalText>
          선택한 <strong>{selectedIds.length}개</strong>의 공지사항을
          삭제하시겠습니까?
          <br />
          삭제된 게시물은 복구할 수 없습니다.
        </ModalText>
      </Modal>
    </PageLayout>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────
const TabWrap = styled.div`
  margin-bottom: var(--space-4);
`;

const FilterCard = styled(Card)`
  margin-bottom: var(--space-4);
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
`;

const FilterLabel = styled.span`
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--gray-600);
  white-space: nowrap;
`;

const CategoryBtnGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const CategoryBtn = styled.button`
  padding: 5px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  border-radius: var(--radius-full);
  border: 1px solid ${(p) => (p.$active ? 'var(--sage)' : 'var(--gray-200)')};
  background: ${(p) => (p.$active ? 'var(--sage)' : 'var(--white)')};
  color: ${(p) => (p.$active ? 'var(--white)' : 'var(--gray-600)')};
  transition: all 160ms ease;
  cursor: pointer;

  &:hover {
    border-color: var(--sage);
    color: ${(p) => (p.$active ? 'var(--white)' : 'var(--sage)')};
  }
`;

const SearchGroup = styled.div`
  display: flex;
  gap: var(--space-2);
  align-items: center;
`;

const SearchInput = styled.input`
  height: 36px;
  padding: 0 12px;
  font-size: 0.85rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--gray-800);
  min-width: 200px;
  font-family: inherit;
  outline: none;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
  }

  &::placeholder {
    color: var(--gray-400);
  }

  @media (max-width: 600px) {
    min-width: 140px;
  }
`;

const TableCard = styled(Card)`
  overflow: hidden;
`;

const TableToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  border-bottom: 1px solid var(--gray-200);
`;

const TableCount = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  gap: var(--space-2);

  strong {
    color: var(--gray-800);
    font-weight: 600;
  }
`;

const SelectedCount = styled.span`
  padding: 2px 10px;
  background: rgba(168, 184, 159, 0.18);
  color: var(--sage);
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: var(--radius-full);
`;

const TableWrap = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
`;

const Th = styled.th`
  padding: 10px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-500);
  text-align: ${(p) => (p.$center ? 'center' : 'left')};
  white-space: nowrap;
  border-bottom: 1px solid var(--gray-200);
  background: var(--gray-50, #fafaf9);
  width: ${(p) => p.$w || 'auto'};
`;

const Tr = styled.tr`
  transition: background 120ms ease;

  &:hover {
    background: var(--gray-50, #fafaf9);
  }

  &:not(:last-child) td {
    border-bottom: 1px solid var(--gray-100);
  }
`;

const Td = styled.td`
  padding: 12px 14px;
  font-size: 0.85rem;
  color: ${(p) => (p.$muted ? 'var(--gray-400)' : 'var(--gray-800)')};
  text-align: ${(p) => (p.$center ? 'center' : 'left')};
  vertical-align: middle;
`;

const TitleCell = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const TitleText = styled.span`
  cursor: pointer;
  color: var(--gray-800);
  font-weight: 500;
  font-size: 0.88rem;

  &:hover {
    color: var(--sage);
    text-decoration: underline;
  }
`;

const ModalText = styled.p`
  font-size: 0.92rem;
  color: var(--gray-700);
  line-height: 1.6;

  strong {
    color: #b85a4e;
  }
`;
