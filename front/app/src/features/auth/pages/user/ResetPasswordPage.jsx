import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthCard, LogoWrap, AuthTitle, AuthSubtitle,
  FormGroup, FormLabel, FormInput,
  BtnPrimary,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <AuthCard>
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#e8efe5',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="#5a7a42" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="#A8B89F" strokeWidth="2"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: '#2c2a22', marginBottom: 8 }}>비밀번호 재설정 완료</h1>
          <p style={{ fontSize: 13, color: '#9a9280', marginBottom: 24, lineHeight: 1.7 }}>
            새로운 비밀번호로 변경됐어요.<br />다시 로그인해주세요.
          </p>
          <BtnPrimary type="button" onClick={() => navigate('/login')}>로그인하러 가기</BtnPrimary>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <LogoWrap><SlowyLogo size={32} /></LogoWrap>
      <AuthTitle>비밀번호 재설정</AuthTitle>
      <AuthSubtitle>새로운 비밀번호를 입력해주세요</AuthSubtitle>

      {/* 비밀번호 요건 안내 */}
      <div style={{
        background: '#e8efe5', borderRadius: 8, padding: '12px 14px', marginBottom: 20,
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
      }}>
        {['8자 이상', '영문 포함', '숫자 포함', '특수문자 포함'].map((label) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#9a9280' }}>
            <span>○</span><span>{label}</span>
          </div>
        ))}
      </div>

      <FormGroup>
        <FormLabel>새 비밀번호 <span style={{ color: '#e24b4a' }}>*</span></FormLabel>
        <FormInput type="password" placeholder="새 비밀번호 입력" autoComplete="new-password" />
      </FormGroup>

      <FormGroup>
        <FormLabel>새 비밀번호 확인 <span style={{ color: '#e24b4a' }}>*</span></FormLabel>
        <FormInput type="password" placeholder="새 비밀번호 재입력" autoComplete="new-password" />
      </FormGroup>

      <BtnPrimary type="button" onClick={() => setDone(true)}>비밀번호 변경</BtnPrimary>
    </AuthCard>
  );
}

export default ResetPasswordPage;
