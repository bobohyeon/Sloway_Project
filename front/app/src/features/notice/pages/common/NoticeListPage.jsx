import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Pagination,
  EmptyState,
  Card,
} from '../../../pay_shared/components';

// ─── Mock 데이터 (백엔드 연동 시 GET /api/notices?page=&category=&keyword= 로 대체) ─
const MOCK_NOTICES = Array.from({ length: 22 }, (_, i) => ({
  id: i + 1,
  title:
    i === 0
      ? '[중요] 서비스 이용약관 변경 안내'
      : `공지사항 제목입니다 ${i + 1}번`,
  category: ['서비스', '이벤트', '점검', '기타'][i % 4],
  isPinned: i < 2,
  isImportant: i < 3,
  isNew: i < 5, // 7일 이내 등록
  views: Math.floor(Math.random() * 500) + 10,
  createdAt: `2026.0${(i % 5) + 1}.${String((i % 28) + 1).padStart(2, '0')}`,
}));

const CATEGORY_OPTIONS = ['전체', '서비스', '이벤트', '점검', '기타'];
const PAGE_SIZE = 10;

export default function NoticeListPage() {
  const navigate = useNavigate();

  const [category, setCategory] = useState('전체');
  const [inputKeyword, setInputKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  // 고정 공지 / 일반 공지 분리 (백엔드에서 isPinned 필드로 정렬 처리 권장)
  const pinned = MOCK_NOTICES.filter((n) => n.isPinned);
  const normal = MOCK_NOTICES.filter((n) => !n.isPinned).filter((n) => {
    const matchCat = category === '전체' || n.category === category;
    const matchKw = n.title.includes(keyword);
    return matchCat && matchKw;
  });

  const totalPages = Math.ceil(normal.length / PAGE_SIZE);
  const paged = normal.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = () => {
    setKeyword(inputKeyword);
    setPage(1);
  };

  return (
    <Wrap>
      {/* 헤더 */}
      <PageHeader>
        <PageTitle>공지사항</PageTitle>
        <PageDesc>서비스 관련 중요한 소식을 전해드립니다.</PageDesc>
      </PageHeader>

      {/* 검색/카테고리 */}
      <FilterRow>
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
        <SearchGroup>
          <SearchInput
            placeholder="검색어를 입력하세요"
            value={inputKeyword}
            onChange={(e) => setInputKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            aria-label="공지사항 검색"
          />
          <SearchBtn type="button" onClick={handleSearch}>
            검색
          </SearchBtn>
        </SearchGroup>
      </FilterRow>

      {/* 공지 목록 */}
      <NoticeCard elevated>
        {/* 상단 고정 공지 */}
        {pinned.length > 0 && (
          <>
            {pinned.map((notice) => (
              <NoticeRow
                key={`pinned-${notice.id}`}
                $pinned
                onClick={() => navigate(`/user/notice/${notice.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === 'Enter' && navigate(`/user/notice/${notice.id}`)
                }
                aria-label={`공지: ${notice.title}`}
              >
                <NoticeMeta>
                  <PinnedBadge>📌 공지</PinnedBadge>
                  {notice.isImportant && (
                    <Badge size="sm" variant="warning">
                      중요
                    </Badge>
                  )}
                </NoticeMeta>
                <NoticeTitle $pinned>{notice.title}</NoticeTitle>
                <NoticeInfo>
                  <Badge size="sm" variant="muted">
                    {notice.category}
                  </Badge>
                  <NoticeDate>{notice.createdAt}</NoticeDate>
                </NoticeInfo>
              </NoticeRow>
            ))}
            <Divider />
          </>
        )}

        {/* 일반 공지 */}
        {paged.length === 0 ? (
          <EmptyState
            icon="📋"
            title="공지사항이 없습니다"
            description={
              keyword
                ? `"${keyword}"에 대한 검색 결과가 없습니다.`
                : '등록된 공지사항이 없습니다.'
            }
          />
        ) : (
          paged.map((notice) => (
            <NoticeRow
              key={notice.id}
              onClick={() => navigate(`/user/notice/${notice.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && navigate(`/user/notice/${notice.id}`)
              }
              aria-label={notice.title}
            >
              <NoticeMeta>
                <NoticeNum>{notice.id}</NoticeNum>
                {notice.isNew && <NewBadge>NEW</NewBadge>}
              </NoticeMeta>
              <NoticeTitle>{notice.title}</NoticeTitle>
              <NoticeInfo>
                <Badge size="sm" variant="muted">
                  {notice.category}
                </Badge>
                <NoticeDate>{notice.createdAt}</NoticeDate>
                <ViewCount>조회 {notice.views}</ViewCount>
              </NoticeInfo>
            </NoticeRow>
          ))
        )}
      </NoticeCard>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={(p) => {
          setPage(p);
          window.scrollTo(0, 0);
        }}
      />
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
  margin-bottom: var(--space-5);
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

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  flex-wrap: wrap;
`;

const CategoryBtnGroup = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const CategoryBtn = styled.button`
  padding: 6px 16px;
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
  gap: 6px;
`;

const SearchInput = styled.input`
  height: 36px;
  padding: 0 12px;
  font-size: 0.85rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--gray-800);
  min-width: 180px;
  font-family: inherit;
  outline: none;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
  }
  &::placeholder {
    color: var(--gray-400);
  }

  @media (max-width: 500px) {
    min-width: 130px;
  }
`;

const SearchBtn = styled.button`
  height: 36px;
  padding: 0 16px;
  font-size: 0.82rem;
  font-weight: 500;
  background: var(--sage);
  color: var(--white);
  border-radius: var(--radius-md);
  transition: filter 160ms ease;
  cursor: pointer;

  &:hover {
    filter: brightness(0.92);
  }
`;

const NoticeCard = styled(Card)`
  overflow: hidden;
  margin-bottom: var(--space-2);
`;

const NoticeRow = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto;
  align-items: center;
  gap: var(--space-4);
  padding: 16px 20px;
  cursor: pointer;
  transition: background 140ms ease;
  background: ${(p) =>
    p.$pinned ? 'rgba(168, 184, 159, 0.06)' : 'transparent'};

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-100);
  }

  &:hover {
    background: ${(p) =>
      p.$pinned ? 'rgba(168, 184, 159, 0.12)' : 'var(--gray-50, #fafaf9)'};
  }

  &:focus-visible {
    outline: 2px solid var(--sage);
    outline-offset: -2px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

const NoticeMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NoticeNum = styled.span`
  font-size: 0.82rem;
  color: var(--gray-400);
  font-weight: 500;
`;

const PinnedBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sage);
  white-space: nowrap;
`;

const NewBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--white);
  background: var(--sage);
  padding: 1px 6px;
  border-radius: var(--radius-full);
`;

const NoticeTitle = styled.span`
  font-size: 0.92rem;
  font-weight: ${(p) => (p.$pinned ? '600' : '500')};
  color: var(--gray-800);
  line-height: 1.4;

  /* 한 줄 말줄임 */
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const NoticeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;

  @media (max-width: 600px) {
    justify-content: flex-start;
  }
`;

const NoticeDate = styled.span`
  font-size: 0.78rem;
  color: var(--gray-400);
  white-space: nowrap;
`;

const ViewCount = styled.span`
  font-size: 0.75rem;
  color: var(--gray-300);
  white-space: nowrap;
`;

const Divider = styled.div`
  height: 1px;
  background: var(--gray-200);
  margin: 0;
`;
