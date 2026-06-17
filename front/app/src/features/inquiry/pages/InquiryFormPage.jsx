import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Card } from '../../pay_shared/components';
import PageLayout from '../../../app/layouts/page/PageLayout';
import api from '../../../app/api/axiosApi';
import { useAuth } from '../../auth/hooks/useAuth';

const CATEGORY_OPTIONS = [
  { label: '예약', value: 'RESERVATION' },
  { label: '결제', value: 'PAYMENT' },
  { label: '공간', value: 'PLACE' },
  { label: '기타', value: 'OTHER' },
];

const EMPTY_FORM = { title: '', category: 'RESERVATION', content: '' };

export default function InquiryFormPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const pageTitle = isEdit ? '문의사항 수정' : '1:1 문의하기';

  const [form, setForm] = useState(EMPTY_FORM);
  const [isEditable, setIsEditable] = useState(!isEdit);
  const [errors, setErrors] = useState({});
  const [cancelModal, setCancelModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, role } = useAuth();

  useEffect(() => {
    if (!isEdit || !id) return;
    const fetch = async () => {
      try {
        const { data } = await api.get(`/inquiry/my/${id}`);
        if (data.status !== 'PENDING') {
          setIsEditable(false);
          return;
        }
        setForm({
          title: data.title,
          category: data.category,
          content: data.content,
        });
        setIsEditable(true);
      } catch {
        navigate('/inquiry', { replace: true });
      }
    };
    fetch();
  }, [isEdit, id]);

  const handleChange = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    },
    [errors]
  );

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = '제목을 입력해 주세요.';
    if (form.title.trim().length > 100)
      errs.title = '제목은 100자 이내로 입력해 주세요.';
    if (!form.content.trim()) errs.content = '문의 내용을 입력해 주세요.';
    if (form.content.trim().length < 10)
      errs.content = '문의 내용을 10자 이상 입력해 주세요.';
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        content: form.content,
      };
      if (isEdit) {
        await api.put(`/inquiry/${id}`, payload);
      } else {
        await api.post('/inquiry', payload);
      }
      navigate('/user/inquiry');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && !isEditable) {
    return (
      <PageLayout title="문의사항 수정" maxWidth={900}>
        <BlockedCard padded elevated>
          <BlockedIcon aria-hidden="true">🔒</BlockedIcon>
          <BlockedTitle>수정할 수 없는 문의입니다</BlockedTitle>
          <BlockedDesc>
            이미 처리 중이거나 답변이 완료된 문의는 수정할 수 없습니다.
            <br />
            추가 문의사항이 있으시면 새 문의를 등록해 주세요.
          </BlockedDesc>
          <Button variant="secondary" onClick={() => navigate('/user/inquiry')}>
            목록으로
          </Button>
        </BlockedCard>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={pageTitle}
      description={
        isEdit
          ? '문의 내용을 수정합니다. 답변 대기 중일 때만 수정 가능합니다.'
          : '궁금하신 점을 남겨주시면 빠르게 답변 드리겠습니다.'
      }
      maxWidth={900}
    >
      {!isEdit && (
        <NoticeBanner>
          <span>⏱</span>
          <span>
            운영 시간(평일 09:00~18:00) 내 순차적으로 답변 드립니다. 긴급 문의는
            1:1 채팅을 이용해 주세요.
          </span>
        </NoticeBanner>
      )}

      <FormCard padded elevated>
        {/* 카테고리 */}
        <Field>
          <Label required>문의 유형</Label>
          <CategoryBtnGroup>
            {CATEGORY_OPTIONS.map((c) => (
              <CategoryBtn
                key={c.value}
                $active={form.category === c.value}
                onClick={() => handleChange('category', c.value)}
                type="button"
              >
                {c.label}
              </CategoryBtn>
            ))}
          </CategoryBtnGroup>
        </Field>

        {/* 제목 */}
        <Field>
          <Label required>제목</Label>
          <Input
            placeholder="문의 제목을 입력하세요 (최대 100자)"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            maxLength={100}
            $error={!!errors.title}
            aria-required="true"
          />
          <FieldBottom>
            {errors.title ? (
              <ErrorMsg>{errors.title}</ErrorMsg>
            ) : (
              <CharCount $warn={form.title.length > 90}>
                {form.title.length}/100
              </CharCount>
            )}
          </FieldBottom>
        </Field>

        {/* 내용 */}
        <Field>
          <Label required>문의 내용</Label>
          <Textarea
            placeholder={`문의 내용을 자세히 입력해 주세요.\n\n예약번호, 결제 정보 등 관련 정보를 함께 남겨주시면 더 빠르게 처리해 드릴 수 있습니다.`}
            value={form.content}
            onChange={(e) => handleChange('content', e.target.value)}
            rows={10}
            $error={!!errors.content}
            aria-required="true"
          />
          <FieldBottom>
            {errors.content ? (
              <ErrorMsg>{errors.content}</ErrorMsg>
            ) : (
              <CharCount>{form.content.length}자</CharCount>
            )}
          </FieldBottom>
        </Field>

        {/* 버튼 */}
        <ButtonGroup>
          <Button variant="secondary" onClick={() => setCancelModal(true)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? '제출 중...' : isEdit ? '수정 완료' : '문의 등록'}
          </Button>
        </ButtonGroup>
      </FormCard>

      {/* 취소 확인 모달 */}
      <Modal
        open={cancelModal}
        onClose={() => setCancelModal(false)}
        title="작성 취소"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelModal(false)}>
              계속 작성
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                const path =
                  user?.role === 'U' ? '/user/inquiry' : '/host/inquiry';
                navigate(path);
              }}
            >
              나가기
            </Button>
          </>
        }
      >
        <ModalText>
          작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?
        </ModalText>
      </Modal>
    </PageLayout>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────

const NoticeBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(168, 184, 159, 0.1);
  border: 1px solid rgba(168, 184, 159, 0.3);
  border-radius: var(--radius-md);
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: var(--space-4);
`;

const FormCard = styled(Card)``;

const Field = styled.div`
  margin-bottom: var(--space-5);

  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--gray-600);
  margin-bottom: 8px;

  ${(p) =>
    p.required &&
    `&::after {
      content: '*';
      color: #b85a4e;
      font-size: 0.75rem;
    }`}
`;

const CategoryBtnGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CategoryBtn = styled.button`
  padding: 7px 18px;
  font-size: 0.85rem;
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

const baseInputStyle = `
  width: 100%;
  padding: 10px 12px;
  font-size: 0.88rem;
  font-family: inherit;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--gray-800);
  outline: none;
  transition: border-color 160ms ease;
  box-sizing: border-box;

  &::placeholder { color: var(--gray-300); }
  &:focus { border-color: var(--sage); }
`;

const Input = styled.input`
  ${baseInputStyle}
  height: 42px;
  border-color: ${(p) => (p.$error ? '#b85a4e' : 'var(--gray-200)')};
`;

const Textarea = styled.textarea`
  ${baseInputStyle}
  resize: vertical;
  line-height: 1.7;
  min-height: 220px;
  border-color: ${(p) => (p.$error ? '#b85a4e' : 'var(--gray-200)')};
`;

const FieldBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
`;

const ErrorMsg = styled.span`
  display: block;
  font-size: 0.78rem;
  color: #b85a4e;
  margin-top: 4px;
`;

const CharCount = styled.span`
  font-size: 0.75rem;
  color: ${(p) => (p.$warn ? '#b8730f' : 'var(--gray-400)')};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding-top: var(--space-4);
  border-top: 1px solid var(--gray-100);
  margin-top: var(--space-4);
`;

const BlockedCard = styled(Card)`
  text-align: center;
  padding: var(--space-12) var(--space-6);
`;

const BlockedIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: var(--space-3);
  opacity: 0.6;
`;

const BlockedTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
`;

const BlockedDesc = styled.p`
  font-size: 0.88rem;
  color: var(--gray-500);
  line-height: 1.7;
  margin-bottom: var(--space-5);
`;

const ModalText = styled.p`
  font-size: 0.92rem;
  color: var(--gray-700);
  line-height: 1.6;
`;
