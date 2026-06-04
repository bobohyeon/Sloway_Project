import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Pagination,
  EmptyState,
  Card,
} from '../../../pay_shared/components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import api from '../../../../app/api/axiosApi';

const CATEGORY_OPTIONS = [
  { label: '전체', value: '' },
  { label: '서비스', value: 'SERVICE' },
  { label: '이벤트', value: 'EVENT' },
  { label: '점검', value: 'INSPECTION' },
  { label: '기타', value: 'OTHER' },
];

const SORT_MAP = {
  createdAt: 'createdAt,DESC',
  views: 'viewCount,DESC',
  title: 'title,ASC',
};

const fmtDate = (iso) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

export default function NoticeListPage() {
  const [sortKey, setSortKey] = useState('createdAt');
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get('/notice', {
        params: {
          page: page - 1,
          size: 10,
          sort: SORT_MAP[sortKey],
          category: category || undefined,
          keyword: keyword || undefined,
          status: 'ACTIVE',
        },
      });
      setNotices(data.content);
      setTotalPages(data.totalPages);
    };
    fetch();
  }, [page, sortKey, category, keyword]);

  const handleSearch = () => {
    setKeyword(inputKeyword);
    setPage(1);
  };

  return (
    <PageLayout
      title="공지사항"
      description="서비스 관련 중요한 소식을 전해드립니다."
    >
      {/* 검색/카테고리 */}
      <FilterRow>
        <CategoryBtnGroup>
          {CATEGORY_OPTIONS.map((c) => (
            <CategoryBtn
              key={c.value}
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
        <RightControls>
          <SortSelect
            value={sortKey}
            onChange={(e) => {
              setSortKey(e.target.value);
              setPage(1);
            }}
            aria-label="정렬 기준"
          >
            <option value="createdAt">최신순</option>
            <option value="views">조회수순</option>
            <option value="title">제목순</option>
          </SortSelect>
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
        </RightControls>
      </FilterRow>

      {/* 공지 목록 */}
      <NoticeCard elevated>
        {notices.length === 0 ? (
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
          notices.map((notice) => (
            <NoticeRow
              key={notice.id}
              onClick={() => navigate(`/notice/${notice.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && navigate(`/notice/${notice.id}`)
              }
              aria-label={notice.title}
            >
              <NoticeMeta>
                <NoticeNum>{notice.id}</NoticeNum>
              </NoticeMeta>
              <NoticeTitle>{notice.title}</NoticeTitle>
              <NoticeInfo>
                <Badge size="sm" variant="muted">
                  {CATEGORY_OPTIONS.find((c) => c.value === notice.category)
                    ?.label ?? notice.category}
                </Badge>
                <NoticeDate>{fmtDate(notice.createdAt)}</NoticeDate>
                <ViewCount>조회 {notice.viewCount}</ViewCount>
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
    </PageLayout>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────
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

  &:not(:last-child) {
    border-bottom: 1px solid var(--gray-100);
  }

  &:hover {
    background: var(--gray-50, #fafaf9);
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

const NoticeTitle = styled.span`
  font-size: 0.92rem;
  font-weight: 500;
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

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
`;

const SortSelect = styled.select`
  height: 36px;
  padding: 0 28px 0 10px;
  font-size: 0.82rem;
  font-family: inherit;
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23999'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  transition: border-color 160ms;

  &:focus {
    border-color: var(--sage);
  }
`;
