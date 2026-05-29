import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminCard,
  LogoWrap,
  AuthTitle,
  AuthSubtitle,
  FormGroup,
  FormLabel,
  FormInput,
  BtnPrimary,
  AuthFooter,
  AuthLink,
  AdminBadge,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useAdminLoginForm } from '../../hooks/useAdminLoginForm';

function AdminLoginPage() {
  const navigate = useNavigate();

  // 폼 상태 + 제출 로직은 훅에 전부 위임 (LoginPage와 동일 패턴)
  const {
    email,
    password,
    error,
    loading,
    setEmail,
    setPassword,
    handleSubmit,
  } = useAdminLoginForm();

  return (
    <AdminCard>
      <LogoWrap>
        <SlowyLogo size={32} />
        <div style={{ marginTop: 8 }}>
          <AdminBadge>관리자</AdminBadge>
        </div>
      </LogoWrap>

      <AuthTitle $dark>관리자 로그인</AuthTitle>
      <AuthSubtitle>관리자 계정으로 로그인해주세요</AuthSubtitle>

      <form onSubmit={handleSubmit} noValidate>
        <FormGroup>
          <FormLabel $dark>이메일</FormLabel>
          <FormInput
            type="email"
            placeholder="admin@sloway.co.kr"
            $dark
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel $dark>비밀번호</FormLabel>
          <FormInput
            type="password"
            placeholder="비밀번호 입력"
            $dark
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </FormGroup>

        <ErrorMessage message={error} />

        <BtnPrimary type="submit" disabled={loading} style={{ marginTop: 8 }}>
          {loading ? '로그인 중...' : '로그인'}
        </BtnPrimary>
      </form>

      <AuthFooter $dark style={{ marginTop: 20 }}>
        일반 사용자이신가요?{' '}
        <AuthLink $dark type="button" onClick={() => navigate('/login')}>
          일반 로그인
        </AuthLink>
      </AuthFooter>
    </AdminCard>
  );
}

export default AdminLoginPage;
