import { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Button, Modal, Card } from '../../../pay_shared/components';
import api from '../../../../app/api/axiosApi';

const CATEGORY_OPTIONS = [
  { label: '서비스', value: 'SERVICE' },
  { label: '이벤트', value: 'EVENT' },
  { label: '점검', value: 'INSPECTION' },
  { label: '기타', value: 'OTHER' },
];

const EMPTY_FORM = { title: '', category: 'SERVICE', content: '', status: 'ACTIVE' };

export default function NoticeFormPage({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const pageTitle = isEdit ? '공지사항 수정' : '공지사항 등록';

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [cancelModal, setCancelModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      api.get(`/notice/${id}`).then(({ data }) => {
        setForm({
          title: data.title,
          category: data.category,
          content: data.content,
          status: data.status,
        });
      });
    }
  }, [isEdit, id]);

  // ─── 필드 변경 핸들러 ─────────────────────────────────────────────────────
  const handleChange = useCallback(
    (field, value) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      // 에러 실시간 클리어
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    },
    [errors]
  );

  // ─── 유효성 검사 (백엔드 연동 시 서버 검증과 이중 검증 구조 권장) ──────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = '제목을 입력해 주세요.';
    if (form.title.trim().length > 100)
      errs.title = '제목은 100자 이내로 입력해 주세요.';
    if (!form.content.trim()) errs.content = '내용을 입력해 주세요.';
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
      const payload = { title: form.title, content: form.content, category: form.category, status: form.status };
      if (isEdit) {
        await api.put(`/notice/${id}`, payload);
      } else {
        await api.post('/notice', payload);
      }
      navigate('/admin/notice');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout
      title={pageTitle}
      description={
        isEdit ? `공지사항 #${id}를 수정합니다.` : '새 공지사항을 작성합니다.'
      }
      backTo="/admin/notice"
      backLabel="공지 관리"
      maxWidth={1200}
    >
      <FormLayout>
        {/* 좌측 본문 영역 */}
        <MainColumn>
          <FormCard padded elevated>
            {/* 제목 */}
            <Field>
              <Label required>제목</Label>
              <Input
                placeholder="공지사항 제목을 입력하세요 (최대 100자)"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                maxLength={100}
                $error={!!errors.title}
                aria-required="true"
                aria-describedby={errors.title ? 'title-error' : undefined}
              />
              <FieldBottom>
                {errors.title ? (
                  <ErrorMsg id="title-error">{errors.title}</ErrorMsg>
                ) : (
                  <CharCount $warn={form.title.length > 90}>
                    {form.title.length}/100
                  </CharCount>
                )}
              </FieldBottom>
            </Field>

            {/* 내용 */}
            <Field>
              <Label required>내용</Label>
              {/* 
                실무 팁: 실제로는 react-quill, tiptap 같은 리치 에디터 사용 권장
                백엔드 저장 시 XSS 방지를 위해 DOMPurify 처리 필수
              */}
              <Textarea
                placeholder="공지사항 내용을 입력하세요."
                value={form.content}
                onChange={(e) => handleChange('content', e.target.value)}
                rows={14}
                $error={!!errors.content}
                aria-required="true"
              />
              {errors.content && <ErrorMsg>{errors.content}</ErrorMsg>}
              <EditorHint>
                💡 실제 서비스에서는 리치 텍스트 에디터가 들어갑니다.
              </EditorHint>
            </Field>
          </FormCard>
        </MainColumn>

        {/* 우측 설정 영역 */}
        <SideColumn>
          {/* 기본 설정 */}
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
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>

            {/* 게시 상태 */}
            <Field>
              <Label required>게시 상태</Label>
              <RadioGroup role="radiogroup" aria-label="게시 상태">
                <RadioLabel>
                  <Radio
                    type="radio"
                    name="status"
                    value="ACTIVE"
                    checked={form.status === 'ACTIVE'}
                    onChange={() => handleChange('status', 'ACTIVE')}
                  />
                  <span>게시</span>
                </RadioLabel>
                <RadioLabel>
                  <Radio
                    type="radio"
                    name="status"
                    value="INACTIVE"
                    checked={form.status === 'INACTIVE'}
                    onChange={() => handleChange('status', 'INACTIVE')}
                  />
                  <span>미게시</span>
                </RadioLabel>
              </RadioGroup>
            </Field>
          </FormCard>

          {/* 하단 버튼 */}
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
            <Button variant="danger" onClick={() => navigate('/admin/notice')}>
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
const FormLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-5);
  align-items: flex-start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);

  @media (max-width: 900px) {
    /* 모바일에서는 본문 아래로 */
  }
`;

const FormCard = styled(Card)``;

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

  /* required 표시 */
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

  &::placeholder {
    color: var(--gray-300);
  }

  &:focus {
    border-color: var(--sage);
  }
`;

const Input = styled.input`
  ${baseInputStyle}
  height: 42px;
  border-color: ${(p) => (p.$error ? '#b85a4e' : 'var(--gray-200)')};

  &:focus {
    border-color: ${(p) => (p.$error ? '#b85a4e' : 'var(--sage)')};
  }
`;

const Textarea = styled.textarea`
  ${baseInputStyle}
  resize: vertical;
  line-height: 1.7;
  min-height: 280px;
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

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-2);
`;

const ModalText = styled.p`
  font-size: 0.92rem;
  color: var(--gray-700);
  line-height: 1.6;
`;
