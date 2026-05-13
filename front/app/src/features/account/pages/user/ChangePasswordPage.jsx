import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// ─── 검증 규칙 (회원가입과 동일 정책 유지) ─────────────────
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

// ─── Styled Components ─────────────────────────────────────
const Page = styled.div`
  padding: 32px;
  max-width: 560px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: var(--gray-800);
`;

const PageDesc = styled.p`
  font-size: 13px;
  color: var(--gray-400);
  margin-top: -10px;
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
`;

const HelpText = styled.span`
  font-size: 12px;
  color: ${(p) => (p.$error ? '#e24b4a' : 'var(--gray-400)')};
  min-height: 16px;
`;

const InfoBox = styled.div`
  background: rgba(168, 184, 159, 0.12);
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 12px;
  color: #5b6b53;
  line-height: 1.6;
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
function ChangePasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPw: '',
    newPw: '',
    newPwConfirm: '',
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // ─── 파생 상태 ───
  const allFilled = useMemo(
    () => form.currentPw && form.newPw && form.newPwConfirm,
    [form]
  );
  const canSubmit = !!allFilled && !saving;

  // ─── 핸들러 ───
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const next = {};

    if (!form.currentPw) {
      next.currentPw = '현재 비밀번호를 입력해주세요.';
    }
    if (!PASSWORD_REGEX.test(form.newPw)) {
      next.newPw = '영문, 숫자, 특수문자를 포함해 8자 이상 입력해주세요.';
    }
    if (form.newPw && form.currentPw && form.newPw === form.currentPw) {
      next.newPw = '현재 비밀번호와 다른 비밀번호를 입력해주세요.';
    }
    if (form.newPw !== form.newPwConfirm) {
      next.newPwConfirm = '비밀번호가 일치하지 않습니다.';
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
      // TODO: PATCH /api/user/password
      // Body: { currentPassword, newPassword }
      // 응답 코드별 처리:
      //  - 401: 현재 비밀번호 불일치 → setErrors({ currentPw: '...' })
      //  - 409: 이전 비밀번호와 동일 → setErrors({ newPw: '...' })
      //  - 500: 일반 에러 alert
      await new Promise((r) => setTimeout(r, 500));

      // 보안: 메모리에 남은 평문 비밀번호 즉시 제거
      setForm({ currentPw: '', newPw: '', newPwConfirm: '' });

      // TODO: 강제 재로그인 처리
      // - localStorage / sessionStorage에서 토큰 제거
      // - (선택) 서버에 로그아웃 호출로 RefreshToken 무효화
      alert('비밀번호가 변경되었습니다. 보안을 위해 다시 로그인해주세요.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    const isDirty = form.currentPw || form.newPw || form.newPwConfirm;
    if (
      isDirty &&
      !window.confirm('변경 사항이 저장되지 않습니다. 나가시겠습니까?')
    ) {
      return;
    }
    navigate('/user/mypage');
  };

  return (
    <Page>
      <PageTitle>비밀번호 변경</PageTitle>
      <PageDesc>
        안전한 계정 보호를 위해 주기적으로 비밀번호를 변경해주세요.
      </PageDesc>

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <FormGroup>
            <Label htmlFor="currentPw">현재 비밀번호</Label>
            <Input
              id="currentPw"
              name="currentPw"
              type="password"
              value={form.currentPw}
              onChange={handleChange}
              placeholder="현재 비밀번호 입력"
              autoComplete="current-password"
            />
            <HelpText $error={!!errors.currentPw}>
              {errors.currentPw || '\u00A0'}
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPw">새 비밀번호</Label>
            <Input
              id="newPw"
              name="newPw"
              type="password"
              value={form.newPw}
              onChange={handleChange}
              placeholder="영문, 숫자, 특수문자 포함 8자 이상"
              autoComplete="new-password"
            />
            <HelpText $error={!!errors.newPw}>
              {errors.newPw || '영문 · 숫자 · 특수문자 포함 8자 이상'}
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPwConfirm">새 비밀번호 확인</Label>
            <Input
              id="newPwConfirm"
              name="newPwConfirm"
              type="password"
              value={form.newPwConfirm}
              onChange={handleChange}
              placeholder="새 비밀번호 재입력"
              autoComplete="new-password"
            />
            <HelpText $error={!!errors.newPwConfirm}>
              {errors.newPwConfirm || '\u00A0'}
            </HelpText>
          </FormGroup>
        </Card>

        <InfoBox>
          비밀번호 변경 후 보안을 위해 자동으로 로그아웃돼요.
          <br />새 비밀번호로 다시 로그인해주세요.
        </InfoBox>

        <ButtonRow>
          <GhostBtn type="button" onClick={handleCancel}>
            취소
          </GhostBtn>
          <PrimaryBtn type="submit" disabled={!canSubmit}>
            {saving ? '변경 중...' : '비밀번호 변경'}
          </PrimaryBtn>
        </ButtonRow>
      </form>
    </Page>
  );
}

export default ChangePasswordPage;
