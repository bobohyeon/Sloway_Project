import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Checkbox,
  Modal,
  Pagination,
  EmptyState,
  Tabs,
  Card,
} from '../../pay_shared/components';

// ─── Mock 데이터 (백엔드 연동 시 GET /api/admin/faqs 로 대체) ────────────────
const MOCK_FAQS = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  question: [
    '예약 취소는 어떻게 하나요?',
    '환불은 얼마나 걸리나요?',
    '결제 수단을 변경할 수 있나요?',
    '1:1 채팅은 어떻게 사용하나요?',
    '비밀번호를 잊어버렸어요.',
    '쿠폰은 어떻게 사용하나요?',
  ][i % 6],
  category: ['예약·결제', '취소·환불', '계정', '서비스 이용', '기타'][i % 5],
  order: i + 1,
  status: i % 7 === 6 ? 'inactive' : 'active',
  createdAt: `2026.0${(i % 5) + 1}.${String((i % 28) + 1).padStart(2, '0')}`,
}));

const CATEGORY_OPTIONS = [
  '전체',
  '예약·결제',
  '취소·환불',
  '계정',
  '서비스 이용',
  '기타',
];

const TAB_ITEMS = [
  { label: '전체', value: 'all', count: MOCK_FAQS.length },
  {
    label: '게시중',
    value: 'active',
    count: MOCK_FAQS.filter((f) => f.status === 'active').length,
  },
  {
    label: '미게시',
    value: 'inactive',
    count: MOCK_FAQS.filter((f) => f.status === 'inactive').length,
  },
];

const PAGE_SIZE = 10;

export default function FaqManagePage() {
  const navigate = useNavigate();

  const [tab, setTab] = useState('all');
  const [category, setCategory] = useState('전체');
  const [inputKeyword, setInputKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);

  // ─── 필터 (백엔드 연동 시 쿼리 파라미터로 이관) ──────────────────────────
  const filtered = MOCK_FAQS.filter((f) => {
    const matchTab = tab === 'all' || f.status === tab;
    const matchCat = category === '전체' || f.category === category;
    const matchKw = f.question.includes(keyword);
    return matchTab && matchCat && matchKw;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isAllSelected =
    paged.length > 0 && paged.every((f) => selectedIds.includes(f.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paged.map((f) => f.id).includes(id))
      );
    } else {
      setSelectedIds((prev) => [
        ...new Set([...prev, ...paged.map((f) => f.id)]),
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
    // 백엔드 연동 시: DELETE /api/admin/faqs { ids: selectedIds }
    setSelectedIds([]);
    setDeleteModal(false);
  };

  return (
    <Wrap>
      <PageHeader>
        <div>
          <PageTitle>FAQ 관리</PageTitle>
          <PageDesc>자주 묻는 질문을 등록하고 노출 순서를 관리합니다.</PageDesc>
        </div>
        <Button onClick={() => navigate('/admin/faqs/new')}>+ FAQ 등록</Button>
      </PageHeader>

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

      {/* 검색/필터 */}
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
              placeholder="질문으로 검색"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              aria-label="FAQ 검색"
            />
            <Button size="sm" variant="secondary" onClick={handleSearch}>
              검색
            </Button>
          </SearchGroup>
        </FilterRow>
      </FilterCard>

      {/* 테이블 */}
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
            icon="❓"
            title="등록된 FAQ가 없습니다"
            description="자주 묻는 질문을 등록해 보세요."
            action={
              <Button onClick={() => navigate('/admin/faqs/new')}>
                FAQ 등록
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
                      순서
                    </Th>
                    <Th $w="120px" $center>
                      카테고리
                    </Th>
                    <Th>질문</Th>
                    <Th $w="80px" $center>
                      상태
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
                  {paged.map((faq) => (
                    <Tr key={faq.id}>
                      <Td>
                        <Checkbox
                          checked={selectedIds.includes(faq.id)}
                          onChange={() => handleSelect(faq.id)}
                        />
                      </Td>
                      <Td $center>
                        {/* 
                          실무: 드래그 앤 드롭 순서 변경 시
                          react-beautiful-dnd 또는 @dnd-kit/core 도입 권장
                          지금은 순서 번호만 표시
                        */}
                        <OrderNum>{faq.order}</OrderNum>
                      </Td>
                      <Td $center>
                        <Badge size="sm" variant="muted">
                          {faq.category}
                        </Badge>
                      </Td>
                      <Td>
                        <QuestionText
                          onClick={() => navigate(`/admin/faqs/${faq.id}/edit`)}
                        >
                          {faq.question}
                        </QuestionText>
                      </Td>
                      <Td $center>
                        <Badge
                          size="sm"
                          variant={
                            faq.status === 'active' ? 'success' : 'muted'
                          }
                        >
                          {faq.status === 'active' ? '게시중' : '미게시'}
                        </Badge>
                      </Td>
                      <Td $center $muted>
                        {faq.createdAt}
                      </Td>
                      <Td $center>
                        <ActionGroup>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/admin/faqs/${faq.id}/edit`)
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
        title="FAQ 삭제"
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
          선택한 <strong>{selectedIds.length}개</strong>의 FAQ를
          삭제하시겠습니까?
          <br />
          삭제된 항목은 복구할 수 없습니다.
        </ModalText>
      </Modal>
    </Wrap>
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
  min-width: 640px;
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

const OrderNum = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--gray-100);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gray-500);
`;

const QuestionText = styled.span`
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-800);
  cursor: pointer;

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
