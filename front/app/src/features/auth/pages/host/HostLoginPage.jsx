import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AuthCard,
  LogoWrap,
  AuthTitle,
  AuthSubtitle,
  FormGroup,
  FormLabel,
  FormInput,
  BtnPrimary,
  CheckboxWrap,
  AuthFooter,
  AuthLink,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';

function HostLoginPage() {
  const navigate = useNavigate();

  // TODO: 실제 로그인 처리 (백엔드 연동 시)
  // - POST /api/auth/login (role=HOST 강제)
  // - 응답의 role이 HOST가 아니면 거부
  // - 성공 시 /host/dashboard 이동
  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/host/dashboard');
  };

  return (
    <AuthCard>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>호스트 로그인</AuthTitle>
      <AuthSubtitle>Sloway 호스트 센터에 오신 것을 환영합니다</AuthSubtitle>

      <form onSubmit={handleLogin} noValidate>
        <FormGroup>
          <FormLabel>이메일</FormLabel>
          <FormInput
            type="email"
            placeholder="host@sloway.co.kr"
            autoComplete="email"
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>비밀번호</FormLabel>
          <FormInput
            type="password"
            placeholder="비밀번호 입력"
            autoComplete="current-password"
          />
        </FormGroup>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <CheckboxWrap>
            <input type="checkbox" />
            <span>로그인 상태 유지</span>
          </CheckboxWrap>
          <AuthLink type="button" onClick={() => navigate('/find-account')}>
            비밀번호를 잊으셨나요?
          </AuthLink>
        </div>

        <BtnPrimary type="submit">호스트 로그인</BtnPrimary>
      </form>

      <AuthFooter>
        아직 호스트가 아니신가요?{' '}
        <AuthLink as={Link} to="/host/signup">
          호스트 가입
        </AuthLink>
        <br />
        일반회원이신가요?{' '}
        <AuthLink as={Link} to="/login">
          일반회원 로그인
        </AuthLink>
      </AuthFooter>
    </AuthCard>
  );
}

export default HostLoginPage;
