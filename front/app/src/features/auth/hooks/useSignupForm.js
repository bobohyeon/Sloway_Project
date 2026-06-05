import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSignup, sendVerifyCode, verifyCode } from '../api/authApi';
import { isValidPassword, PASSWORD_GUIDE } from '../utils/passwordValidator';
// (경로는 파일 위치마다 다름 — 아래 참고)

export function useSignupForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    emailCode: '',
    phone: '',
    birthDate: '',
    password: '',
    passwordConfirm: '',
  });
  const [emailVerified, setEmailVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [authMsg, setAuthMsg] = useState('');

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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

  const handleSubmit = async () => {
    setError('');
    if (!emailVerified) {
      setError('이메일 인증을 완료해주세요.');
      return;
    }
    if (!isValidPassword(form.password)) {
      setError(PASSWORD_GUIDE);
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setSubmitting(true);
    try {
      await userSignup({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        birthDate: form.birthDate.replace(/-/g, ''), // 1998-10-30 → 19981030
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message ?? '회원가입에 실패했습니다.');
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
    emailVerified,
    submitting,
    error,
    sending,
    verifying,
    codeSent,
    authMsg,
    handleSendCode,
    handleVerifyCode,
    handleSubmit,
  };
}
