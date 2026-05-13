import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AuthCard,
  LogoWrap,
  AuthTitle,
  AuthSubtitle,
  FormGroup,
  FormLabel,
  FormInput,
  InputRow,
  BtnAction,
  BtnPrimary,
  BtnSecondary,
  AgreeBox,
  AgreeAllRow,
  AgreeItem,
  AgreeItemLeft,
  Badge,
  ViewBtn,
  CheckboxWrap,
  StepIndicator,
  StepItem,
  StepCircle,
  StepLabel,
  StepLine,
  AuthFooter,
  AuthLink,
  InfoBox,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';

const STEPS = ['약관 동의', '정보 입력', '가입 완료'];
const TERMS = [
  { id: 'terms', label: '이용약관 동의', required: true },
  { id: 'privacy', label: '개인정보 처리방침 동의', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false },
];

const sectionTitle = {
  fontSize: 11,
  fontWeight: 600,
  color: '#A8B89F',
  letterSpacing: '0.5px',
  marginBottom: 12,
  marginTop: 4,
  paddingBottom: 6,
  borderBottom: '1px solid #e8efe5',
};

function Step1({ onNext }) {
  return (
    <>
      <AgreeBox>
        <AgreeAllRow>
          <CheckboxWrap>
            <input type="checkbox" />
            <span>전체 동의합니다</span>
          </CheckboxWrap>
        </AgreeAllRow>
        {TERMS.map((t) => (
          <AgreeItem key={t.id}>
            <AgreeItemLeft>
              <input
                type="checkbox"
                style={{
                  width: 15,
                  height: 15,
                  accentColor: '#A8B89F',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 12 }}>
                <Badge $req={t.required}>{t.required ? '필수' : '선택'}</Badge>{' '}
                {t.label}
              </span>
            </AgreeItemLeft>
            <ViewBtn type="button">전문 보기</ViewBtn>
          </AgreeItem>
        ))}
      </AgreeBox>
      <BtnPrimary type="button" onClick={onNext}>
        다음 단계
      </BtnPrimary>
      <AuthFooter>
        이미 회원이신가요?{' '}
        <AuthLink as={Link} to="/login">
          로그인
        </AuthLink>
      </AuthFooter>
    </>
  );
}

function Step2({ onNext, onPrev }) {
  return (
    <>
      <p style={sectionTitle}>기본 정보</p>
      <FormGroup>
        <FormLabel>
          이름 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput type="text" placeholder="홍길동" />
      </FormGroup>
      <FormGroup>
        <FormLabel>
          이메일 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <InputRow>
          <FormInput type="email" placeholder="email@sloway.co.kr" />
          <BtnAction type="button">인증 발송</BtnAction>
        </InputRow>
      </FormGroup>
      <FormGroup>
        <FormLabel>
          이메일 인증번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <InputRow>
          <FormInput type="text" placeholder="인증번호 6자리" maxLength={6} />
          <BtnAction type="button">확인</BtnAction>
        </InputRow>
      </FormGroup>
      <FormGroup>
        <FormLabel>
          휴대폰 번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <InputRow>
          <div
            style={{
              padding: '11px 12px',
              border: '1px solid #ddd8cc',
              borderRadius: 8,
              fontSize: 13,
              color: '#9a9280',
              background: '#f5f2ec',
              flexShrink: 0,
            }}
          >
            +82
          </div>
          <FormInput type="tel" placeholder="010-0000-0000" maxLength={13} />
        </InputRow>
      </FormGroup>
      <FormGroup>
        <FormLabel>생년월일</FormLabel>
        <FormInput type="date" max={new Date().toISOString().split('T')[0]} />
      </FormGroup>

      <p style={{ ...sectionTitle, marginTop: 20 }}>비밀번호 설정</p>
      <FormGroup>
        <FormLabel>
          비밀번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="password"
          placeholder="영문, 숫자, 특수문자 포함 8자 이상"
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>
          비밀번호 확인 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput type="password" placeholder="비밀번호 재입력" />
      </FormGroup>

      <InfoBox>
        <strong style={{ display: 'block', marginBottom: 4 }}>
          이메일 인증 안내
        </strong>
        가입 완료 후 입력하신 이메일로 인증 메일이 발송돼요. (유효시간 30분)
      </InfoBox>

      <BtnPrimary type="button" onClick={onNext}>
        가입 완료
      </BtnPrimary>
      <BtnSecondary type="button" onClick={onPrev}>
        이전
      </BtnSecondary>
    </>
  );
}

function Step3({ navigate }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
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
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#2c2a22',
            marginBottom: 8,
          }}
        >
          가입이 완료됐어요!
        </h2>
        <p style={{ fontSize: 13, color: '#9a9280', lineHeight: 1.7 }}>
          입력하신 이메일로 인증 메일을 발송했어요.
          <br />
          메일을 확인해 인증을 완료해 주세요. (유효시간 30분)
        </p>
      </div>
      <BtnPrimary type="button" onClick={() => navigate('/login')}>
        로그인하러 가기
      </BtnPrimary>
      <BtnSecondary type="button" onClick={() => navigate('/')}>
        메인으로
      </BtnSecondary>
    </>
  );
}

function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  return (
    <AuthCard>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>새싹 회원이 되어주세요</AuthTitle>
      <AuthSubtitle>Sloway와 함께할 첫 걸음</AuthSubtitle>
      <StepIndicator>
        {STEPS.map((label, idx) => {
          const n = idx + 1;
          return (
            <React.Fragment key={n}>
              <StepItem>
                <StepCircle $active={step === n} $done={step > n}>
                  {step > n ? '✓' : n}
                </StepCircle>
                <StepLabel $active={step === n}>{label}</StepLabel>
              </StepItem>
              {n < STEPS.length && <StepLine $done={step > n} />}
            </React.Fragment>
          );
        })}
      </StepIndicator>
      {step === 1 && <Step1 onNext={() => setStep(2)} />}
      {step === 2 && (
        <Step2 onNext={() => setStep(3)} onPrev={() => setStep(1)} />
      )}
      {step === 3 && <Step3 navigate={navigate} />}
    </AuthCard>
  );
}

export default SignupPage;
