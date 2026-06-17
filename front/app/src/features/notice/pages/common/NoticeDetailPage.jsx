import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, Card } from '../../../pay_shared/components';
import api from '../../../../app/api/axiosApi';

const fmtDate = (iso) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

export default function NoticeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const backPath = location.state?.from ?? '/notice';

  const [notice, setNotice] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/notice/${id}`);
        setNotice(data);
      } catch {
        navigate('/notice', { replace: true });
      }
    };
    fetch();
  }, [id]);

  if (!notice) return null;

  const handleDelete = async () => {
    await api.delete(`/notice/${notice.id}`);
    navigate('/admin/notice');
  };

  return (
    <PageLayout maxWidth={900}>
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
          <NoticeTitle>{notice.title}</NoticeTitle>
          <MetaRow>
            <MetaItem>등록일 {fmtDate(notice.createdAt)}</MetaItem>
            {notice.updatedAt && notice.updatedAt !== notice.createdAt && (
              <MetaItem>수정일 {fmtDate(notice.updatedAt)}</MetaItem>
            )}
            <MetaItem>조회 {notice.viewCount}</MetaItem>
          </MetaRow>
        </TitleArea>

        {/* 본문 */}
        <ContentArea>
          <ContentText>{notice.content}</ContentText>
        </ContentArea>
      </DetailCard>

      {/* 하단 버튼 */}
      <BackBtn>
        <Button variant="secondary" onClick={() => navigate(backPath)}>
          ← 목록으로
        </Button>
        {backPath.startsWith('/admin') && (
          <RightActions>
            <Button
              variant="ghost"
              onClick={() => navigate(`/admin/notice/form/${notice.id}`)}
            >
              수정
            </Button>
            <Button variant="danger" onClick={handleDelete}>
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

const BackBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* ← 좌: 목록, 우: 수정/삭제 */
`;

const RightActions = styled.div`
  display: flex;
  gap: var(--space-2);
`;
