import { useState } from 'react';
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

// ─── Mock 데이터 (백엔드 연동 시 API 호출로 대체) ───────────────────────────
const MOCK_NOTICES = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title:
    i === 0
      ? '[중요] 서비스 이용약관 변경 안내'
      : `공지사항 제목입니다 ${i + 1}번`,
  category: ['서비스', '이벤트', '점검', '기타'][i % 4],
  isPinned: i < 2,
  isImportant: i < 3,
  views: Math.floor(Math.random() * 500) + 10,
  createdAt: `2026.0${(i % 5) + 1}.${String((i % 28) + 1).padStart(2, '0')}`,
  exposureStart: `2026.0${(i % 5) + 1}.01`,
  exposureEnd: i % 3 === 0 ? '2026.12.31' : null,
  status: i % 5 === 4 ? 'inactive' : 'active',
}));

const CATEGORY_OPTIONS = ['전체', '서비스', '이벤트', '점검', '기타'];

const TAB_ITEMS = [
  { label: '전체', value: 'all', count: MOCK_NOTICES.length },
  {
    label: '게시중',
    value: 'active',
    count: MOCK_NOTICES.filter((n) => n.status === 'active').length,
  },
  {
    label: '미게시',
    value: 'inactive',
    count: MOCK_NOTICES.filter((n) => n.status === 'inactive').length,
  },
];

export default function NoticeManagePage() {
  const navigate = useNavigate();

  // ─── 상태 (백엔드 연동 시 useQuery로 대체) ──────────────────────────────
  const [tab, setTab] = useState('all');
  const [category, setCategory] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const PAGE_SIZE = 10;

  // ─── 필터링 (백엔드 연동 시 쿼리 파라미터로 전달) ────────────────────────
  const filtered = MOCK_NOTICES.filter((n) => {
    const matchTab = tab === 'all' || n.status === tab;
    const matchCategory = category === '전체' || n.category === category;
    const matchKeyword = n.title.includes(keyword);
    return matchTab && matchCategory && matchKeyword;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // ─── 전체 선택 ───────────────────────────────────────────────────────────
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

  const handleDelete = () => {
    // 백엔드 연동 시: DELETE /api/admin/notices { ids: selectedIds }
    setSelectedIds([]);
    setDeleteModal(false);
  };

  return (
    <PageLayout
      title="공지사항 관리"
      description="공지사항을 등록하고 노출 순서를 관리합니다"
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
                  key={c}
                  $active={category === c}
                  onClick={() => {
                    setCategory(c);
                    setPage(1);
                  }}
                  type="button"
                >
                  {c}
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
            <Button onClick={() => navigate('/admin/notices/new')}>
              + 공지사항 등록
            </Button>
          </SearchGroup>
        </FilterRow>
      </FilterCard>

      {/* 목록 테이블 */}
      <TableCard elevated>
        <TableToolbar>
          <TableCount>
            총 <strong>{filtered.length}</strong>건
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
                    {/* <Th $w="80px" $center>
                      상태
                    </Th> */}
                    <Th $w="110px" $center>
                      노출 시작
                    </Th>
                    <Th $w="110px" $center>
                      노출 종료
                    </Th>
                    <Th $w="70px" $center>
                      조회수
                    </Th>
                    <Th $w="110px" $center>
                      등록일
                    </Th>
                    <Th $w="100px" $center>
                      관리
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((notice) => (
                    <Tr key={notice.id} $pinned={notice.isPinned}>
                      <Td>
                        <Checkbox
                          checked={selectedIds.includes(notice.id)}
                          onChange={() => handleSelect(notice.id)}
                        />
                      </Td>
                      <Td $center $muted>
                        {notice.isPinned ? '📌' : notice.id}
                      </Td>
                      <Td $center>
                        <Badge size="sm" variant="muted">
                          {notice.category}
                        </Badge>
                      </Td>
                      <Td>
                        <TitleCell>
                          {notice.isImportant && (
                            <Badge size="sm" variant="warning">
                              중요
                            </Badge>
                          )}
                          <TitleText
                            onClick={() =>
                              navigate(`/user/notice/${notice.id}`)
                            }
                          >
                            {notice.title}
                          </TitleText>
                        </TitleCell>
                      </Td>
                      {/* <Td $center>
                        <Badge
                          size="sm"
                          variant={
                            notice.status === 'active' ? 'success' : 'muted'
                          }
                        >
                          {notice.status === 'active' ? '게시중' : '미게시'}
                        </Badge>
                      </Td> */}
                      <Td $center $muted>
                        {notice.exposureStart}
                      </Td>
                      <Td $center $muted>
                        {notice.exposureEnd ?? '-'}
                      </Td>
                      <Td $center $muted>
                        {notice.views}
                      </Td>
                      <Td $center $muted>
                        {notice.createdAt}
                      </Td>
                      <Td $center>
                        <ActionGroup>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/admin/notice/form/${notice.id}`)
                            }
                          >
                            수정
                          </Button>
                        </ActionGroup>
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

const Wrap = styled.div`
  padding: var(--space-6);
  max-width: 100%;

  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const PageDesc = styled.p`
  font-size: 0.88rem;
  color: var(--gray-400);
`;

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
  min-width: 780px;
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
  background: ${(p) =>
    p.$pinned ? 'rgba(168, 184, 159, 0.05)' : 'transparent'};
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

const ActionGroup = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
`;

const ModalText = styled.p`
  font-size: 0.92rem;
  color: var(--gray-700);
  line-height: 1.6;

  strong {
    color: #b85a4e;
  }
`;
