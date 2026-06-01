import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthCard,
  LogoWrap,
  AuthTitle,
  AuthSubtitle,
  FormGroup,
  FormLabel,
  FormInput,
  BtnPrimary,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';
import ErrorMessage from '../../components/common/ErrorMessage';
import { sendVerifyCode, verifyCode, resetPassword } from '../../api/authApi';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ResetPasswordPage() {
  const navigate = useNavigate();

  // step: 'verify'(이메일 인증) → 'reset'(새 비번) → done
  const [step, setStep] = useState('verify');
  const [done, setDone] = useState(false);

  // 1단계: 이메일 인증
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // 2단계: 새 비번
  const [pw, setPw] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');

  // ── 인증코드 발송 ──
  const handleSend = async () => {
    if (!EMAIL_REGEX.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await sendVerifyCode(email);
      setCodeSent(true);
    } catch (err) {
      setError(err.response?.data?.message ?? '인증번호 발송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  // ── 인증코드 확인 → 2단계로 ──
  const handleVerify = async () => {
    if (code.length !== 6) {
      setError('인증번호 6자리를 입력해주세요.');
      return;
    }
    setVerifying(true);
    setError('');
    try {
      await verifyCode(email, code);
      setStep('reset'); // 인증 성공 → 새 비번 단계
    } catch (err) {
      setError(err.response?.data?.message ?? '인증번호가 일치하지 않습니다.');
    } finally {
      setVerifying(false);
    }
  };

  // ── 새 비번 설정 ──
  const handleReset = async () => {
    if (pw.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    if (pw !== pwConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await resetPassword(email, pw);
      setDone(true);
    } catch (err) {
      setError(
        err.response?.data?.message ?? '비밀번호 재설정에 실패했습니다.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── 완료 화면 ──
  if (done) {
    return (
      <AuthCard>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#e8efe5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12l2 2 4-4"
                stroke="#5a7a42"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="9" stroke="#A8B89F" strokeWidth="2" />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#2c2a22',
              marginBottom: 8,
            }}
          >
            비밀번호 재설정 완료
          </h1>
          <p
            style={{
              fontSize: 13,
              color: '#9a9280',
              marginBottom: 24,
              lineHeight: 1.7,
            }}
          >
            새로운 비밀번호로 변경됐어요.
            <br />
            다시 로그인해주세요.
          </p>
          <BtnPrimary type="button" onClick={() => navigate('/login')}>
            로그인하러 가기
          </BtnPrimary>
        </div>
      </AuthCard>
    );
  }

  // ── 1단계: 이메일 인증 ──
  if (step === 'verify') {
    return (
      <AuthCard>
        <LogoWrap>
          <SlowyLogo size={32} />
        </LogoWrap>
        <AuthTitle>비밀번호 찾기</AuthTitle>
        <AuthSubtitle>가입한 이메일로 본인 인증을 진행해주세요</AuthSubtitle>

        <FormGroup>
          <FormLabel>이메일</FormLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            <FormInput
              type="email"
              placeholder="example@sloway.co.kr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={codeSent}
              style={{ flex: 1 }}
            />
            <BtnPrimary
              type="button"
              onClick={handleSend}
              disabled={sending}
              style={{ width: 'auto', whiteSpace: 'nowrap', padding: '0 14px' }}
            >
              {sending ? '발송 중' : codeSent ? '재발송' : '인증 발송'}
            </BtnPrimary>
          </div>
        </FormGroup>

        {codeSent && (
          <FormGroup>
            <FormLabel>인증번호</FormLabel>
            <FormInput
              placeholder="인증번호 6자리"
              inputMode="numeric"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
              }
            />
          </FormGroup>
        )}

        <ErrorMessage message={error} />

        <BtnPrimary
          type="button"
          onClick={handleVerify}
          disabled={!codeSent || verifying}
        >
          {verifying ? '확인 중...' : '인증 확인'}
        </BtnPrimary>
      </AuthCard>
    );
  }

  // ── 2단계: 새 비번 ──
  return (
    <AuthCard>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>비밀번호 재설정</AuthTitle>
      <AuthSubtitle>새로운 비밀번호를 입력해주세요</AuthSubtitle>

      <FormGroup>
        <FormLabel>
          새 비밀번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="password"
          placeholder="새 비밀번호 입력"
          autoComplete="new-password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>
          새 비밀번호 확인 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="password"
          placeholder="새 비밀번호 재입력"
          autoComplete="new-password"
          value={pwConfirm}
          onChange={(e) => setPwConfirm(e.target.value)}
        />
      </FormGroup>

      <ErrorMessage message={error} />

      <BtnPrimary type="button" onClick={handleReset} disabled={submitting}>
        {submitting ? '변경 중...' : '비밀번호 변경'}
      </BtnPrimary>
    </AuthCard>
  );
}

export default ResetPasswordPage;
