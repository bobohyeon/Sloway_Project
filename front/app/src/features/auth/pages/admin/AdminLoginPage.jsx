import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminCard, LogoWrap, AuthTitle, AuthSubtitle,
  FormGroup, FormLabel, FormInput,
  BtnPrimary, AuthFooter, AuthLink, AdminBadge,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';

function AdminLoginPage() {
  const navigate = useNavigate();

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

      <FormGroup>
        <FormLabel $dark>이메일</FormLabel>
        <FormInput type="email" placeholder="admin@sloway.co.kr" $dark autoComplete="email" />
      </FormGroup>

      <FormGroup>
        <FormLabel $dark>비밀번호</FormLabel>
        <FormInput type="password" placeholder="비밀번호 입력" $dark autoComplete="current-password" />
      </FormGroup>

      <BtnPrimary type="button" onClick={() => navigate('/admin/dashboard')} style={{ marginTop: 8 }}>
        로그인
      </BtnPrimary>

      <AuthFooter $dark style={{ marginTop: 20 }}>
        일반 사용자이신가요?{' '}
        <AuthLink $dark type="button" onClick={() => navigate('/login')}>일반 로그인</AuthLink>
      </AuthFooter>
    </AdminCard>
  );
}

export default AdminLoginPage;
