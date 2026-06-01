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
import Step1Agree from '../../components/host/Step1Agree';
import Step2Form from '../../components/host/Step2Form';
import Step3Done from '../../components/host/Step3Done';
import { useHostSignupForm } from '../../hooks/useHostSignupForm';

const STEPS = ['약관 동의', '정보 입력', '신청 완료'];

function HostSignupPage() {
  const f = useHostSignupForm();

  return (
    <AuthCard $wide>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>호스트로 시작해볼까요?</AuthTitle>
      <AuthSubtitle>나만의 공간을 Sloway에 등록해보세요</AuthSubtitle>

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

      {f.step === 1 && <Step1Agree onNext={() => f.setStep(2)} />}
      {f.step === 2 && (
        <Step2Form
          form={f.form}
          updateForm={f.updateForm}
          businessDoc={f.businessDoc}
          setBusinessDoc={f.setBusinessDoc}
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
      {f.step === 3 && <Step3Done navigate={f.navigate} />}
    </AuthCard>
  );
}

export default HostSignupPage;
