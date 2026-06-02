import { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import api from '../../../../app/api/axiosApi';

const CATEGORY_OPTIONS = [
  { label: '전체',   value: '' },
  { label: '예약',   value: 'RESERVATION' },
  { label: '결제',   value: 'PAYMENT' },
  { label: '공간',   value: 'PLACE' },
  { label: '기타',   value: 'OTHER' },
];

const STATUS_OPTIONS = [
  { label: '전체',    value: '' },
  { label: '답변 대기', value: 'PENDING' },
  { label: '답변 완료', value: 'ANSWERED' },
];

const STATUS_CONFIG = {
  PENDING:  { label: '답변 대기', bg: 'rgba(180,180,180,0.12)', color: 'var(--gray-500)' },
  ANSWERED: { label: '답변 완료', bg: 'rgba(80,170,100,0.12)',  color: '#2e7d4f' },
};

const fmtDate = (iso) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

export default function InquiryManagePage() {
  // ── 목록 상태 ──────────────────────────────────────────────────────────────
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [keyword, setKeyword] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [inquiries, setInquiries] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [counts, setCounts] = useState({ total: 0, pending: 0, answered: 0 });

  // ── 상세/답변 패널 상태 ────────────────────────────────────────────────────
  const [selected, setSelected] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── 목록 조회 ─────────────────────────────────────────────────────────────
  const fetchList = useCallback(async () => {
    const { data } = await api.get('/inquiry', {
      params: {
        page: page - 1,
        size: 10,
        sort: 'createdAt,DESC',
        status: filterStatus || undefined,
        category: filterCategory || undefined,
        keyword: keyword || undefined,
      },
    });
    setInquiries(data.content);
    setTotalPages(data.totalPages);
  }, [page, filterStatus, filterCategory, keyword]);

  // ── 요약 카운트 (최초 마운트 + 목록 갱신 후) ───────────────────────────────
  const fetchCounts = useCallback(async () => {
    const [all, pending, answered] = await Promise.all([
      api.get('/inquiry', { params: { size: 1 } }),
      api.get('/inquiry', { params: { size: 1, status: 'PENDING' } }),
      api.get('/inquiry', { params: { size: 1, status: 'ANSWERED' } }),
    ]);
    setCounts({
      total: all.data.totalElements,
      pending: pending.data.totalElements,
      answered: answered.data.totalElements,
    });
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // ── 핸들러 ────────────────────────────────────────────────────────────────
  const handleSearch = () => {
    setKeyword(inputKeyword);
    setPage(1);
  };

  const handleSelectRow = async (inq) => {
    const { data } = await api.get(`/inquiry/${inq.id}`);
    setSelected(data);
    setAnswerText(data.replyContent ?? '');
    setIsEditing(false);
  };

  const handleClosePanel = () => {
    setSelected(null);
    setAnswerText('');
    setIsEditing(false);
  };

  const handleAnswerSubmit = async () => {
    if (!answerText.trim() || !selected) return;
    setIsSaving(true);
    try {
      const isNew = !selected.replyContent;
      if (isNew) {
        await api.post(`/inquiry/${selected.id}/reply`, { content: answerText });
      } else {
        await api.put(`/inquiry/${selected.id}/reply`, { content: answerText });
      }
      // 패널 갱신
      const { data } = await api.get(`/inquiry/${selected.id}`);
      setSelected(data);
      setAnswerText(data.replyContent ?? '');
      setIsEditing(false);
      fetchList();
      fetchCounts();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout
      title="문의사항 관리"
      description="접수된 문의를 확인하고 답변을 등록하세요"
    >
      <Divider />

      {/* ── 요약 카드 ────────────────────────────────────────────────────── */}
      <SummaryRow>
        {[
          { label: '전체',    value: counts.total,   color: 'var(--gray-700)' },
          { label: '답변 대기', value: counts.pending,  color: 'var(--gray-400)' },
          { label: '답변 완료', value: counts.answered, color: '#2e7d4f' },
        ].map(({ label, value, color }) => (
          <SummaryCard key={label}>
            <SummaryValue style={{ color }}>{value}</SummaryValue>
            <SummaryLabel>{label}</SummaryLabel>
          </SummaryCard>
        ))}
      </SummaryRow>

      {/* ── 필터 + 검색 ──────────────────────────────────────────────────── */}
      <FilterRow>
        <FilterGroup>
          <FilterLabel>상태</FilterLabel>
          <SelectBox
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            aria-label="상태 필터"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </SelectBox>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>카테고리</FilterLabel>
          <SelectBox
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            aria-label="카테고리 필터"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </SelectBox>
        </FilterGroup>

        <SearchGroup>
          <SearchInput
            placeholder="제목 또는 회원명 검색"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            aria-label="문의 검색"
          />
          <SearchBtn type="button" onClick={handleSearch}>
            검색
          </SearchBtn>
        </SearchGroup>
      </FilterRow>

      {/* ── 메인 영역: 목록 + 상세 패널 ─────────────────────────────────── */}
      <MainArea $panelOpen={!!selected}>
        {/* 목록 테이블 */}
        <TableSection>
          <TableWrap>
            <Table>
              <colgroup>
                <col style={{ width: '44px' }} />
                <col style={{ width: '80px' }} />
                <col />
                <col style={{ width: '90px' }} />
                <col style={{ width: '96px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '96px' }} />
              </colgroup>
              <Thead>
                <tr>
                  <Th>번호</Th>
                  <Th>카테고리</Th>
                  <Th>제목</Th>
                  <Th>작성자</Th>
                  <Th>상태</Th>
                  <Th>등록일</Th>
                  <Th>답변일</Th>
                </tr>
              </Thead>
              <tbody>
                {inquiries.length === 0 ? (
                  <tr>
                    <EmptyTd colSpan={7}>
                      <EmptyMsg>조회된 문의가 없습니다</EmptyMsg>
                    </EmptyTd>
                  </tr>
                ) : (
                  inquiries.map((inq) => {
                    const st = STATUS_CONFIG[inq.status] ?? STATUS_CONFIG.PENDING;
                    const isActive = selected?.id === inq.id;
                    const categoryLabel = CATEGORY_OPTIONS.find(c => c.value === inq.category)?.label ?? inq.category;
                    return (
                      <Tr
                        key={inq.id}
                        $active={isActive}
                        onClick={() => handleSelectRow(inq)}
                        tabIndex={0}
                        role="button"
                        aria-label={`문의 상세 보기: ${inq.title}`}
                        onKeyDown={(e) => e.key === 'Enter' && handleSelectRow(inq)}
                      >
                        <Td center>{inq.id}</Td>
                        <Td>
                          <CategoryChip>{categoryLabel}</CategoryChip>
                        </Td>
                        <Td>
                          <TitleText $unread={inq.status === 'PENDING'}>
                            {inq.title}
                          </TitleText>
                        </Td>
                        <Td>
                          <UserName>{inq.writerName}</UserName>
                        </Td>
                        <Td center>
                          <StatusChip style={{ background: st.bg, color: st.color }}>
                            {st.label}
                          </StatusChip>
                        </Td>
                        <Td center muted>{fmtDate(inq.createdAt)}</Td>
                        <Td center muted>{inq.answeredAt ? fmtDate(inq.answeredAt) : '—'}</Td>
                      </Tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </TableWrap>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <PaginationRow aria-label="페이지 탐색">
              <PageBtn
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="이전 페이지"
              >
                ‹
              </PageBtn>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PageBtn
                  key={p}
                  type="button"
                  $active={p === page}
                  onClick={() => setPage(p)}
                  aria-label={`${p}페이지`}
                  aria-current={p === page ? 'page' : undefined}
                >
                  {p}
                </PageBtn>
              ))}
              <PageBtn
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="다음 페이지"
              >
                ›
              </PageBtn>
            </PaginationRow>
          )}
        </TableSection>

        {/* ── 상세 + 답변 패널 ─────────────────────────────────────────── */}
        {selected && (
          <DetailPanel>
            {/* 패널 헤더 */}
            <PanelHeader>
              <PanelTitle>문의 상세</PanelTitle>
              <CloseBtn type="button" onClick={handleClosePanel} aria-label="패널 닫기">
                ✕
              </CloseBtn>
            </PanelHeader>

            {/* 문의 메타 */}
            <MetaGrid>
              <MetaItem>
                <MetaKey>작성자</MetaKey>
                <MetaVal>{selected.writerName}</MetaVal>
              </MetaItem>
              <MetaItem>
                <MetaKey>카테고리</MetaKey>
                <MetaVal>
                  {CATEGORY_OPTIONS.find(c => c.value === selected.category)?.label ?? selected.category}
                </MetaVal>
              </MetaItem>
              <MetaItem>
                <MetaKey>등록일</MetaKey>
                <MetaVal>{fmtDate(selected.createdAt)}</MetaVal>
              </MetaItem>
              <MetaItem>
                <MetaKey>상태</MetaKey>
                <MetaVal>
                  <StatusChip
                    style={{
                      background: STATUS_CONFIG[selected.status]?.bg,
                      color: STATUS_CONFIG[selected.status]?.color,
                    }}
                  >
                    {STATUS_CONFIG[selected.status]?.label ?? selected.status}
                  </StatusChip>
                </MetaVal>
              </MetaItem>
            </MetaGrid>

            {/* 문의 제목 + 본문 */}
            <InquiryBox>
              <InquiryBoxTitle>Q. {selected.title}</InquiryBoxTitle>
              <InquiryBoxContent>{selected.content}</InquiryBoxContent>
            </InquiryBox>

            {/* 답변 영역 */}
            <AnswerSection>
              <AnswerSectionHeader>
                <AnswerSectionTitle>답변</AnswerSectionTitle>
                {selected.replyContent && !isEditing && (
                  <EditBtn
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setAnswerText(selected.replyContent);
                    }}
                  >
                    수정
                  </EditBtn>
                )}
              </AnswerSectionHeader>

              {/* 등록된 답변 보기 */}
              {selected.replyContent && !isEditing ? (
                <AnswerBox>
                  <AnswerContent>{selected.replyContent}</AnswerContent>
                  {selected.answeredAt && (
                    <AnswerMeta>{fmtDate(selected.answeredAt)}</AnswerMeta>
                  )}
                </AnswerBox>
              ) : (
                /* 답변 입력 폼 */
                <AnswerForm>
                  <AnswerTextarea
                    placeholder="답변 내용을 입력하세요..."
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows={6}
                    aria-label="답변 입력"
                    maxLength={2000}
                  />
                  <TextareaFooter>
                    <CharCount $warn={answerText.length > 1800}>
                      {answerText.length} / 2000
                    </CharCount>
                    <FormActions>
                      {isEditing && (
                        <CancelBtn
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setAnswerText(selected.replyContent ?? '');
                          }}
                        >
                          취소
                        </CancelBtn>
                      )}
                      <SubmitBtn
                        type="button"
                        onClick={handleAnswerSubmit}
                        disabled={!answerText.trim() || isSaving}
                      >
                        {isSaving ? '저장 중...' : isEditing ? '수정 완료' : '답변 등록'}
                      </SubmitBtn>
                    </FormActions>
                  </TextareaFooter>
                </AnswerForm>
              )}
            </AnswerSection>
          </DetailPanel>
        )}
      </MainArea>
    </PageLayout>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: 0 0 var(--space-4) 0;
`;

const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-4);

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SummaryCard = styled.div`
  padding: 16px 20px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SummaryValue = styled.p`
  font-size: 1.6rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1;
`;

const SummaryLabel = styled.p`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.8rem;
  color: var(--gray-500);
  font-weight: 500;
  white-space: nowrap;
`;

const SelectBox = styled.select`
  height: 36px;
  padding: 0 30px 0 12px;
  font-size: 0.85rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--gray-700);
  font-family: inherit;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  transition: border-color 140ms;

  &:focus {
    border-color: var(--sage);
  }
`;

const SearchGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;

  @media (max-width: 600px) {
    margin-left: 0;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  height: 36px;
  padding: 0 14px;
  font-size: 0.85rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--gray-800);
  font-family: inherit;
  outline: none;
  width: 220px;
  transition: border-color 140ms;

  &:focus { border-color: var(--sage); }
  &::placeholder { color: var(--gray-400); }

  @media (max-width: 600px) { width: 100%; }
`;

const SearchBtn = styled.button`
  height: 36px;
  padding: 0 18px;
  font-size: 0.85rem;
  font-weight: 500;
  background: var(--sage);
  color: var(--white);
  border-radius: var(--radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: filter 140ms;

  &:hover { filter: brightness(0.92); }
`;

const MainArea = styled.div`
  display: grid;
  grid-template-columns: ${(p) => (p.$panelOpen ? '1fr 420px' : '1fr')};
  gap: var(--space-4);
  align-items: flex-start;
  transition: grid-template-columns 200ms ease;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const TableSection = styled.div``;

const TableWrap = styled.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--white);
  margin-bottom: var(--space-3);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Thead = styled.thead`
  background: var(--gray-50, #f9f9f8);
  border-bottom: 1px solid var(--gray-200);
`;

const Th = styled.th`
  padding: 11px 14px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-500);
  text-align: center;
  white-space: nowrap;
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background 130ms;
  background: ${(p) => (p.$active ? 'rgba(168,184,159,0.08)' : 'transparent')};

  &:not(:last-child) { border-bottom: 1px solid var(--gray-100); }
  &:hover { background: var(--gray-50, #fafaf9); }
  &:focus-visible { outline: 2px solid var(--sage); outline-offset: -2px; }

  ${(p) =>
    p.$active &&
    css`
      border-left: 3px solid var(--sage) !important;
    `}
`;

const Td = styled.td`
  padding: 13px 14px;
  font-size: 0.85rem;
  color: ${(p) => (p.muted ? 'var(--gray-400)' : 'var(--gray-700)')};
  text-align: ${(p) => (p.center ? 'center' : 'left')};
  vertical-align: middle;
  white-space: nowrap;
`;

const EmptyTd = styled.td`
  padding: 48px;
  text-align: center;
`;

const EmptyMsg = styled.p`
  font-size: 0.88rem;
  color: var(--gray-400);
`;

const CategoryChip = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--sage);
  background: rgba(168, 184, 159, 0.15);
  padding: 3px 8px;
  border-radius: var(--radius-full);
`;

const TitleText = styled.span`
  font-weight: ${(p) => (p.$unread ? '600' : '400')};
  color: ${(p) => (p.$unread ? 'var(--gray-800)' : 'var(--gray-600)')};
  display: block;
  max-width: 260px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const UserName = styled.p`
  font-size: 0.85rem;
  color: var(--gray-700);
`;

const StatusChip = styled.span`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: var(--radius-full);
  white-space: nowrap;
`;

const PaginationRow = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const PageBtn = styled.button`
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => (p.$active ? 'var(--sage)' : 'var(--gray-200)')};
  background: ${(p) => (p.$active ? 'var(--sage)' : 'var(--white)')};
  color: ${(p) => (p.$active ? 'var(--white)' : 'var(--gray-600)')};
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.disabled ? 0.4 : 1)};
  transition: all 140ms;

  &:hover:not(:disabled) {
    border-color: var(--sage);
    color: ${(p) => (p.$active ? 'var(--white)' : 'var(--sage)')};
  }
`;

const DetailPanel = styled.aside`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: sticky;
  top: 24px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;

  @media (max-width: 960px) {
    position: static;
    max-height: none;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-100);
  background: var(--gray-50, #f9f9f8);
  position: sticky;
  top: 0;
  z-index: 1;
`;

const PanelTitle = styled.p`
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--gray-800);
`;

const CloseBtn = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--gray-400);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 140ms;

  &:hover { background: var(--gray-100); color: var(--gray-700); }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border-bottom: 1px solid var(--gray-100);
`;

const MetaItem = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid var(--gray-100);

  &:nth-child(odd) { border-right: 1px solid var(--gray-100); }
`;

const MetaKey = styled.p`
  font-size: 0.72rem;
  color: var(--gray-400);
  font-weight: 500;
  margin-bottom: 3px;
`;

const MetaVal = styled.p`
  font-size: 0.82rem;
  color: var(--gray-700);
  font-weight: 500;
`;

const InquiryBox = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-100);
  background: var(--gray-50, #fafaf9);
`;

const InquiryBoxTitle = styled.p`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
  line-height: 1.5;
`;

const InquiryBoxContent = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  line-height: 1.7;
  white-space: pre-wrap;
`;

const AnswerSection = styled.div`
  padding: 16px 20px;
`;

const AnswerSectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const AnswerSectionTitle = styled.p`
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--gray-800);
`;

const EditBtn = styled.button`
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--sage);
  border: 1px solid var(--sage);
  border-radius: var(--radius-md);
  padding: 3px 10px;
  cursor: pointer;
  transition: all 140ms;

  &:hover { background: var(--sage); color: var(--white); }
`;

const AnswerBox = styled.div`
  background: rgba(168, 184, 159, 0.08);
  border: 1px solid rgba(168, 184, 159, 0.3);
  border-radius: var(--radius-md);
  padding: 14px 16px;
`;

const AnswerContent = styled.p`
  font-size: 0.88rem;
  color: var(--gray-700);
  line-height: 1.7;
  white-space: pre-wrap;
  margin-bottom: 10px;
`;

const AnswerMeta = styled.p`
  font-size: 0.75rem;
  color: var(--gray-400);
  text-align: right;
`;

const AnswerForm = styled.div``;

const AnswerTextarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  font-size: 0.88rem;
  font-family: inherit;
  color: var(--gray-800);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  resize: vertical;
  outline: none;
  line-height: 1.7;
  transition: border-color 140ms;
  box-sizing: border-box;

  &:focus { border-color: var(--sage); }
  &::placeholder { color: var(--gray-400); }
`;

const TextareaFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
`;

const CharCount = styled.span`
  font-size: 0.75rem;
  color: ${(p) => (p.$warn ? '#c04040' : 'var(--gray-400)')};
`;

const FormActions = styled.div`
  display: flex;
  gap: var(--space-2);
`;

const CancelBtn = styled.button`
  height: 34px;
  padding: 0 16px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--gray-600);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  cursor: pointer;
  transition: border-color 140ms;

  &:hover { border-color: var(--gray-400); }
`;

const SubmitBtn = styled.button`
  height: 34px;
  padding: 0 18px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${(p) => (p.disabled ? 'var(--gray-200)' : 'var(--sage)')};
  color: ${(p) => (p.disabled ? 'var(--gray-400)' : 'var(--white)')};
  border-radius: var(--radius-md);
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  transition: filter 140ms;

  &:hover:not(:disabled) { filter: brightness(0.92); }
`;
