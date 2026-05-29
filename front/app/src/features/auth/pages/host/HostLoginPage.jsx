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
import ErrorMessage from '../../components/common/ErrorMessage';
import { useHostLoginForm } from '../../hooks/useHostLoginForm';

/**
 * 호스트 로그인 페이지.
 *
 * <p>레이아웃과 폼 조립만 담당. 폼 상태/제출 로직은 useHostLoginForm 훅에 격리.
 */
function HostLoginPage() {
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
  } = useHostLoginForm();

  return (
    <AuthCard>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>호스트 로그인</AuthTitle>
      <AuthSubtitle>Sloway 호스트 센터에 오신 것을 환영합니다</AuthSubtitle>

      <form onSubmit={handleSubmit} noValidate>
        <FormGroup>
          <FormLabel>이메일</FormLabel>
          <FormInput
            type="email"
            placeholder="host@sloway.co.kr"
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
          {loading ? '로그인 중...' : '호스트 로그인'}
        </BtnPrimary>
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
