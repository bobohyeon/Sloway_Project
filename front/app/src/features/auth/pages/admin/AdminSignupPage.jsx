import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AdminCard, LogoWrap, AuthTitle, AuthSubtitle,
  FormGroup, FormLabel, FormInput,
  BtnPrimary, AuthFooter, AuthLink, AdminBadge,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';

function AdminSignupPage() {
  const navigate = useNavigate();

  return (
    <AdminCard $wide>
      <LogoWrap>
        <SlowyLogo size={32} />
        <div style={{ marginTop: 8 }}>
          <AdminBadge>관리자</AdminBadge>
        </div>
      </LogoWrap>

      <AuthTitle $dark>관리자 계정 등록</AuthTitle>
      <AuthSubtitle>관리자 초대코드가 필요합니다</AuthSubtitle>

      {/* 초대코드 */}
      <FormGroup>
        <FormLabel $dark>관리자 초대코드 <span style={{ color: '#e24b4a' }}>*</span></FormLabel>
        <FormInput type="text" placeholder="초대코드 입력" $dark />
        <p style={{ fontSize: 11, color: '#6b6456', marginTop: 4 }}>
          관리자로부터 발급받은 초대코드를 입력해주세요.
        </p>
      </FormGroup>

      <div style={{ height: 1, background: '#3a3830', margin: '16px 0' }} />

      <FormGroup>
        <FormLabel $dark>이메일 <span style={{ color: '#e24b4a' }}>*</span></FormLabel>
        <FormInput type="email" placeholder="admin@sloway.co.kr" $dark autoComplete="email" />
      </FormGroup>

      <FormGroup>
        <FormLabel $dark>관리자 이름 <span style={{ color: '#e24b4a' }}>*</span></FormLabel>
        <FormInput type="text" placeholder="홍길동" $dark />
      </FormGroup>

      <FormGroup>
        <FormLabel $dark>휴대폰 번호 <span style={{ color: '#e24b4a' }}>*</span></FormLabel>
        <FormInput type="tel" placeholder="010-0000-0000" $dark maxLength={13} />
      </FormGroup>

      <FormGroup>
        <FormLabel $dark>비밀번호 <span style={{ color: '#e24b4a' }}>*</span></FormLabel>
        <FormInput type="password" placeholder="비밀번호 입력" $dark autoComplete="new-password" />
      </FormGroup>

      <FormGroup>
        <FormLabel $dark>비밀번호 확인 <span style={{ color: '#e24b4a' }}>*</span></FormLabel>
        <FormInput type="password" placeholder="비밀번호 재입력" $dark autoComplete="new-password" />
      </FormGroup>

      <BtnPrimary type="button" onClick={() => navigate('/admin/login')} style={{ marginTop: 4 }}>
        관리자 계정 등록
      </BtnPrimary>

      <AuthFooter $dark style={{ marginTop: 16 }}>
        이미 계정이 있으신가요?{' '}
        <AuthLink $dark type="button" onClick={() => navigate('/admin/login')}>관리자 로그인</AuthLink>
      </AuthFooter>
    </AdminCard>
  );
}

export default AdminSignupPage;
