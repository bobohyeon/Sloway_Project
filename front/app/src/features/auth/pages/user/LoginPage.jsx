import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AuthCard, LogoWrap, AuthTitle, AuthSubtitle,
  FormGroup, FormLabel, FormInput,
  BtnPrimary, BtnKakao, BtnGoogle,
  Divider, DividerLine, DividerText,
  CheckboxWrap, AuthFooter, AuthLink,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';

const KakaoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 1.5C4.86 1.5 1.5 4.19 1.5 7.5c0 2.09 1.3 3.93 3.27 5.02l-.83 3.07 3.56-2.34C10 16.89 10.5 16.93 11 16.93 15.14 16.93 18.5 14.24 18.5 10.93S13.14 1.5 9 1.5z" fill="#3c1e1e" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C18.622 12.814 17.64 11.108 17.64 9.2z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

function LoginPage() {
  const navigate = useNavigate();

  return (
    <AuthCard>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>다시 만나서 반가워요</AuthTitle>
      <AuthSubtitle>로그인하고 다음 여행을 시작해보세요</AuthSubtitle>

      <FormGroup>
        <FormLabel>이메일</FormLabel>
        <FormInput type="email" placeholder="email@sloway.co.kr" />
      </FormGroup>

      <FormGroup>
        <FormLabel>비밀번호</FormLabel>
        <FormInput type="password" placeholder="비밀번호 입력" />
      </FormGroup>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <CheckboxWrap>
          <input type="checkbox" />
          <span>로그인 상태 유지</span>
        </CheckboxWrap>
        <AuthLink type="button" onClick={() => navigate('/find-account')}>
          비밀번호를 잊으셨나요?
        </AuthLink>
      </div>

      <BtnPrimary type="button" onClick={() => navigate('/')}>
        로그인
      </BtnPrimary>

      <Divider>
        <DividerLine /><DividerText>또는</DividerText><DividerLine />
      </Divider>

      <BtnKakao type="button">
        <KakaoIcon />카카오로 로그인
      </BtnKakao>

      <BtnGoogle type="button">
        <GoogleIcon />Google로 로그인
      </BtnGoogle>

      <AuthFooter>
        아직 Sloway 회원이 아닌가요?{' '}
        <AuthLink as={Link} to="/signup">회원가입</AuthLink>
      </AuthFooter>
    </AuthCard>
  );
}

export default LoginPage;
