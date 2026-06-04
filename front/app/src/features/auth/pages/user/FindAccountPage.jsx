import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AuthCard,
  LogoWrap,
  AuthTitle,
  AuthSubtitle,
  FormGroup,
  FormLabel,
  FormInput,
  BtnPrimary,
  BtnSecondary,
  TabWrap,
  TabBtn,
  ResultBox,
  AuthFooter,
  AuthLink,
} from '../../components/common/AuthStyled';
import SlowyLogo from '../../components/common/SlowyLogo';
import { findEmail } from '../../api/authApi';

const TAB = { ID: 'id', PW: 'pw' };

const guideText = {
  fontSize: 12,
  color: '#9a9280',
  marginBottom: 16,
  lineHeight: 1.7,
};

function FindAccountPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(TAB.ID);

  // 아이디 찾기
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFindId = async () => {
    setError('');
    if (!name.trim() || !phone.trim()) {
      setError('이름과 휴대폰 번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await findEmail(name, phone);
      setMaskedEmail(res.maskedEmail);
    } catch (err) {
      setError(err.response?.data?.message ?? '일치하는 계정 정보가 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const resetIdForm = () => {
    setMaskedEmail('');
    setName('');
    setPhone('');
    setError('');
  };

  return (
    <AuthCard>
      <LogoWrap>
        <SlowyLogo size={32} />
      </LogoWrap>
      <AuthTitle>계정 찾기</AuthTitle>
      <AuthSubtitle>아이디 또는 비밀번호를 찾을 수 있어요</AuthSubtitle>

      <TabWrap>
        <TabBtn
          $active={tab === TAB.ID}
          onClick={() => {
            setTab(TAB.ID);
            resetIdForm();
          }}
        >
          아이디 찾기
        </TabBtn>
        <TabBtn $active={tab === TAB.PW} onClick={() => setTab(TAB.PW)}>
          비밀번호 찾기
        </TabBtn>
      </TabWrap>

      {/* 아이디 찾기 */}
      {tab === TAB.ID &&
        (!maskedEmail ? (
          <>
            <p style={guideText}>
              가입 시 등록한 이름과 전화번호를 입력하면
              <br />
              가입된 이메일을 안내해 드릴게요.
            </p>
            <FormGroup>
              <FormLabel>이름</FormLabel>
              <FormInput
                type="text"
                placeholder="홍길동"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </FormGroup>
            <FormGroup>
              <FormLabel>휴대폰 번호</FormLabel>
              <FormInput
                type="tel"
                placeholder="010-0000-0000"
                maxLength={13}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </FormGroup>
            {error && (
              <p style={{ fontSize: 12, color: '#e24b4a', marginBottom: 12 }}>
                {error}
              </p>
            )}
            <BtnPrimary type="button" onClick={handleFindId} disabled={loading}>
              {loading ? '찾는 중...' : '아이디 찾기'}
            </BtnPrimary>
          </>
        ) : (
          <>
            <p style={{ ...guideText, marginBottom: 12 }}>
              가입된 이메일을 찾았어요.
            </p>
            <ResultBox>{maskedEmail}</ResultBox>
            <BtnPrimary type="button" onClick={() => navigate('/login')}>
              로그인하러 가기
            </BtnPrimary>
            <BtnSecondary type="button" onClick={resetIdForm}>
              다시 찾기
            </BtnSecondary>
          </>
        ))}

      {/* 비밀번호 찾기 — 재설정 페이지로 안내 */}
      {tab === TAB.PW && (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <p style={{ ...guideText, marginBottom: 20 }}>
            이메일 인증 후 새 비밀번호로 재설정할 수 있어요.
            <br />
            아래 버튼을 눌러 재설정을 진행해주세요.
          </p>
          <BtnPrimary type="button" onClick={() => navigate('/reset-password')}>
            비밀번호 재설정하러 가기
          </BtnPrimary>
        </div>
      )}

      <AuthFooter style={{ marginTop: 20 }}>
        <AuthLink type="button" onClick={() => navigate('/login')}>
          로그인으로 돌아가기
        </AuthLink>
        {' · '}
        <AuthLink type="button" onClick={() => navigate('/signup')}>
          회원가입
        </AuthLink>
      </AuthFooter>
    </AuthCard>
  );
}

export default FindAccountPage;
