import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Modal, Card } from '../../pay_shared/components';
import PageLayout from '../../../app/layouts/page/PageLayout';
import api from '../../../app/api/axiosApi';

const CATEGORY_LABEL = {
  RESERVATION: '예약',
  PAYMENT: '결제',
  PLACE: '공간',
  OTHER: '기타',
};

const STATUS_CONFIG = {
  ANSWERED: { label: '답변 완료', variant: 'success' },
  PENDING:  { label: '답변 대기', variant: 'muted' },
};

const fmtDate = (iso) => (iso ? iso.slice(0, 10).replace(/-/g, '.') : '');

export default function InquiryDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isAdmin = location.pathname.startsWith('/admin');

  const [inquiry, setInquiry] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const endpoint = isAdmin ? `/inquiry/${id}` : `/inquiry/my/${id}`;
        const { data } = await api.get(endpoint);
        setInquiry(data);
      } catch {
        navigate(isAdmin ? '/admin/inquiry' : '/user/inquiry', { replace: true });
      }
    };
    fetch();
  }, [id, isAdmin]);

  if (!inquiry) return null;

  const canEdit = !isAdmin && inquiry.status === 'PENDING';
  const canDelete = !isAdmin && inquiry.status === 'PENDING';
  const st = STATUS_CONFIG[inquiry.status] ?? { label: inquiry.status, variant: 'muted' };

  const handleDelete = async () => {
    await api.delete(`/inquiry/${id}`);
    navigate('/user/inquiry');
  };

  return (
    <PageLayout maxWidth={800}>
      {/* 브레드크럼 */}
      <Breadcrumb>
        <BreadcrumbBtn onClick={() => navigate(isAdmin ? '/admin/inquiry' : '/user/inquiry')}>
          {isAdmin ? '문의사항 관리' : '내 문의사항'}
        </BreadcrumbBtn>
        <BreadcrumbSep>›</BreadcrumbSep>
        <BreadcrumbCurrent>상세보기</BreadcrumbCurrent>
      </Breadcrumb>

      {/* 문의 내용 카드 */}
      <DetailCard padded elevated>
        <TitleArea>
          <BadgeRow>
            <Badge size="sm" variant="muted">
              {CATEGORY_LABEL[inquiry.category] ?? inquiry.category}
            </Badge>
            <Badge size="sm" variant={st.variant}>
              {st.label}
            </Badge>
          </BadgeRow>
          <InquiryTitle>{inquiry.title}</InquiryTitle>
          <MetaRow>
            <MetaItem>등록일 {fmtDate(inquiry.createdAt)}</MetaItem>
            {inquiry.updatedAt && inquiry.updatedAt !== inquiry.createdAt && (
              <MetaItem>수정일 {fmtDate(inquiry.updatedAt)}</MetaItem>
            )}
          </MetaRow>
        </TitleArea>

        {/* 문의 본문 */}
        <ContentSection>
          <SectionLabel>문의 내용</SectionLabel>
          <ContentText>{inquiry.content}</ContentText>
        </ContentSection>

        {/* 수정/삭제 버튼 (사용자, PENDING 상태만) */}
        {(canEdit || canDelete || inquiry.status === 'ANSWERED') && (
          <UserActionRow>
            {canEdit && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => navigate(`/user/inquiry/form/${id}`)}
              >
                수정
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => setDeleteModal(true)}
              >
                삭제
              </Button>
            )}
            {inquiry.status === 'ANSWERED' && !isAdmin && (
              <StatusNote>답변이 완료된 문의는 수정/삭제할 수 없습니다.</StatusNote>
            )}
          </UserActionRow>
        )}
      </DetailCard>

      {/* 답변 영역 */}
      {inquiry.replyContent ? (
        <AnswerCard padded>
          <AnswerHeader>
            <AnswerLabel>답변</AnswerLabel>
            {inquiry.answeredAt && (
              <AnswerMeta>
                <span>{fmtDate(inquiry.answeredAt)}</span>
              </AnswerMeta>
            )}
          </AnswerHeader>
          <AnswerText>{inquiry.replyContent}</AnswerText>
        </AnswerCard>
      ) : (
        <PendingCard padded>
          <PendingIcon aria-hidden="true">⏳</PendingIcon>
          <PendingText>
            문의를 확인 중입니다. 운영 시간 내 순차적으로 답변 드리겠습니다.
          </PendingText>
        </PendingCard>
      )}

      {/* 하단 버튼 */}
      <BackBtn>
        <Button
          variant="secondary"
          onClick={() => navigate(isAdmin ? '/admin/inquiry' : '/user/inquiry')}
        >
          ← 목록으로
        </Button>
      </BackBtn>

      {/* 삭제 확인 모달 */}
      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="문의사항 삭제"
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
          이 문의사항을 삭제하시겠습니까?
          <br />
          삭제된 문의는 복구할 수 없습니다.
        </ModalText>
      </Modal>
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

const InquiryTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.25rem;
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

const ContentSection = styled.div`
  margin-bottom: var(--space-4);
`;

const SectionLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-3);
`;

const ContentText = styled.pre`
  font-family: inherit;
  font-size: 0.92rem;
  color: var(--gray-700);
  line-height: 1.85;
  white-space: pre-wrap;
  word-break: break-word;
`;

const UserActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--gray-100);
`;

const StatusNote = styled.span`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const AnswerCard = styled(Card)`
  margin-bottom: var(--space-3);
  background: var(--cream, #f4efe6);
  border-color: rgba(168, 184, 159, 0.35);
`;

const AnswerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
  gap: var(--space-2);
`;

const AnswerLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--sage);
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const AnswerMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--gray-500);
`;

const AnswerText = styled.pre`
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--gray-700);
  line-height: 1.85;
  white-space: pre-wrap;
  word-break: break-word;
`;

const PendingCard = styled(Card)`
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  background: var(--gray-50, #fafaf9);
`;

const PendingIcon = styled.span`
  font-size: 1.4rem;
  flex-shrink: 0;
`;

const PendingText = styled.p`
  font-size: 0.88rem;
  color: var(--gray-500);
  line-height: 1.6;
`;

const BackBtn = styled.div`
  display: flex;
  margin-top: var(--space-2);
`;

const ModalText = styled.p`
  font-size: 0.92rem;
  color: var(--gray-700);
  line-height: 1.6;
`;
