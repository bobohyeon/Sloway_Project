import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ProfileImageField from '../../components/user/ProfileImageField';
import EmailVerifyField from '../../components/user/EmailVerifyField';
import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─── 더미 초기 데이터 (백엔드 연동 후 GET API로 교체) ───────
const DUMMY_INITIAL = {
  email: 'hong@sloway.co.kr',
  name: '홍길동',
  phone: '010-1234-5678',
  birth: '1990-01-01',
  imgUrl: null,
};

// ─── 검증 규칙 ──────────────────────────────────────────────
const NAME_MIN = 2;
const NAME_MAX = 20;
const PHONE_REGEX = /^010-\d{4}-\d{4}$/;

// ─── 유틸 ───────────────────────────────────────────────────
const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

// ─── Styled Components ─────────────────────────────────────
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  padding: 28px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  & + & {
    margin-top: 18px;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
`;

const Input = styled.input`
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: var(--gray-800);
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--sage);
  }
  &:disabled {
    background: #f5f3ef;
    color: var(--gray-400);
    cursor: not-allowed;
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: ${(p) => (p.$error ? '#e24b4a' : 'var(--gray-400)')};
  min-height: 16px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const PrimaryBtn = styled.button`
  height: 42px;
  padding: 0 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: var(--sage);
  color: #fff;
  transition: opacity 0.15s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const GhostBtn = styled.button`
  height: 42px;
  padding: 0 22px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);

  &:hover {
    border-color: var(--gray-400);
  }
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
function ProfileEditPage() {
  const navigate = useNavigate();
  const [initial] = useState(DUMMY_INITIAL);

  // 폼 값
  const [form, setForm] = useState({
    email: initial.email,
    name: initial.name,
    phone: initial.phone,
  });

  // 자식 컴포넌트가 알려주는 결과만 받음
  const [imgFile, setImgFile] = useState(null);
  const [imgRemoved, setImgRemoved] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // 자식 콜백은 useCallback으로 감싸서 자식 useEffect의 무한 루프 방지
  const handleImageChange = useCallback((file, removed) => {
    setImgFile(file);
    setImgRemoved(removed);
  }, []);

  const handleEmailChange = useCallback(
    (email) => {
      setForm((prev) => ({ ...prev, email }));
      if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
    },
    [errors.email]
  );

  const handleVerifiedChange = useCallback((verified) => {
    setEmailVerified(verified);
  }, []);

  // ─── 파생 상태 ───
  const emailChanged = form.email !== initial.email;

  const isDirty = useMemo(() => {
    return (
      form.email !== initial.email ||
      form.name !== initial.name ||
      form.phone !== initial.phone ||
      imgFile !== null ||
      imgRemoved
    );
  }, [form, initial, imgFile, imgRemoved]);

  const canSave = isDirty && !saving && (!emailChanged || emailVerified);

  // ─── 핸들러 ───
  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = name === 'phone' ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: next }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const next = {};
    const name = form.name.trim();

    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      next.name = `이름은 ${NAME_MIN}~${NAME_MAX}자로 입력해주세요.`;
    }
    if (!PHONE_REGEX.test(form.phone)) {
      next.phone = '휴대폰 번호 형식이 올바르지 않습니다.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;

    setSaving(true);
    try {
      // TODO: PATCH /api/user/me (multipart/form-data)
      await new Promise((r) => setTimeout(r, 500));
      alert('저장되었습니다.');
      navigate('/user/profile');
    } catch (err) {
      console.error(err);
      alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (
      isDirty &&
      !window.confirm('변경 사항이 저장되지 않습니다. 나가시겠습니까?')
    ) {
      return;
    }
    navigate('/user/profile');
  };

  return (
    <PageLayout title="내 정보 수정">
      <Form onSubmit={handleSubmit} noValidate>
        {/* 프로필 이미지 */}
        <Card>
          <ProfileImageField
            initialUrl={initial.imgUrl}
            onChange={handleImageChange}
          />
        </Card>

        {/* 기본 정보 */}
        <Card>
          <FormGroup>
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              maxLength={NAME_MAX}
              placeholder="이름을 입력해주세요"
            />
            <HelpText $error={!!errors.name}>
              {errors.name || `${NAME_MIN}~${NAME_MAX}자`}
            </HelpText>
          </FormGroup>

          <FormGroup>
            <EmailVerifyField
              value={form.email}
              onChange={handleEmailChange}
              initialEmail={initial.email}
              onVerifiedChange={handleVerifiedChange}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">휴대폰</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              inputMode="numeric"
            />
            <HelpText $error={!!errors.phone}>
              {errors.phone || '숫자만 입력하면 자동으로 하이픈이 들어갑니다.'}
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label>생년월일</Label>
            <Input value={initial.birth} disabled />
            <HelpText>생년월일은 변경할 수 없습니다.</HelpText>
          </FormGroup>
        </Card>

        <ButtonRow>
          <GhostBtn type="button" onClick={handleCancel}>
            취소
          </GhostBtn>
          <PrimaryBtn type="submit" disabled={!canSave}>
            {saving ? '저장 중...' : '저장'}
          </PrimaryBtn>
        </ButtonRow>
      </Form>
    </PageLayout>
  );
}

export default ProfileEditPage;
