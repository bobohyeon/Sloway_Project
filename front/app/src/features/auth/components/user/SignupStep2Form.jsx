import {
  FormGroup,
  FormLabel,
  FormInput,
  InputRow,
  BtnAction,
  BtnPrimary,
  BtnSecondary,
  InfoBox,
} from '../common/AuthStyled';

const sectionTitle = {
  fontSize: 11,
  fontWeight: 600,
  color: '#A8B89F',
  letterSpacing: '0.5px',
  marginBottom: 12,
  marginTop: 4,
  paddingBottom: 6,
  borderBottom: '1px solid #e8efe5',
};

function SignupStep2Form({
  form,
  updateForm,
  emailVerified,
  sending,
  verifying,
  codeSent,
  authMsg,
  handleSendCode,
  handleVerifyCode,
  submitting,
  error,
  onSubmit,
  onPrev,
}) {
  return (
    <>
      <p style={sectionTitle}>기본 정보</p>
      <FormGroup>
        <FormLabel>
          이름 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="text"
          placeholder="홍길동"
          value={form.name}
          onChange={(e) => updateForm('name', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>
          이메일 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <InputRow>
          <FormInput
            type="email"
            placeholder="email@sloway.co.kr"
            value={form.email}
            onChange={(e) => updateForm('email', e.target.value)}
            disabled={emailVerified}
          />
          <BtnAction
            type="button"
            onClick={handleSendCode}
            disabled={sending || emailVerified}
          >
            {sending ? '발송 중' : codeSent ? '재발송' : '인증 발송'}
          </BtnAction>
        </InputRow>
      </FormGroup>
      <FormGroup>
        <FormLabel>
          이메일 인증번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <InputRow>
          <FormInput
            type="text"
            placeholder="인증번호 6자리"
            maxLength={6}
            value={form.emailCode}
            onChange={(e) =>
              updateForm(
                'emailCode',
                e.target.value.replace(/\D/g, '').slice(0, 6)
              )
            }
            disabled={emailVerified}
          />
          <BtnAction
            type="button"
            onClick={handleVerifyCode}
            disabled={verifying || emailVerified || !codeSent}
          >
            {emailVerified ? '완료' : verifying ? '확인 중' : '확인'}
          </BtnAction>
        </InputRow>
        {authMsg && (
          <p
            style={{
              fontSize: 11,
              color: emailVerified ? '#5a7a42' : '#e24b4a',
              marginTop: 4,
            }}
          >
            {authMsg}
          </p>
        )}
      </FormGroup>
      <FormGroup>
        <FormLabel>
          휴대폰 번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <InputRow>
          <div
            style={{
              padding: '11px 12px',
              border: '1px solid #ddd8cc',
              borderRadius: 8,
              fontSize: 13,
              color: '#9a9280',
              background: '#f5f2ec',
              flexShrink: 0,
            }}
          >
            +82
          </div>
          <FormInput
            type="tel"
            placeholder="010-0000-0000"
            maxLength={13}
            value={form.phone}
            onChange={(e) => updateForm('phone', e.target.value)}
          />
        </InputRow>
      </FormGroup>
      <FormGroup>
        <FormLabel>생년월일</FormLabel>
        <FormInput
          type="date"
          max={new Date().toISOString().split('T')[0]}
          value={form.birthDate}
          onChange={(e) => updateForm('birthDate', e.target.value)}
        />
      </FormGroup>

      <p style={{ ...sectionTitle, marginTop: 20 }}>비밀번호 설정</p>
      <FormGroup>
        <FormLabel>
          비밀번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="password"
          placeholder="4자 이상"
          value={form.password}
          onChange={(e) => updateForm('password', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>
          비밀번호 확인 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="password"
          placeholder="비밀번호 재입력"
          value={form.passwordConfirm}
          onChange={(e) => updateForm('passwordConfirm', e.target.value)}
        />
      </FormGroup>

      <InfoBox>
        <strong style={{ display: 'block', marginBottom: 4 }}>
          이메일 인증 안내
        </strong>
        이메일 인증을 완료해야 가입할 수 있어요.
      </InfoBox>

      {error && (
        <p style={{ fontSize: 12, color: '#e24b4a', marginBottom: 8 }}>
          {error}
        </p>
      )}

      <BtnPrimary type="button" onClick={onSubmit} disabled={submitting}>
        {submitting ? '가입 중...' : '가입 완료'}
      </BtnPrimary>
      <BtnSecondary type="button" onClick={onPrev} disabled={submitting}>
        이전
      </BtnSecondary>
    </>
  );
}

export default SignupStep2Form;
