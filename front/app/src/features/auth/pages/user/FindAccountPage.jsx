import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthCard, LogoWrap, AuthTitle, AuthSubtitle,
  FormGroup, FormLabel, FormInput, InputRow, BtnAction,
  BtnPrimary, BtnSecondary,
  TabWrap, TabBtn, ResultBox,
  AuthFooter, AuthLink,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';

const TAB = { ID: 'id', PW: 'pw' };

const guideText = {
  fontSize: 12, color: '#9a9280', marginBottom: 16, lineHeight: 1.7,
};

function FindAccountPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(TAB.ID);
  const [idFound, setIdFound] = useState(false);
  const [pwCodeSent, setPwCodeSent] = useState(false);
  const [pwVerified, setPwVerified] = useState(false);

  return (
    <AuthCard>
      <LogoWrap><SlowyLogo size={32} /></LogoWrap>
      <AuthTitle>계정 찾기</AuthTitle>
      <AuthSubtitle>아이디 또는 비밀번호를 찾을 수 있어요</AuthSubtitle>

      <TabWrap>
        <TabBtn $active={tab === TAB.ID} onClick={() => { setTab(TAB.ID); setIdFound(false); }}>아이디 찾기</TabBtn>
        <TabBtn $active={tab === TAB.PW} onClick={() => { setTab(TAB.PW); setPwCodeSent(false); setPwVerified(false); }}>비밀번호 찾기</TabBtn>
      </TabWrap>

      {/* 아이디 찾기 */}
      {tab === TAB.ID && (
        !idFound ? (
          <>
            <p style={guideText}>가입 시 등록한 이름과 전화번호를 입력하면<br />가입된 이메일을 안내해 드릴게요.</p>
            <FormGroup>
              <FormLabel>이름</FormLabel>
              <FormInput type="text" placeholder="홍길동" />
            </FormGroup>
            <FormGroup>
              <FormLabel>휴대폰 번호</FormLabel>
              <FormInput type="tel" placeholder="010-0000-0000" maxLength={13} />
            </FormGroup>
            <BtnPrimary type="button" onClick={() => setIdFound(true)}>아이디 찾기</BtnPrimary>
          </>
        ) : (
          <>
            <p style={{ ...guideText, marginBottom: 12 }}>가입된 이메일을 찾았어요.</p>
            <ResultBox>hong***@sloway.co.kr</ResultBox>
            <BtnPrimary type="button" onClick={() => navigate('/login')}>로그인하러 가기</BtnPrimary>
            <BtnSecondary type="button" onClick={() => setIdFound(false)}>다시 찾기</BtnSecondary>
          </>
        )
      )}

      {/* 비밀번호 찾기 */}
      {tab === TAB.PW && (
        !pwVerified ? (
          <>
            <p style={guideText}>가입한 이메일을 입력하면 인증번호를 발송해드려요.<br />인증 후 30분간 재설정이 가능합니다.</p>
            <FormGroup>
              <FormLabel>이메일</FormLabel>
              <InputRow>
                <FormInput type="email" placeholder="email@sloway.co.kr" disabled={pwCodeSent} />
                <BtnAction type="button" onClick={() => setPwCodeSent(true)} disabled={pwCodeSent}>
                  {pwCodeSent ? '발송됨' : '인증번호 받기'}
                </BtnAction>
              </InputRow>
            </FormGroup>
            {pwCodeSent && (
              <FormGroup>
                <FormLabel>인증번호</FormLabel>
                <InputRow>
                  <FormInput type="text" placeholder="인증번호 입력" maxLength={6} />
                  <BtnAction type="button" onClick={() => setPwVerified(true)}>확인</BtnAction>
                </InputRow>
              </FormGroup>
            )}
            {!pwCodeSent && (
              <BtnPrimary type="button" onClick={() => setPwCodeSent(true)}>인증번호 받기</BtnPrimary>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ ...guideText, marginBottom: 20 }}>인증이 완료됐어요.<br />새로운 비밀번호로 재설정해주세요.</p>
            <BtnPrimary type="button" onClick={() => navigate('/reset-password')}>비밀번호 재설정</BtnPrimary>
          </div>
        )
      )}

      <AuthFooter style={{ marginTop: 20 }}>
        <AuthLink type="button" onClick={() => navigate('/login')}>로그인으로 돌아가기</AuthLink>
        {' · '}
        <AuthLink type="button" onClick={() => navigate('/signup')}>회원가입</AuthLink>
      </AuthFooter>
    </AuthCard>
  );
}

export default FindAccountPage;
