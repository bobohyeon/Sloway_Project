import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hostSignup, sendVerifyCode, verifyCode } from '../api/authApi';

/**
 * 호스트 회원가입 폼 로직 (상태 + 이메일 인증 + 제출).
 * 화면(Step 컴포넌트)은 이 훅이 주는 값/함수만 사용한다.
 */
export function useHostSignupForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    emailCode: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    businessName: '',
    businessNo: '',
  });
  const [businessDoc, setBusinessDoc] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 이메일 인증 상태 (Step2 내부에서 쓰던 것도 훅으로)
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [authMsg, setAuthMsg] = useState('');

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 인증번호 발송
  const handleSendCode = async () => {
    if (!form.email) {
      setAuthMsg('이메일을 입력해주세요.');
      return;
    }
    setSending(true);
    setAuthMsg('');
    try {
      await sendVerifyCode(form.email);
      setCodeSent(true);
      setAuthMsg('인증번호가 발송되었습니다.');
    } catch (err) {
      setAuthMsg(err.response?.data?.message ?? '발송에 실패했습니다.');
    } finally {
      setSending(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async () => {
    if (form.emailCode.length !== 6) {
      setAuthMsg('인증번호 6자리를 입력해주세요.');
      return;
    }
    setVerifying(true);
    try {
      await verifyCode(form.email, form.emailCode);
      setEmailVerified(true);
      setAuthMsg('인증이 완료되었습니다.');
    } catch (err) {
      setAuthMsg(
        err.response?.data?.message ?? '인증번호가 일치하지 않습니다.'
      );
    } finally {
      setVerifying(false);
    }
  };

  // 최종 제출
  const handleSubmit = async () => {
    setError('');
    if (!emailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
    if (form.password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!businessDoc) {
      setError('사업자등록증 파일을 첨부해주세요.');
      return;
    }

    setSubmitting(true);
    try {
      await hostSignup(
        {
          email: form.email,
          password: form.password,
          name: form.name,
          phone: form.phone,
          birthDate: '',
          businessName: form.businessName,
          businessNo: form.businessNo,
        },
        businessDoc
      );
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message ?? '호스트 신청에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    navigate,
    step,
    setStep,
    form,
    updateForm,
    businessDoc,
    setBusinessDoc,
    emailVerified,
    submitting,
    error,
    // 인증
    sending,
    verifying,
    codeSent,
    authMsg,
    handleSendCode,
    handleVerifyCode,
    handleSubmit,
  };
}
