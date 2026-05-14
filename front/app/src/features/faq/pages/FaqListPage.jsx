import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Badge, EmptyState, Card } from '../../pay_shared/components';
import PageLayout from '../../../app/layouts/page/PageLayout';

// ─── Mock 데이터 (백엔드 연동 시 GET /api/faqs?category= 로 대체) ────────────
const MOCK_FAQS = [
  {
    id: 1,
    category: '예약·결제',
    question: '예약 취소는 어떻게 하나요?',
    answer:
      "예약 취소는 마이페이지 > 예약 목록에서 해당 예약을 선택한 후 '취소 신청' 버튼을 클릭하시면 됩니다.\n\n취소 수수료는 예약일 기준으로 다음과 같이 적용됩니다.\n• 이용일 7일 전: 100% 환불\n• 이용일 3~6일 전: 50% 환불\n• 이용일 2일 이내: 환불 불가",
  },
  {
    id: 2,
    category: '예약·결제',
    question: '결제 수단은 무엇이 있나요?',
    answer:
      '신용카드, 체크카드, 카카오페이, 네이버페이, 토스페이를 지원합니다.\n간편결제 수단은 마이페이지 > 결제 수단에서 미리 등록해두실 수 있습니다.',
  },
  {
    id: 3,
    category: '취소·환불',
    question: '환불은 얼마나 걸리나요?',
    answer:
      '환불은 취소 승인 후 영업일 기준 3~5일 이내 처리됩니다.\n카드사에 따라 최대 7영업일이 소요될 수 있습니다.\n\n환불 진행 상황은 마이페이지 > 취소·환불 내역에서 확인하실 수 있습니다.',
  },
  {
    id: 4,
    category: '취소·환불',
    question: '환불 수수료가 있나요?',
    answer:
      '이용일 기준 7일 이전 취소는 수수료 없이 전액 환불됩니다.\n이용일이 임박할수록 수수료가 발생하며, 자세한 사항은 각 공간의 취소 정책을 확인해 주세요.',
  },
  {
    id: 5,
    category: '계정',
    question: '비밀번호를 잊어버렸어요.',
    answer:
      "로그인 화면에서 '비밀번호 찾기'를 클릭하시면 가입 시 등록한 이메일로 재설정 링크를 보내드립니다.\n이메일을 받지 못하셨다면 스팸 메일함을 확인하거나 고객센터로 문의해 주세요.",
  },
  {
    id: 6,
    category: '계정',
    question: '회원 탈퇴는 어떻게 하나요?',
    answer:
      '마이페이지 > 설정 > 회원 탈퇴에서 신청하실 수 있습니다.\n진행 중인 예약이 있거나 정산 미완료 건이 있을 경우 탈퇴가 제한될 수 있습니다.',
  },
  {
    id: 7,
    category: '서비스 이용',
    question: '1:1 채팅은 어떻게 사용하나요?',
    answer:
      '공간 예약 후 마이페이지 > 1:1 채팅에서 호스트와 직접 소통하실 수 있습니다.\n채팅은 예약 확정 후 이용 완료 시까지 이용 가능합니다.',
  },
  {
    id: 8,
    category: '서비스 이용',
    question: '쿠폰은 어떻게 사용하나요?',
    answer:
      "결제 화면에서 '쿠폰 적용' 버튼을 누르면 보유한 쿠폰 목록이 나타납니다.\n쿠폰마다 최소 결제 금액 및 사용 가능 공간이 다를 수 있으니 유의해 주세요.",
  },
  {
    id: 9,
    category: '기타',
    question: '문의는 어디서 할 수 있나요?',
    answer:
      '마이페이지 > 내 문의에서 1:1 문의를 남기실 수 있습니다.\n운영 시간(평일 09:00 ~ 18:00) 내 순차적으로 답변 드리겠습니다.',
  },
];

const CATEGORY_OPTIONS = [
  '전체',
  '예약·결제',
  '취소·환불',
  '계정',
  '서비스 이용',
  '기타',
];

export default function FaqListPage() {
  const [category, setCategory] = useState('전체');
  const [inputKeyword, setInputKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  // 열린 아코디언 ID 세트 — 다중 열기 허용
  // 단일 열기 원하면 Set 대신 단일 id 상태로 변경
  const [openIds, setOpenIds] = useState(new Set());

  const filtered = MOCK_FAQS.filter((f) => {
    const matchCat = category === '전체' || f.category === category;
    const matchKw = f.question.includes(keyword) || f.answer.includes(keyword);
    return matchCat && matchKw;
  });

  const handleToggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearch = () => {
    setKeyword(inputKeyword);
    // 검색 시 전체 펼치기 — UX 판단에 따라 제거 가능
    setOpenIds(new Set(MOCK_FAQS.map((f) => f.id)));
  };

  return (
    <PageLayout
      title="자주 묻는 질문"
      description="궁금한 점을 빠르게 해결해 드립니다."
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
            key={c}
            $active={category === c}
            onClick={() => setCategory(c)}
            type="button"
          >
            {c}
          </CategoryBtn>
        ))}
      </CategoryRow>

      {/* 결과 수 */}
      <ResultCount>
        {keyword && <KeywordTag>"{keyword}" 검색 결과</KeywordTag>}
        <span>총 {filtered.length}개</span>
      </ResultCount>

      {/* 아코디언 목록 */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="검색 결과가 없습니다"
          description={`"${keyword}"에 해당하는 FAQ를 찾지 못했습니다.`}
        />
      ) : (
        <AccordionList>
          {filtered.map((faq) => {
            const isOpen = openIds.has(faq.id);
            return (
              <AccordionItem key={faq.id} $open={isOpen}>
                {/* 질문 헤더 — button으로 접근성 확보 */}
                <AccordionHeader
                  onClick={() => handleToggle(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  id={`faq-question-${faq.id}`}
                >
                  <QuestionRow>
                    <QMark aria-hidden="true">Q</QMark>
                    <QuestionText>{faq.question}</QuestionText>
                  </QuestionRow>
                  <RightArea>
                    <Badge size="sm" variant="muted">
                      {faq.category}
                    </Badge>
                    <ChevronIcon $open={isOpen} aria-hidden="true">
                      ›
                    </ChevronIcon>
                  </RightArea>
                </AccordionHeader>

                {/* 답변 본문 — height 애니메이션 */}
                <AccordionBody
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  aria-labelledby={`faq-question-${faq.id}`}
                  $open={isOpen}
                >
                  <AnswerInner>
                    <AMark aria-hidden="true">A</AMark>
                    <AnswerText>{faq.answer}</AnswerText>
                  </AnswerInner>
                </AccordionBody>
              </AccordionItem>
            );
          })}
        </AccordionList>
      )}

      {/* 문의 유도 배너 */}
      <ContactBanner>
        <BannerText>
          <BannerTitle>원하는 답변을 찾지 못하셨나요?</BannerTitle>
          <BannerDesc>1:1 문의를 통해 직접 문의해 주세요.</BannerDesc>
        </BannerText>
        <ContactLink href="/inquiries/new">문의하기 →</ContactLink>
      </ContactBanner>
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
  margin-bottom: var(--space-6);
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
  /* Q→A 전환 시 90도 회전 */
  transform: ${(p) => (p.$open ? 'rotate(270deg)' : 'rotate(90deg)')};
  transition: transform 220ms ease;
  line-height: 1;
`;

/* 
  아코디언 애니메이션:
  max-height 트릭 — 정확한 높이를 모를 때 큰 값(예: 600px)으로 트랜지션
  실제 높이가 필요하다면 ResizeObserver + ref로 정확한 height 계산 권장
*/
const AccordionBody = styled.div`
  max-height: ${(p) => (p.$open ? '600px' : '0')};
  overflow: hidden;
  transition: max-height 280ms ease;
`;

const AnswerInner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 0 20px 20px;
  border-top: 1px solid var(--gray-100);
  padding-top: 16px;
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
