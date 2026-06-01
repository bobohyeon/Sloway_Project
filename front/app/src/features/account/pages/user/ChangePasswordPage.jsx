import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import EmailVerifyField from '../../components/user/EmailVerifyField';
import { useMyPage } from '../../hooks/useMyPage';
import { changeMyPassword } from '../../api/userApi';
import { logout } from '../../../auth/store/authSlice';

// ─── Styled Components ─────────────────────────────────────
const CardStack = styled.div`
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
`;

const HelpText = styled.span`
  font-size: 12px;
  color: var(--gray-400);
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

  &:hover {
    opacity: 0.9;
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

function ChangePasswordPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profile } = useMyPage(); // 본인 이메일 (인증 대상)

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwConfirm, setNewPwConfirm] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    // 클라이언트 검증
    if (!emailVerified) {
      setError('이메일 인증을 먼저 완료해주세요.');
      return;
    }
    if (!currentPw) {
      setError('현재 비밀번호를 입력해주세요.');
      return;
    }
    if (newPw.length < 4) {
      setError('새 비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    if (newPw !== newPwConfirm) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setSaving(true);
    try {
      await changeMyPassword(currentPw, newPw);
      alert('비밀번호가 변경되었습니다. 다시 로그인해주세요.');
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message ?? '비밀번호 변경에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      title="비밀번호 변경"
      description="안전한 계정 보호를 위해 주기적으로 비밀번호를 변경해주세요."
    >
      <CardStack>
        {/* 이메일 인증 (본인 이메일로 고정) */}
        <Card>
          <EmailVerifyField
            value={profile?.email ?? ''}
            onChange={() => {}}
            initialEmail=""
            onVerifiedChange={setEmailVerified}
          />
        </Card>

        <Card>
          <FormGroup>
            <Label htmlFor="currentPw">현재 비밀번호</Label>
            <Input
              id="currentPw"
              type="password"
              placeholder="현재 비밀번호 입력"
              autoComplete="current-password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
            />
            <HelpText>&nbsp;</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPw">새 비밀번호</Label>
            <Input
              id="newPw"
              type="password"
              placeholder="4자 이상"
              autoComplete="new-password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
            />
            <HelpText>4자 이상 입력해주세요.</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="newPwConfirm">새 비밀번호 확인</Label>
            <Input
              id="newPwConfirm"
              type="password"
              placeholder="새 비밀번호 재입력"
              autoComplete="new-password"
              value={newPwConfirm}
              onChange={(e) => setNewPwConfirm(e.target.value)}
            />
            <HelpText style={{ color: error ? '#e24b4a' : undefined }}>
              {error || '\u00A0'}
            </HelpText>
          </FormGroup>
        </Card>

        <InfoBox>
          비밀번호 변경 후 보안을 위해 자동으로 로그아웃돼요.
          <br />새 비밀번호로 다시 로그인해주세요.
        </InfoBox>

        <ButtonRow>
          <GhostBtn onClick={() => navigate('/user/mypage')}>취소</GhostBtn>
          <PrimaryBtn onClick={handleSubmit} disabled={saving}>
            {saving ? '변경 중...' : '비밀번호 변경'}
          </PrimaryBtn>
        </ButtonRow>
      </CardStack>
    </PageLayout>
  );
}
export default ChangePasswordPage;
