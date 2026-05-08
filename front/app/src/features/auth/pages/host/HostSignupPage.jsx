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

const STEPS = ['약관 동의', '정보 입력', '신청 완료'];
const TERMS = [
  { id: 'service', label: '호스트 서비스 이용약관', required: true },
  { id: 'privacy', label: '개인정보 처리방침 동의', required: true },
  { id: 'business', label: '사업자 정보 제공 및 활용 동의', required: true },
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
        이미 호스트이신가요?{' '}
        <AuthLink as={Link} to="/host/login">
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
      <p style={{ ...sectionTitle, marginTop: 20 }}>사업자 정보</p>
      <FormGroup>
        <FormLabel>
          상호명 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput type="text" placeholder="예) 청평 힐링 스테이" />
      </FormGroup>
      <FormGroup>
        <FormLabel>
          사업자등록번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput type="text" placeholder="000-00-00000" maxLength={12} />
      </FormGroup>
      <FormGroup>
        <FormLabel>
          사업자등록증 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              flex: 1,
              padding: '11px 14px',
              border: '1px solid #ddd8cc',
              borderRadius: 8,
              fontSize: 13,
              color: '#c4bdb0',
              background: '#fff',
            }}
          >
            파일을 선택해주세요 (PDF, JPG, PNG)
          </div>
          <label
            style={{
              padding: '10px 14px',
              background: '#A8B89F',
              color: '#fff',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            파일 선택
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <p style={{ fontSize: 11, color: '#9a9280', marginTop: 4 }}>
          승인 검토에 사용되며 외부에 공개되지 않아요.
        </p>
      </FormGroup>
      <InfoBox>
        <strong style={{ display: 'block', marginBottom: 4 }}>
          호스트 승인 안내
        </strong>
        신청 후 영업일 기준 1~3일 내 검토 후 승인 결과를 이메일로 안내드려요.
      </InfoBox>
      <BtnPrimary type="button" onClick={onNext}>
        호스트 신청
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
          호스트 신청이 완료됐어요!
        </h2>
        <p style={{ fontSize: 13, color: '#9a9280', lineHeight: 1.7 }}>
          영업일 기준 1~3일 내 검토 후<br />
          이메일로 결과를 안내드려요.
        </p>
      </div>
      <BtnPrimary type="button" onClick={() => navigate('/host/login')}>
        로그인하러 가기
      </BtnPrimary>
      <BtnSecondary type="button" onClick={() => navigate('/')}>
        메인으로
      </BtnSecondary>
    </>
  );
}

function HostSignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

export default HostSignupPage;
