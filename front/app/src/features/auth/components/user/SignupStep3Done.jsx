import { BtnPrimary, BtnSecondary } from '../common/AuthStyled';

function SignupStep3Done({ navigate }) {
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#e8efe5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4"
              stroke="#5a7a42"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="9" stroke="#A8B89F" strokeWidth="2" />
          </svg>
        </div>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#2c2a22',
            marginBottom: 8,
          }}
        >
          회원가입이 완료됐어요!
        </h2>
        <p style={{ fontSize: 13, color: '#9a9280', lineHeight: 1.7 }}>
          이제 Sloway의 다양한 공간을
          <br />
          만나보세요.
        </p>
      </div>
      <BtnPrimary type="button" onClick={() => navigate('/login')}>
        로그인하러 가기
      </BtnPrimary>
      <BtnSecondary type="button" onClick={() => navigate('/')}>
        메인으로
      </BtnSecondary>
    </>
  );
}

export default SignupStep3Done;
