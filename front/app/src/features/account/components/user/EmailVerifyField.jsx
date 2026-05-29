import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaCheckCircle } from 'react-icons/fa';
import { sendVerifyCode, verifyCode } from '../../../auth/api/authApi';
// ─── 상수 ───────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_VERIFY_TIMEOUT = 180; // 인증번호 유효시간 (초)
const EMAIL_CODE_LENGTH = 6;

// ─── 유틸 ───────────────────────────────────────────────────
const formatTimer = (sec) => {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
};

// ─── Styled ────────────────────────────────────────────────
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const VerifiedText = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #5a7a42;
  font-weight: 500;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
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
  width: 100%;

  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`;

const ActionBtn = styled.button`
  height: 42px;
  padding: 0 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid var(--sage);
  background: #fff;
  color: var(--sage);
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: var(--sage);
    color: #fff;
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: ${(p) => (p.$error ? '#e24b4a' : 'var(--gray-400)')};
  min-height: 16px;
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
/**
 * 이메일 + 인증 입력 필드
 * 내부에서 발송/확인/타이머/재발송 상태머신을 관리하고,
 * 외부엔 이메일 값과 인증 완료 여부만 노출한다.
 *
 * @param {string} value             현재 이메일 값
 * @param {(email: string) => void} onChange 이메일 변경 콜백
 * @param {string} initialEmail      변경 비교용 원본 이메일
 * @param {(verified: boolean) => void} onVerifiedChange 인증 상태 콜백
 */
function EmailVerifyField({ value, onChange, initialEmail, onVerifiedChange }) {
  // idle: 초기 / sent: 발송됨 / verified: 인증 완료
  const [status, setStatus] = useState('idle');
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [codeError, setCodeError] = useState(null);

  const emailChanged = value !== initialEmail;
  const verified = status === 'verified';

  // 타이머
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => {
      setTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timer]);

  // 부모에 인증 상태 전파
  useEffect(() => {
    onVerifiedChange?.(verified);
  }, [verified, onVerifiedChange]);

  const handleEmailChange = (e) => {
    onChange?.(e.target.value);
    // 이메일이 바뀌면 인증 상태 전부 리셋 (보안상 핵심)
    setStatus('idle');
    setCode('');
    setTimer(0);
    setEmailError(null);
    setCodeError(null);
  };

  const handleSend = async () => {
    if (!EMAIL_REGEX.test(value)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    if (value === initialEmail) {
      setEmailError('현재 사용 중인 이메일과 동일합니다.');
      return;
    }

    setSending(true);
    try {
      await sendVerifyCode(value);
      setStatus('sent');
      setCode('');
      setTimer(EMAIL_VERIFY_TIMEOUT);
      setEmailError(null);
      setCodeError(null);
    } catch (err) {
      setEmailError(
        err.response?.data?.message ??
          '인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (code.length !== EMAIL_CODE_LENGTH) {
      setCodeError(`인증번호 ${EMAIL_CODE_LENGTH}자리를 입력해주세요.`);
      return;
    }

    setVerifying(true);
    try {
      await verifyCode(value, code);
      setStatus('verified');
      setTimer(0);
      setCodeError(null);
    } catch (err) {
      setCodeError(
        err.response?.data?.message ?? '인증번호가 일치하지 않습니다.'
      );
    } finally {
      setVerifying(false);
    }
  };

  const handleCodeChange = (e) => {
    const onlyDigits = e.target.value
      .replace(/\D/g, '')
      .slice(0, EMAIL_CODE_LENGTH);
    setCode(onlyDigits);
    if (codeError) setCodeError(null);
  };

  const sendBtnLabel = (() => {
    if (sending) return '발송 중...';
    if (status === 'idle') return '인증번호 발송';
    if (timer > 0) return `재발송 (${formatTimer(timer)})`;
    return '재발송';
  })();

  return (
    <Wrapper>
      <Label htmlFor="email">
        이메일
        {verified && (
          <VerifiedText>
            <FaCheckCircle /> 인증 완료
          </VerifiedText>
        )}
      </Label>

      <InputRow>
        <Input
          id="email"
          name="email"
          type="email"
          value={value}
          onChange={handleEmailChange}
          placeholder="example@sloway.co.kr"
        />
        <ActionBtn
          type="button"
          onClick={handleSend}
          disabled={sending || !emailChanged || verified}
        >
          {sendBtnLabel}
        </ActionBtn>
      </InputRow>
      <HelpText $error={!!emailError}>
        {emailError || '이메일 변경 시 인증이 필요합니다.'}
      </HelpText>

      {/* 인증번호 입력 (발송 후 ~ 인증 완료 전) */}
      {status === 'sent' && (
        <>
          <InputRow style={{ marginTop: 8 }}>
            <Input
              name="emailCode"
              value={code}
              onChange={handleCodeChange}
              placeholder={`인증번호 ${EMAIL_CODE_LENGTH}자리`}
              inputMode="numeric"
            />
            <ActionBtn
              type="button"
              onClick={handleVerify}
              disabled={verifying || timer === 0}
            >
              {verifying ? '확인 중...' : '확인'}
            </ActionBtn>
          </InputRow>
          <HelpText $error={!!codeError}>
            {codeError ||
              (timer > 0
                ? `남은 시간 ${formatTimer(timer)}`
                : '인증번호가 만료되었습니다. 재발송해주세요.')}
          </HelpText>
        </>
      )}
    </Wrapper>
  );
}

export default EmailVerifyField;
