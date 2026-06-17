import { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import {
  Badge,
  EmptyState,
  Card,
  Pagination,
  Button,
} from '../../pay_shared/components';
import PageLayout from '../../../app/layouts/page/PageLayout';
import api from '../../../app/api/axiosApi';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CATEGORY_OPTIONS = [
  { label: '전체', value: '' },
  { label: '예약', value: 'RESERVATION' },
  { label: '결제', value: 'PAYMENT' },
  { label: '취소', value: 'CANCEL' },
  { label: '환불', value: 'REFUND' },
  { label: '계정', value: 'ACCOUNT' },
  { label: '서비스 이용', value: 'SERVICE' },
  { label: '기타', value: 'OTHER' },
];

const CATEGORY_LABEL = {
  RESERVATION: '예약',
  PAYMENT: '결제',
  CANCEL: '취소',
  REFUND: '환불',
  ACCOUNT: '계정',
  SERVICE: '서비스 이용',
  OTHER: '기타',
};

export default function FaqListPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [inputKeyword, setInputKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [faqs, setFaqs] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [openIds, setOpenIds] = useState(new Set());

  const fetchFaqs = useCallback(async () => {
    const { data } = await api.get('/faq', {
      params: {
        page: page - 1,
        size: 10,
        category: category || undefined,
        keyword: keyword || undefined,
      },
    });
    setFaqs(data.content);
    setTotalPages(data.totalPages);
    setTotalElements(data.totalElements);
  }, [page, category, keyword]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleToggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearch = () => {
    setKeyword(inputKeyword);
    setPage(1);
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setPage(1);
    setOpenIds(new Set());
  };

  return (
    <PageLayout
      title="자주 묻는 질문"
      description="궁금한 점을 빠르게 해결해 드립니다."
      maxWidth={900}
    >
      {/* 검색 바 */}
      <SearchBar>
        <SearchInput
          placeholder="궁금한 내용을 검색해 보세요"
          value={inputKeyword}
          onChange={(e) => setInputKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          aria-label="FAQ 검색"
        />
        <SearchBtn type="button" onClick={handleSearch}>
          검색
        </SearchBtn>
      </SearchBar>

      {/* 카테고리 필터 */}
      <CategoryRow>
        {CATEGORY_OPTIONS.map((c) => (
          <CategoryBtn
            key={c.value}
            $active={category === c.value}
            onClick={() => handleCategoryChange(c.value)}
            type="button"
          >
            {c.label}
          </CategoryBtn>
        ))}
      </CategoryRow>

      {/* 결과 수 */}
      <ResultCount>
        {keyword && <KeywordTag>"{keyword}" 검색 결과</KeywordTag>}
        <span>총 {totalElements}개</span>
      </ResultCount>

      {/* 아코디언 목록 */}
      {faqs.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="검색 결과가 없습니다"
          description={
            keyword
              ? `"${keyword}"에 해당하는 FAQ를 찾지 못했습니다.`
              : '등록된 FAQ가 없습니다.'
          }
        />
      ) : (
        <AccordionList>
          {faqs.map((faq) => {
            const isOpen = openIds.has(faq.id);
            return (
              <AccordionItem key={faq.id} $open={isOpen}>
                <AccordionHeader
                  onClick={() => handleToggle(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                >
                  <QuestionRow>
                    <QMark aria-hidden="true">Q</QMark>
                    <QuestionText>{faq.title}</QuestionText>
                  </QuestionRow>
                  <RightArea>
                    <Badge size="sm" variant="muted">
                      {CATEGORY_LABEL[faq.category] ?? faq.category}
                    </Badge>
                    <ChevronIcon $open={isOpen} aria-hidden="true">
                      ›
                    </ChevronIcon>
                  </RightArea>
                </AccordionHeader>

                <AccordionBody
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                  $open={isOpen}
                >
                  <AnswerInner>
                    <AMark aria-hidden="true">A</AMark>
                    <AnswerText>{faq.content}</AnswerText>
                  </AnswerInner>
                </AccordionBody>
              </AccordionItem>
            );
          })}
        </AccordionList>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={(p) => {
          setPage(p);
          setOpenIds(new Set());
          window.scrollTo(0, 0);
        }}
      />

      {/* 문의 유도 배너 */}
      <ContactBanner>
        <BannerText>
          <BannerTitle>원하는 답변을 찾지 못하셨나요?</BannerTitle>
          <BannerDesc>1:1 문의를 통해 직접 문의해 주세요.</BannerDesc>
        </BannerText>
        <Button
          onClick={() => {
            const path =
              user?.role === 'U' ? '/user/inquiry/form' : '/host/inquiry/form';
            navigate(path);
          }}
        >
          + 문의하기
        </Button>
        {/* <ContactLink href="/user/inquiry/form">문의하기 →</ContactLink> */}
      </ContactBanner>
    </PageLayout>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────

const SearchBar = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: var(--space-4);
`;

const SearchInput = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 16px;
  font-size: 0.9rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--gray-800);
  font-family: inherit;
  outline: none;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
  }
  &::placeholder {
    color: var(--gray-400);
  }
`;

const SearchBtn = styled.button`
  height: 44px;
  padding: 0 20px;
  font-size: 0.88rem;
  font-weight: 500;
  background: var(--sage);
  color: var(--white);
  border-radius: var(--radius-md);
  transition: filter 160ms ease;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    filter: brightness(0.92);
  }
`;

const CategoryRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: var(--space-4);
`;

const CategoryBtn = styled.button`
  padding: 6px 18px;
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

const ResultCount = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  font-size: 0.82rem;
  color: var(--gray-400);
`;

const KeywordTag = styled.span`
  padding: 2px 10px;
  background: rgba(168, 184, 159, 0.15);
  color: var(--sage);
  border-radius: var(--radius-full);
  font-weight: 500;
  font-size: 0.78rem;
`;

const AccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: var(--space-4);
`;

const AccordionItem = styled.div`
  border: 1px solid ${(p) => (p.$open ? 'var(--sage)' : 'var(--gray-200)')};
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--white);
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease;

  ${(p) =>
    p.$open &&
    css`
      box-shadow: 0 4px 16px rgba(168, 184, 159, 0.15);
    `}
`;

const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 18px 20px;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  background: transparent;
  transition: background 140ms ease;

  &:hover {
    background: var(--gray-50, #fafaf9);
  }
  &:focus-visible {
    outline: 2px solid var(--sage);
    outline-offset: -2px;
  }
`;

const QuestionRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const QMark = styled.span`
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--sage);
  color: var(--white);
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
`;

const QuestionText = styled.span`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  line-height: 1.5;
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
`;

const ChevronIcon = styled.span`
  font-size: 1.3rem;
  color: var(--gray-400);
  display: inline-block;
  transform: ${(p) => (p.$open ? 'rotate(270deg)' : 'rotate(90deg)')};
  transition: transform 220ms ease;
  line-height: 1;
`;

const AccordionBody = styled.div`
  max-height: ${(p) => (p.$open ? '600px' : '0')};
  overflow: hidden;
  transition: max-height 280ms ease;
`;

const AnswerInner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--gray-100);
  background: var(--cream, #f4efe6);
`;

const AMark = styled.span`
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(168, 184, 159, 0.25);
  color: var(--sage);
  font-size: 0.8rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
`;

const AnswerText = styled.pre`
  font-family: inherit;
  font-size: 0.88rem;
  color: var(--gray-700);
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-word;
  flex: 1;
`;

const ContactBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 20px 24px;
  background: var(--cream, #f4efe6);
  border: 1px solid rgba(168, 184, 159, 0.3);
  border-radius: var(--radius-lg);
  margin-top: var(--space-4);

  @media (max-width: 500px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BannerText = styled.div``;

const BannerTitle = styled.p`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 2px;
`;

const BannerDesc = styled.p`
  font-size: 0.82rem;
  color: var(--gray-500);
`;

const ContactLink = styled.a`
  padding: 8px 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background: var(--sage);
  color: var(--white);
  border-radius: var(--radius-md);
  white-space: nowrap;
  text-decoration: none;
  transition: filter 160ms ease;

  &:hover {
    filter: brightness(0.92);
  }
`;
