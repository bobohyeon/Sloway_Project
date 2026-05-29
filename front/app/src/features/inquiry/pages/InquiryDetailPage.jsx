import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, Button, Modal, Card } from '../../pay_shared/components';

// ─── Mock 데이터 (백엔드 연동 시 GET /api/inquiries/:id 로 대체) ─────────────
// 관리자: GET /api/admin/inquiries/:id
// 유저:   GET /api/inquiries/:id (본인 것만 조회 가능, 서버에서 userId 검증)
const MOCK_INQUIRY = {
  id: 1,
  title: '예약 취소 후 환불이 아직 안 됐어요',
  category: '취소·환불',
  status: 'answered', // pending | processing | answered
  content:
    '3일 전에 예약 취소를 했는데 아직 환불이 처리되지 않았습니다.\n결제한 카드로 환불이 언제 되는지 확인 부탁드립니다.\n\n주문번호: ORDER-2026-00123',
  createdAt: '2026.05.01',
  updatedAt: '2026.05.01',
  answer: {
    content:
      '안녕하세요, Sloway 고객센터입니다.\n\n확인 결과 해당 환불은 2026년 5월 2일에 처리 완료되었습니다.\n카드사에 따라 최대 3~5 영업일이 소요될 수 있으며,\n현재는 카드사 측 처리 대기 중인 상태입니다.\n\n추가 문의사항이 있으시면 언제든지 연락해 주세요.\n감사합니다.',
    answeredAt: '2026.05.02',
    adminName: '고객센터',
  },
};

const STATUS_MAP = {
  answered: { label: '답변 완료', variant: 'success' },
  pending: { label: '답변 대기', variant: 'muted' },
  processing: { label: '처리 중', variant: 'warning' },
};

// ─── Props ────────────────────────────────────────────────────────────────────
export default function InquiryDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 백엔드 연동 시 useQuery로 대체
  const inquiry = MOCK_INQUIRY;

  // ─── 유저 삭제 모달 ──────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = async () => {
    // 백엔드 연동 시: DELETE /api/inquiries/:id
    // 실무: 답변 완료 상태면 삭제 불가 처리 권장
    navigate('/user/inquiry');
  };

  const canEdit = inquiry.status === 'pending';
  const canDelete = inquiry.status === 'pending';

  return (
    <Wrap>
      {/* 브레드크럼 */}
      <Breadcrumb>
        <BreadcrumbBtn onClick={() => navigate('/user/inquiry')}>
          내 문의사항
        </BreadcrumbBtn>
        <BreadcrumbSep>›</BreadcrumbSep>
        <BreadcrumbCurrent>상세보기</BreadcrumbCurrent>
      </Breadcrumb>

      {/* 문의 내용 카드 */}
      <DetailCard padded elevated>
        <TitleArea>
          <BadgeRow>
            <Badge size="sm" variant="muted">
              {inquiry.category}
            </Badge>
            <Badge size="sm" variant={STATUS_MAP[inquiry.status].variant}>
              {STATUS_MAP[inquiry.status].label}
            </Badge>
          </BadgeRow>
          <InquiryTitle>{inquiry.title}</InquiryTitle>
          <MetaRow>
            <MetaItem>등록일 {inquiry.createdAt}</MetaItem>
            {inquiry.updatedAt !== inquiry.createdAt && (
              <MetaItem>수정일 {inquiry.updatedAt}</MetaItem>
            )}
          </MetaRow>
        </TitleArea>

        {/* 문의 본문 */}
        <ContentSection>
          <SectionLabel>문의 내용</SectionLabel>
          <ContentText>{inquiry.content}</ContentText>
        </ContentSection>

        {/* 유저: 수정/삭제 버튼 */}
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
          {!canEdit && !canDelete && (
            <StatusNote>
              {inquiry.status === 'processing'
                ? '처리 중인 문의는 수정/삭제할 수 없습니다.'
                : '답변이 완료된 문의는 수정/삭제할 수 없습니다.'}
            </StatusNote>
          )}
        </UserActionRow>
      </DetailCard>

      {inquiry.answer ? (
        /* 유저: 답변 읽기 전용 */
        <AnswerCard padded>
          <AnswerHeader>
            <AnswerLabel>답변</AnswerLabel>
            <AnswerMeta>
              <span>{inquiry.answer.adminName}</span>
              <span>·</span>
              <span>{inquiry.answer.answeredAt}</span>
            </AnswerMeta>
          </AnswerHeader>
          <AnswerText>{inquiry.answer.content}</AnswerText>
        </AnswerCard>
      ) : (
        /* 유저: 아직 답변 없음 */
        <PendingCard padded>
          <PendingIcon aria-hidden="true">⏳</PendingIcon>
          <PendingText>
            문의를 확인 중입니다. 운영 시간 내 순차적으로 답변 드리겠습니다.
          </PendingText>
        </PendingCard>
      )}

      {/* 하단 버튼 */}
      <BackBtn>
        <Button variant="secondary" onClick={() => navigate('/user/inquiry')}>
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

/* ─── 유저 답변 읽기 카드 ────────────────────────────────────────────────── */
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

/* ─── 답변 대기 카드 ─────────────────────────────────────────────────────── */
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
