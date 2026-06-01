import React from 'react';
import {
  AuthCard,
  LogoWrap,
  AuthTitle,
  AuthSubtitle,
  StepIndicator,
  StepItem,
  StepCircle,
  StepLabel,
  StepLine,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';
import SignupStep1Agree from '../../components/user/SignupStep1Agree';
import SignupStep2Form from '../../components/user/SignupStep2Form';
import SignupStep3Done from '../../components/user/SignupStep3Done';
import { useSignupForm } from '../../hooks/useSignupForm';

const STEPS = ['약관 동의', '정보 입력', '가입 완료'];

function SignupPage() {
  const f = useSignupForm();

  return (
    <AuthCard $wide>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>Sloway 회원가입</AuthTitle>
      <AuthSubtitle>워케이션의 시작, 지금 함께해요</AuthSubtitle>

      <StepIndicator>
        {STEPS.map((label, idx) => {
          const n = idx + 1;
          return (
            <React.Fragment key={n}>
              <StepItem>
                <StepCircle $active={f.step === n} $done={f.step > n}>
                  {f.step > n ? '✓' : n}
                </StepCircle>
                <StepLabel $active={f.step === n}>{label}</StepLabel>
              </StepItem>
              {n < STEPS.length && <StepLine $done={f.step > n} />}
            </React.Fragment>
          );
        })}
      </StepIndicator>

      {f.step === 1 && <SignupStep1Agree onNext={() => f.setStep(2)} />}
      {f.step === 2 && (
        <SignupStep2Form
          form={f.form}
          updateForm={f.updateForm}
          emailVerified={f.emailVerified}
          sending={f.sending}
          verifying={f.verifying}
          codeSent={f.codeSent}
          authMsg={f.authMsg}
          handleSendCode={f.handleSendCode}
          handleVerifyCode={f.handleVerifyCode}
          submitting={f.submitting}
          error={f.error}
          onSubmit={f.handleSubmit}
          onPrev={() => f.setStep(1)}
        />
      )}
      {f.step === 3 && <SignupStep3Done navigate={f.navigate} />}
    </AuthCard>
  );
}

export default SignupPage;
