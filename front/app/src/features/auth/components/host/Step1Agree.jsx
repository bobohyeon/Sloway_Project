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
  { id: 'service', label: '호스트 서비스 이용약관', required: true },
  { id: 'privacy', label: '개인정보 처리방침 동의', required: true },
  { id: 'business', label: '사업자 정보 제공 및 활용 동의', required: true },
  { id: 'marketing', label: '마케팅 정보 수신 동의', required: false },
];

function Step1Agree({ onNext }) {
  // 각 약관 체크 상태 { service: false, privacy: false, ... }
  const [checked, setChecked] = useState(
    TERMS.reduce((acc, t) => ({ ...acc, [t.id]: false }), {})
  );

  const allChecked = TERMS.every((t) => checked[t.id]);
  const requiredAllChecked = TERMS.filter((t) => t.required).every(
    (t) => checked[t.id]
  );

  // 전체 동의 토글 → 모든 항목을 같은 값으로
  const toggleAll = () => {
    const next = !allChecked;
    setChecked(TERMS.reduce((acc, t) => ({ ...acc, [t.id]: next }), {}));
  };

  // 개별 항목 토글
  const toggleOne = (id) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        이미 호스트이신가요?{' '}
        <AuthLink as={Link} to="/host/login">
          로그인
        </AuthLink>
      </AuthFooter>
    </>
  );
}

export default Step1Agree;
