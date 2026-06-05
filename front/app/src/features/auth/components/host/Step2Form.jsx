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

function Step2Form({
  form,
  updateForm,
  businessDoc,
  setBusinessDoc,
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
        <FormLabel>
          비밀번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="password"
          placeholder="영문·숫자·특수문자 8자 이상"
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
      <p style={{ ...sectionTitle, marginTop: 20 }}>사업자 정보</p>
      <FormGroup>
        <FormLabel>
          상호명 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="text"
          placeholder="예) 청평 힐링 스테이"
          value={form.businessName}
          onChange={(e) => updateForm('businessName', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>
          사업자등록번호 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <FormInput
          type="text"
          placeholder="000-00-00000"
          maxLength={12}
          value={form.businessNo}
          onChange={(e) => updateForm('businessNo', e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <FormLabel>
          사업자등록증 <span style={{ color: '#e24b4a' }}>*</span>
        </FormLabel>
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              flex: 1,
              padding: '11px 14px',
              border: '1px solid #ddd8cc',
              borderRadius: 8,
              fontSize: 13,
              color: businessDoc ? '#2c2a22' : '#c4bdb0',
              background: '#fff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {businessDoc
              ? businessDoc.name
              : '파일을 선택해주세요 (PDF, JPG, PNG)'}
          </div>
          <label
            style={{
              padding: '10px 14px',
              background: '#A8B89F',
              color: '#fff',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            파일 선택
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={(e) => setBusinessDoc(e.target.files[0] ?? null)}
            />
          </label>
        </div>
        <p style={{ fontSize: 11, color: '#9a9280', marginTop: 4 }}>
          승인 검토에 사용되며 외부에 공개되지 않아요.
        </p>
      </FormGroup>
      <InfoBox>
        <strong style={{ display: 'block', marginBottom: 4 }}>
          호스트 승인 안내
        </strong>
        신청 후 영업일 기준 1~3일 내 검토 후 승인 결과를 이메일로 안내드려요.
      </InfoBox>

      {error && (
        <p style={{ fontSize: 12, color: '#e24b4a', marginBottom: 8 }}>
          {error}
        </p>
      )}

      <BtnPrimary type="button" onClick={onSubmit} disabled={submitting}>
        {submitting ? '신청 중...' : '호스트 신청'}
      </BtnPrimary>
      <BtnSecondary type="button" onClick={onPrev} disabled={submitting}>
        이전
      </BtnSecondary>
    </>
  );
}

export default Step2Form;
