import { useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Badge, Button, Card } from '../../../pay_shared/components';

// ─── Mock 데이터 (백엔드 연동 시 GET /api/notices/:id 로 대체) ───────────────
const MOCK_NOTICE = {
  id: 1,
  title: '[중요] 서비스 이용약관 변경 안내',
  category: '서비스',
  isPinned: true,
  isImportant: true,
  views: 312,
  createdAt: '2026.05.01',
  updatedAt: '2026.05.03',
  content: `안녕하세요, Sloway 팀입니다.

서비스 이용약관이 2026년 6월 1일부로 변경될 예정입니다. 주요 변경 사항을 안내드립니다.

■ 주요 변경 사항

1. 개인정보 처리 방침 개정
- 수집하는 개인정보 항목 변경
- 개인정보 보유 및 이용기간 명확화
- 제3자 제공 항목 업데이트

2. 서비스 이용 규칙 변경
- 불법 이용 행위 제재 기준 강화
- 계정 정지 및 탈퇴 처리 절차 명확화

3. 환불 정책 개정
- 환불 가능 기간 및 조건 업데이트
- 부분 환불 기준 신설

■ 시행일

2026년 6월 1일 (월)

변경되는 약관에 동의하지 않으시는 경우, 시행일 이전에 서비스 탈퇴를 요청하실 수 있습니다.
시행일 이후 서비스를 계속 이용하시는 경우 변경된 약관에 동의한 것으로 간주됩니다.

궁금하신 점은 고객센터 또는 1:1 문의를 통해 문의해 주세요.

감사합니다.`,
};

// 이전/다음 공지 (백엔드 연동 시 API 응답에 prev/next 포함 권장)
const MOCK_PREV = { id: 2, title: '공지사항 제목입니다 2번' };
const MOCK_NEXT = { id: 0, title: null }; // 다음 없음

export default function NoticeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const backPath = location.state?.from ?? '/admin/notice';

  // 백엔드 연동 시 useQuery(`/api/notices/${id}`)
  const notice = MOCK_NOTICE;

  return (
    <PageLayout maxWidth={800}>
      {/* 브레드크럼 */}
      <Breadcrumb>
        <BreadcrumbBtn onClick={() => navigate('/notices')}>
          공지사항
        </BreadcrumbBtn>
        <BreadcrumbSep>›</BreadcrumbSep>
        <BreadcrumbCurrent>상세보기</BreadcrumbCurrent>
      </Breadcrumb>

      <DetailCard padded elevated>
        {/* 제목 영역 */}
        <TitleArea>
          <BadgeRow>
            {notice.isPinned && (
              <Badge size="sm" variant="sage">
                📌 고정
              </Badge>
            )}
            {notice.isImportant && (
              <Badge size="sm" variant="warning">
                중요
              </Badge>
            )}
            <Badge size="sm" variant="muted">
              {notice.category}
            </Badge>
          </BadgeRow>
          <NoticeTitle>{notice.title}</NoticeTitle>
          <MetaRow>
            <MetaItem>등록일 {notice.createdAt}</MetaItem>
            {notice.updatedAt !== notice.createdAt && (
              <MetaItem>수정일 {notice.updatedAt}</MetaItem>
            )}
            <MetaItem>조회 {notice.views}</MetaItem>
          </MetaRow>
        </TitleArea>

        {/* 본문 */}
        <ContentArea>
          {/* 
            실무: API에서 HTML 문자열로 내려올 경우
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notice.content) }} />
            형태로 렌더링 (반드시 DOMPurify sanitize 적용)
          */}
          <ContentText>{notice.content}</ContentText>
        </ContentArea>
      </DetailCard>

      {/* 이전/다음 */}
      <NavCard>
        <NavRow
          $clickable={!!MOCK_NEXT.title}
          onClick={() =>
            MOCK_NEXT.title && navigate(`/notices/${MOCK_NEXT.id}`)
          }
          aria-label={
            MOCK_NEXT.title ? `다음 글: ${MOCK_NEXT.title}` : '다음 글 없음'
          }
        >
          <NavLabel>다음글</NavLabel>
          <NavTitle $empty={!MOCK_NEXT.title}>
            {MOCK_NEXT.title ?? '다음 공지사항이 없습니다.'}
          </NavTitle>
        </NavRow>
        <NavDivider />
        <NavRow
          $clickable
          onClick={() => navigate(`/notices/${MOCK_PREV.id}`)}
          aria-label={`이전 글: ${MOCK_PREV.title}`}
        >
          <NavLabel>이전글</NavLabel>
          <NavTitle>{MOCK_PREV.title}</NavTitle>
        </NavRow>
      </NavCard>

      {/* 하단 버튼 */}
      <BackBtn>
        <Button variant="secondary" onClick={() => navigate(backPath)}>
          ← 목록으로
        </Button>
        {/* 수정/삭제는 admin에서 접근했을 때만 노출 */}
        {backPath.startsWith('/admin') && (
          <RightActions>
            <Button
              variant="ghost"
              onClick={() => navigate(`/admin/notice/form/${notice.id}`)}
            >
              수정
            </Button>
            <Button variant="danger" onClick={() => {}}>
              삭제
            </Button>
          </RightActions>
        )}
      </BackBtn>
    </PageLayout>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: var(--space-4);
  font-size: 0.82rem;
`;

const BreadcrumbBtn = styled.button`
  color: var(--gray-500);
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;

  &:hover {
    color: var(--sage);
    text-decoration: underline;
  }
`;

const BreadcrumbSep = styled.span`
  color: var(--gray-300);
`;

const BreadcrumbCurrent = styled.span`
  color: var(--gray-800);
  font-weight: 500;
`;

const DetailCard = styled(Card)`
  margin-bottom: var(--space-3);
`;

const TitleArea = styled.div`
  padding-bottom: var(--space-5);
  border-bottom: 1px solid var(--gray-100);
  margin-bottom: var(--space-5);
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
`;

const NoticeTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--gray-800);
  line-height: 1.45;
  letter-spacing: -0.02em;
  margin-bottom: var(--space-3);

  @media (max-width: 600px) {
    font-size: 1.1rem;
  }
`;

const MetaRow = styled.div`
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
`;

const MetaItem = styled.span`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const ContentArea = styled.div``;

const ContentText = styled.pre`
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.85;
  color: var(--gray-700);
  white-space: pre-wrap;
  word-break: break-word;
`;

const NavCard = styled(Card)`
  margin-bottom: var(--space-4);
  overflow: hidden;
`;

const NavRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  gap: var(--space-4);
  padding: 14px 20px;
  cursor: ${(p) => (p.$clickable ? 'pointer' : 'default')};
  transition: background 140ms ease;

  &:hover {
    background: ${(p) =>
      p.$clickable ? 'var(--gray-50, #fafaf9)' : 'transparent'};
  }
`;

const NavLabel = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-400);
  white-space: nowrap;
`;

const NavTitle = styled.span`
  font-size: 0.88rem;
  color: ${(p) => (p.$empty ? 'var(--gray-300)' : 'var(--gray-700)')};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  ${NavRow}:hover & {
    color: ${(p) => (p.$empty ? 'var(--gray-300)' : 'var(--sage)')};
  }
`;

const NavDivider = styled.div`
  height: 1px;
  background: var(--gray-100);
`;

const BackBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* ← 좌: 목록, 우: 수정/삭제 */
`;

const RightActions = styled.div`
  display: flex;
  gap: var(--space-2);
`;
