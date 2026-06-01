import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BtnPrimary,
  AgreeBox,
  AgreeAllRow,
  AgreeItem,
  AgreeItemLeft,
  Badge,
  ViewBtn,
  CheckboxWrap,
  AuthFooter,
  AuthLink,
} from '../common/AuthStyled';

const TERMS = [
  { id: 'terms', label: '이용약관 동의', required: true },
  { id: 'privacy', label: '개인정보 처리방침 동의', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false },
];

function SignupStep1Agree({ onNext }) {
  const [checked, setChecked] = useState(
    TERMS.reduce((acc, t) => ({ ...acc, [t.id]: false }), {})
  );

  const allChecked = TERMS.every((t) => checked[t.id]);
  const requiredAllChecked = TERMS.filter((t) => t.required).every(
    (t) => checked[t.id]
  );

  const toggleAll = () => {
    const next = !allChecked;
    setChecked(TERMS.reduce((acc, t) => ({ ...acc, [t.id]: next }), {}));
  };
  const toggleOne = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <AgreeBox>
        <AgreeAllRow>
          <CheckboxWrap>
            <input type="checkbox" checked={allChecked} onChange={toggleAll} />
            <span>전체 동의합니다</span>
          </CheckboxWrap>
        </AgreeAllRow>
        {TERMS.map((t) => (
          <AgreeItem key={t.id}>
            <AgreeItemLeft>
              <input
                type="checkbox"
                checked={checked[t.id]}
                onChange={() => toggleOne(t.id)}
                style={{
                  width: 15,
                  height: 15,
                  accentColor: '#A8B89F',
                  cursor: 'pointer',
                }}
              />
              <span style={{ fontSize: 12 }}>
                <Badge $req={t.required}>{t.required ? '필수' : '선택'}</Badge>{' '}
                {t.label}
              </span>
            </AgreeItemLeft>
            <ViewBtn type="button">전문 보기</ViewBtn>
          </AgreeItem>
        ))}
      </AgreeBox>
      <BtnPrimary type="button" onClick={onNext} disabled={!requiredAllChecked}>
        다음 단계
      </BtnPrimary>
      <AuthFooter>
        이미 계정이 있으신가요?{' '}
        <AuthLink as={Link} to="/login">
          로그인
        </AuthLink>
      </AuthFooter>
    </>
  );
}

export default SignupStep1Agree;
