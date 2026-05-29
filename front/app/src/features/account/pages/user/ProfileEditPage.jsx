import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import EmailVerifyField from '../../components/user/EmailVerifyField';
import { useMyPage } from '../../hooks/useMyPage';
import { updateMyPage, changeMyEmail } from '../../api/userApi';
import { logout } from '../../../auth/store/authSlice';

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
  const dispatch = useDispatch();
  const { data: initial, loading } = useMyPage();

  // 기본 정보(이름·휴대폰) 폼
  const [form, setForm] = useState({ name: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // 이메일 변경 폼 (별도)
  const [newEmail, setNewEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name ?? '', phone: initial.phone ?? '' });
      setNewEmail(initial.email ?? '');
    }
  }, [initial]);

  const isDirty =
    initial && (form.name !== initial.name || form.phone !== initial.phone);
  const canSave = isDirty && !saving;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = name === 'phone' ? formatPhone(value) : value;
    setForm((prev) => ({ ...prev, [name]: next }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
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

  // ── 기본 정보 저장 (이름·휴대폰) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || !validate()) return;

    setSaving(true);
    try {
      await updateMyPage({ name: form.name.trim(), phone: form.phone });
      alert('저장되었습니다.');
      navigate('/user/profile');
    } catch (err) {
      alert(err.response?.data?.message ?? '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // ── 이메일 변경 (인증 완료 시에만) → 성공하면 로그아웃 ──
  const handleEmailChange = async () => {
    if (!emailVerified || changingEmail) return;

    setChangingEmail(true);
    try {
      await changeMyEmail(newEmail);
      alert('이메일이 변경되었습니다. 보안을 위해 다시 로그인해주세요.');
      dispatch(logout()); // 토큰의 email claim이 옛 값이라 폐기
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message ?? '이메일 변경에 실패했습니다.');
    } finally {
      setChangingEmail(false);
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

  if (loading || !initial) {
    return (
      <PageLayout title="내 정보 수정">
        <div style={{ padding: 40, color: '#888' }}>불러오는 중...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="내 정보 수정">
      <Form onSubmit={handleSubmit} noValidate>
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
            <Input value={initial.birthDate ?? ''} disabled />
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

      {/* 이메일 변경 — 별도 섹션 (저장과 분리, 성공 시 로그아웃) */}
      <Card style={{ marginTop: 24 }}>
        <FormGroup>
          <EmailVerifyField
            value={newEmail}
            onChange={setNewEmail}
            initialEmail={initial.email}
            onVerifiedChange={setEmailVerified}
          />
        </FormGroup>
        <ButtonRow>
          <PrimaryBtn
            type="button"
            onClick={handleEmailChange}
            disabled={!emailVerified || changingEmail}
          >
            {changingEmail ? '변경 중...' : '이메일 변경'}
          </PrimaryBtn>
        </ButtonRow>
        <HelpText>이메일 변경 시 보안을 위해 다시 로그인해야 합니다.</HelpText>
      </Card>
    </PageLayout>
  );
}
export default ProfileEditPage;
