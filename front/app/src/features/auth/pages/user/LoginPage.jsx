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
  BtnKakao,
  BtnGoogle,
  Divider,
  DividerLine,
  DividerText,
  CheckboxWrap,
  AuthFooter,
  AuthLink,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';
import { KakaoIcon, GoogleIcon } from '../../components/common/SocialIcons';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useLoginForm } from '../../hooks/useLoginForm';
import { startKakaoLogin } from '../../api/authApi';
/**
 * 일반회원 로그인 페이지.
 *
 * <p>레이아웃과 폼 조립만 담당. 폼 상태/제출 로직은 useLoginForm 훅에 격리.
 */
function LoginPage() {
  const navigate = useNavigate();

  // 폼 상태 + 제출 로직은 훅에 전부 위임
  const {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLoginForm();

  return (
    <AuthCard>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>다시 만나서 반가워요</AuthTitle>
      <AuthSubtitle>로그인하고 다음 여행을 시작해보세요</AuthSubtitle>

      <form onSubmit={handleSubmit} noValidate>
        <FormGroup>
          <FormLabel>이메일</FormLabel>
          <FormInput
            type="email"
            placeholder="email@sloway.co.kr"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>비밀번호</FormLabel>
          <FormInput
            type="password"
            placeholder="비밀번호 입력"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </FormGroup>

        <ErrorMessage message={error} />

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

        <BtnPrimary type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </BtnPrimary>
      </form>

      <Divider>
        <DividerLine />
        <DividerText>또는</DividerText>
        <DividerLine />
      </Divider>

      <BtnKakao type="button" onClick={startKakaoLogin} disabled={loading}>
        <KakaoIcon />
        카카오로 로그인
      </BtnKakao>

      <BtnGoogle type="button" disabled={loading}>
        <GoogleIcon />
        Google로 로그인
      </BtnGoogle>

      <AuthFooter>
        아직 Sloway 회원이 아닌가요?{' '}
        <AuthLink as={Link} to="/signup">
          회원가입
        </AuthLink>
        <br />
        호스트로 시작하시려면?{' '}
        <AuthLink as={Link} to="/host/login">
          호스트 로그인
        </AuthLink>
      </AuthFooter>
    </AuthCard>
  );
}

export default LoginPage;
