import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Card } from '../../pay_shared/components';

// ─── 수정 모드 Mock 데이터 (백엔드 연동 시 GET /api/admin/faqs/:id 로 대체) ──
const MOCK_FAQ = {
  question: '예약 취소는 어떻게 하나요?',
  answer:
    "예약 취소는 마이페이지 > 예약 목록에서 해당 예약을 선택한 후 '취소 신청' 버튼을 클릭하시면 됩니다.\n\n취소 수수료는 예약일 기준으로 다음과 같이 적용됩니다.\n- 이용일 7일 전: 100% 환불\n- 이용일 3~6일 전: 50% 환불\n- 이용일 2일 이내: 환불 불가",
  category: '취소·환불',
  order: 3,
  status: 'active',
};

const CATEGORY_OPTIONS = [
  '예약·결제',
  '취소·환불',
  '계정',
  '서비스 이용',
  '기타',
];

export default function FaqFormPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const pageTitle = isEdit ? 'FAQ 수정' : 'FAQ 등록';

  // ─── 폼 상태 ─────────────────────────────────────────────────────────────
  const initData = isEdit
    ? MOCK_FAQ
    : {
        question: '',
        answer: '',
        category: '예약·결제',
        order: '',
        status: 'active',
      };

  const [form, setForm] = useState(initData);
  const [errors, setErrors] = useState({});
  const [cancelModal, setCancelModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    },
    [errors]
  );

  // ─── 유효성 검사 ─────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.question.trim()) errs.question = '질문을 입력해 주세요.';
    if (form.question.trim().length > 200)
      errs.question = '질문은 200자 이내로 입력해 주세요.';
    if (!form.answer.trim()) errs.answer = '답변을 입력해 주세요.';
    if (
      form.order !== '' &&
      (isNaN(Number(form.order)) || Number(form.order) < 1)
    ) {
      errs.order = '올바른 순서를 입력해 주세요.';
    }
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
      // 백엔드 연동 시:
      // isEdit ? PUT /api/admin/faqs/:id : POST /api/admin/faqs
      // body: { question, answer, category, order, status }
      await new Promise((r) => setTimeout(r, 600));
      navigate('/admin/faqs');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Wrap>
      <PageHeader>
        <div>
          <PageTitle>{pageTitle}</PageTitle>
          <PageDesc>
            {isEdit ? `FAQ #${id}를 수정합니다.` : '새 FAQ를 등록합니다.'}
          </PageDesc>
        </div>
      </PageHeader>

      <FormLayout>
        {/* 좌측 본문 */}
        <MainColumn>
          <FormCard padded elevated>
            {/* 질문 */}
            <Field>
              <Label required>질문</Label>
              <Input
                placeholder="사용자가 자주 묻는 질문을 입력하세요 (최대 200자)"
                value={form.question}
                onChange={(e) => handleChange('question', e.target.value)}
                maxLength={200}
                $error={!!errors.question}
                aria-required="true"
              />
              <FieldBottom>
                {errors.question ? (
                  <ErrorMsg>{errors.question}</ErrorMsg>
                ) : (
                  <CharCount $warn={form.question.length > 180}>
                    {form.question.length}/200
                  </CharCount>
                )}
              </FieldBottom>
            </Field>

            {/* 답변 */}
            <Field>
              <Label required>답변</Label>
              {/*
                실무: 리치 에디터(tiptap, quill) 연동 시 이 Textarea를 교체
                저장 전 DOMPurify.sanitize() 처리 필수
              */}
              <Textarea
                placeholder="질문에 대한 답변을 입력하세요."
                value={form.answer}
                onChange={(e) => handleChange('answer', e.target.value)}
                rows={12}
                $error={!!errors.answer}
                aria-required="true"
              />
              {errors.answer && <ErrorMsg>{errors.answer}</ErrorMsg>}
              <EditorHint>
                💡 실제 서비스에서는 리치 텍스트 에디터가 들어갑니다.
              </EditorHint>
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
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>

            {/* 노출 순서 */}
            <Field>
              <Label>
                노출 순서
                <OptionalTag>선택</OptionalTag>
              </Label>
              <Input
                type="number"
                placeholder="숫자로 입력 (비우면 자동)"
                value={form.order}
                onChange={(e) => handleChange('order', e.target.value)}
                min={1}
                $error={!!errors.order}
              />
              {errors.order ? (
                <ErrorMsg>{errors.order}</ErrorMsg>
              ) : (
                <FieldHint>낮은 숫자일수록 상단에 노출됩니다.</FieldHint>
              )}
            </Field>

            {/* 게시 상태 */}
            <Field>
              <Label required>게시 상태</Label>
              <RadioGroup role="radiogroup" aria-label="게시 상태">
                <RadioLabel>
                  <Radio
                    type="radio"
                    name="status"
                    value="active"
                    checked={form.status === 'active'}
                    onChange={() => handleChange('status', 'active')}
                  />
                  <span>게시</span>
                </RadioLabel>
                <RadioLabel>
                  <Radio
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={form.status === 'inactive'}
                    onChange={() => handleChange('status', 'inactive')}
                  />
                  <span>미게시</span>
                </RadioLabel>
              </RadioGroup>
            </Field>
          </FormCard>

          {/* 미리보기 카드 */}
          {(form.question || form.answer) && (
            <PreviewCard padded>
              <SectionTitle>미리보기</SectionTitle>
              <PreviewItem>
                <PreviewQ>
                  Q. {form.question || '질문이 여기 표시됩니다.'}
                </PreviewQ>
                <PreviewA>{form.answer || '답변이 여기 표시됩니다.'}</PreviewA>
              </PreviewItem>
            </PreviewCard>
          )}

          {/* 버튼 */}
          <ButtonGroup>
            <Button
              variant="secondary"
              full
              onClick={() => setCancelModal(true)}
            >
              취소
            </Button>
            <Button
              variant="primary"
              full
              onClick={handleSubmit}
              disabled={isSaving}
            >
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
            <Button variant="danger" onClick={() => navigate('/admin/faqs')}>
              나가기
            </Button>
          </>
        }
      >
        <ModalText>
          작성 중인 내용이 저장되지 않습니다. 정말 나가시겠습니까?
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

const PageHeader = styled.div`
  margin-bottom: var(--space-6);
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

const FormLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-5);
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
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

const OptionalTag = styled.span`
  font-size: 0.72rem;
  padding: 1px 6px;
  background: var(--gray-100);
  color: var(--gray-500);
  border-radius: var(--radius-full);
  font-weight: 500;
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

const RadioGroup = styled.div`
  display: flex;
  gap: var(--space-4);
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.88rem;
  color: var(--gray-700);
`;

const Radio = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--sage);
  cursor: pointer;
`;

const FieldBottom = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
`;

const FieldHint = styled.p`
  font-size: 0.75rem;
  color: var(--gray-400);
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

const EditorHint = styled.p`
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 6px;
`;

const PreviewItem = styled.div``;

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
