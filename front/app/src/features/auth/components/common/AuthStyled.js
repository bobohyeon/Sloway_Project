import styled from 'styled-components';

// ─── 색상 ───
export const colors = {
  primary: '#A8B89F',
  primaryDark: '#8a9a82',
  primaryHover: '#96a88d',
  primaryLight: '#e8efe5',
  bg: '#F4EFE6',
  bgCard: '#faf8f3',
  textMain: '#2c2a22',
  textSub: '#9a9280',
  textHint: '#c4bdb0',
  border: '#ddd8cc',
  error: '#e24b4a',
  success: '#5a7a42',
};

// ─── 레이아웃 ───
export const AuthCard = styled.div`
  background: ${colors.bgCard};
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: ${(p) => (p.$wide ? '480px' : '400px')};
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.07);

  @media (max-width: 480px) {
    padding: 28px 20px;
  }
`;

export const AdminCard = styled(AuthCard)`
  background: #2a2922;
  border: 1px solid #3a3830;
`;

// ─── 헤더 ───
export const LogoWrap = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export const AuthTitle = styled.h1`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${(p) => (p.$dark ? '#f0ede4' : colors.textMain)};
  margin-bottom: 4px;
`;

export const AuthSubtitle = styled.p`
  text-align: center;
  font-size: 12px;
  color: ${colors.textSub};
  margin-bottom: 28px;
`;

// ─── 폼 ───
export const FormGroup = styled.div`
  margin-bottom: 14px;
`;

export const FormLabel = styled.label`
  display: block;
  font-size: 12px;
  color: ${(p) => (p.$dark ? '#c4bdb0' : '#6b6456')};
  margin-bottom: 6px;
  font-weight: 500;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 11px 14px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${(p) => (p.$dark ? '#f0ede4' : colors.textMain)};
  background: ${(p) => (p.$dark ? '#1e1d18' : '#fff')};
  outline: none;
  transition: border-color 0.2s;
  font-family: 'Noto Sans KR', sans-serif;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.primary};
  }

  &::placeholder {
    color: ${(p) => (p.$dark ? '#4a4840' : colors.textHint)};
  }
`;

export const InputRow = styled.div`
  display: flex;
  gap: 8px;

  ${FormInput} {
    flex: 1;
    min-width: 0;
  }
`;

// ─── 버튼 ───
export const BtnPrimary = styled.button`
  width: 100%;
  padding: 12px;
  background: ${colors.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  transition: background 0.2s;

  &:hover {
    background: ${colors.primaryHover};
  }
`;

export const BtnSecondary = styled.button`
  width: 100%;
  padding: 11px;
  background: #fff;
  color: #5a5448;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  transition: background 0.2s;
  margin-top: 8px;

  &:hover {
    background: #f5f2ec;
  }
`;

export const BtnAction = styled.button`
  padding: 10px 14px;
  background: ${colors.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  font-family: 'Noto Sans KR', sans-serif;
  flex-shrink: 0;

  &:hover {
    background: ${colors.primaryHover};
  }
`;

export const BtnKakao = styled.button`
  width: 100%;
  padding: 11px;
  background: #fee500;
  color: #3c1e1e;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Noto Sans KR', sans-serif;
  margin-bottom: 8px;

  &:hover {
    background: #f0d800;
  }
`;

export const BtnGoogle = styled.button`
  width: 100%;
  padding: 11px;
  background: #fff;
  color: #3c3c3c;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    background: #f5f5f5;
  }
`;

// ─── 구분선 ───
export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 16px 0;
`;
export const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${colors.border};
`;
export const DividerText = styled.span`
  font-size: 11px;
  color: ${colors.textHint};
`;

// ─── 체크박스 ───
export const CheckboxWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;

  input[type='checkbox'] {
    width: 15px;
    height: 15px;
    accent-color: ${colors.primary};
    cursor: pointer;
    flex-shrink: 0;
  }

  span {
    font-size: 12px;
    color: ${colors.textMain};
  }
`;

// ─── 약관 ───
export const AgreeBox = styled.div`
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 14px;
  background: #fff;
  margin-bottom: 14px;
`;

export const AgreeAllRow = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid #eee8de;
  margin-bottom: 10px;

  ${CheckboxWrap} span {
    font-size: 13px;
    font-weight: 600;
  }
`;

export const AgreeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
`;

export const AgreeItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

export const Badge = styled.span`
  font-size: 10px;
  border-radius: 4px;
  padding: 2px 6px;
  background: ${(p) => (p.$req ? colors.primaryLight : '#f0ede4')};
  color: ${(p) => (p.$req ? '#4a6040' : colors.textSub)};
`;

export const ViewBtn = styled.button`
  font-size: 11px;
  color: ${colors.textSub};
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  padding: 0;
`;

// ─── 스텝 인디케이터 ───
export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 28px;
`;

export const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  flex: 1;
`;

export const StepCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  border: 2px solid ${(p) => (p.$done || p.$active ? colors.primary : colors.border)};
  background: ${(p) => (p.$done ? colors.primaryDark : p.$active ? colors.primary : '#fff')};
  color: ${(p) => (p.$done || p.$active ? '#fff' : colors.textHint)};
  transition: all 0.25s;
`;

export const StepLabel = styled.div`
  font-size: 10px;
  color: ${(p) => (p.$active ? colors.primaryDark : colors.textHint)};
  font-weight: ${(p) => (p.$active ? 500 : 400)};
  white-space: nowrap;
`;

export const StepLine = styled.div`
  flex: 1;
  height: 1px;
  background: ${(p) => (p.$done ? colors.primary : colors.border)};
  margin-bottom: 16px;
  transition: background 0.25s;
`;

// ─── 탭 ───
export const TabWrap = styled.div`
  display: flex;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
`;

export const TabBtn = styled.button`
  flex: 1;
  padding: 10px;
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 500 : 400)};
  background: ${(p) => (p.$active ? colors.primary : '#fff')};
  color: ${(p) => (p.$active ? '#fff' : colors.textSub)};
  border: none;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  transition: all 0.2s;
`;

// ─── 결과 박스 ───
export const ResultBox = styled.div`
  background: ${colors.primaryLight};
  border-radius: 8px;
  padding: 14px;
  font-size: 15px;
  font-weight: 500;
  color: #3a5a30;
  text-align: center;
  margin-bottom: 20px;
`;

// ─── 하단 링크 ───
export const AuthFooter = styled.div`
  text-align: center;
  font-size: 12px;
  color: ${(p) => (p.$dark ? '#6b6456' : colors.textSub)};
  margin-top: 16px;
`;

export const AuthLink = styled.button`
  color: ${(p) => (p.$dark ? colors.primary : colors.primaryDark)};
  font-weight: 500;
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
  font-size: 12px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

// ─── 관리자 뱃지 ───
export const AdminBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #3a3830;
  color: #c4bdb0;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid #4a4840;
`;

// ─── 인포 박스 ───
export const InfoBox = styled.div`
  background: ${colors.primaryLight};
  border-radius: 8px;
  padding: 14px;
  font-size: 12px;
  color: #4a6040;
  line-height: 1.7;
  margin-bottom: 14px;
`;
