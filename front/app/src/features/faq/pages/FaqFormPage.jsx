import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../../app/layouts/page/PageLayout';
import { Button, Modal, Card } from '../../pay_shared/components';
import api from '../../../app/api/axiosApi';

const CATEGORY_OPTIONS = [
  { label: '예약',       value: 'RESERVATION' },
  { label: '결제',       value: 'PAYMENT' },
  { label: '취소',       value: 'CANCEL' },
  { label: '환불',       value: 'REFUND' },
  { label: '계정',       value: 'ACCOUNT' },
  { label: '서비스 이용', value: 'SERVICE' },
  { label: '기타',       value: 'OTHER' },
];

const EMPTY_FORM = { title: '', content: '', category: 'RESERVATION' };

export default function FaqFormPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const pageTitle = isEdit ? 'FAQ 수정' : 'FAQ 등록';

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [cancelModal, setCancelModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEdit || !id) return;
    const fetch = async () => {
      try {
        const { data } = await api.get(`/faq/${id}`);
        setForm({ title: data.title, content: data.content, category: data.category });
      } catch {
        navigate('/admin/faq', { replace: true });
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
    if (!form.title.trim()) errs.title = '질문을 입력해 주세요.';
    if (form.title.trim().length > 100) errs.title = '질문은 100자 이내로 입력해 주세요.';
    if (!form.content.trim()) errs.content = '답변을 입력해 주세요.';
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
      const payload = { title: form.title, content: form.content, category: form.category };
      if (isEdit) {
        await api.put(`/faq/${id}`, payload);
      } else {
        await api.post('/faq', payload);
      }
      navigate('/admin/faq');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout
      title={pageTitle}
      description={isEdit ? `FAQ #${id}를 수정합니다.` : '새 FAQ를 등록합니다.'}
      backTo="/admin/faq"
      backLabel="FAQ 관리"
      maxWidth={900}
    >
      <FormLayout>
        {/* 좌측 본문 */}
        <MainColumn>
          <FormCard padded elevated>
            {/* 질문 */}
            <Field>
              <Label required>질문</Label>
              <Input
                placeholder="사용자가 자주 묻는 질문을 입력하세요 (최대 100자)"
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

            {/* 답변 */}
            <Field>
              <Label required>답변</Label>
              <Textarea
                placeholder="질문에 대한 답변을 입력하세요."
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={12}
                $error={!!errors.content}
                aria-required="true"
              />
              {errors.content && <ErrorMsg>{errors.content}</ErrorMsg>}
            </Field>
          </FormCard>
        </MainColumn>

        {/* 우측 설정 */}
        <SideColumn>
          <FormCard padded elevated>
            <SectionTitle>기본 설정</SectionTitle>

            {/* 카테고리 */}
            <Field>
              <Label required>카테고리</Label>
              <Select
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                aria-label="카테고리 선택"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </Field>
          </FormCard>

          {/* 미리보기 */}
          {(form.title || form.content) && (
            <PreviewCard padded>
              <SectionTitle>미리보기</SectionTitle>
              <PreviewQ>Q. {form.title || '질문이 여기 표시됩니다.'}</PreviewQ>
              <PreviewA>{form.content || '답변이 여기 표시됩니다.'}</PreviewA>
            </PreviewCard>
          )}

          {/* 버튼 */}
          <ButtonGroup>
            <Button variant="secondary" full onClick={() => setCancelModal(true)}>
              취소
            </Button>
            <Button variant="primary" full onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? '저장 중...' : isEdit ? '수정 완료' : '등록'}
            </Button>
          </ButtonGroup>
        </SideColumn>
      </FormLayout>

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
            <Button variant="danger" onClick={() => navigate('/admin/faq')}>
              나가기
            </Button>
          </>
        }
      >
        <ModalText>작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?</ModalText>
      </Modal>
    </PageLayout>
  );
}

// ─── Styled Components ───────────────────────────────────────────────────────

const FormLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-5);
  align-items: flex-start;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const MainColumn = styled.div``;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const FormCard = styled(Card)``;

const PreviewCard = styled(Card)`
  background: var(--cream, #f4efe6);
  border-color: rgba(168, 184, 159, 0.3);
`;

const SectionTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-4);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--gray-100);
`;

const Field = styled.div`
  margin-bottom: var(--space-4);
  &:last-child { margin-bottom: 0; }
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
  min-height: 260px;
  border-color: ${(p) => (p.$error ? '#b85a4e' : 'var(--gray-200)')};
`;

const Select = styled.select`
  ${baseInputStyle}
  height: 42px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
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

const PreviewQ = styled.p`
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
  line-height: 1.5;
`;

const PreviewA = styled.pre`
  font-family: inherit;
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-2);
`;

const ModalText = styled.p`
  font-size: 0.92rem;
  color: var(--gray-700);
  line-height: 1.6;
`;
