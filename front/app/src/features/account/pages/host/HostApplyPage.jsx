import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─── 약관 ────────────────────────────────────────────────
const TERMS = [
  { id: 'host-service', label: '호스트 서비스 이용약관', required: true },
  { id: 'business', label: '사업자 정보 제공 및 활용 동의', required: true },
  { id: 'settlement', label: '정산·수수료 정책 동의', required: true },
];

const BANKS = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  'NH농협은행',
  'IBK기업은행',
  '카카오뱅크',
  '토스뱅크',
];

// ─── Styled Components ──────────────────────────────────
const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  padding: 28px;
`;

const SectionTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  color: #a8b89f;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e8efe5;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  & + & {
    margin-top: 18px;
  }
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-800);
`;

const Required = styled.span`
  color: #e24b4a;
  margin-left: 2px;
`;

const Input = styled.input`
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: var(--gray-800);
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`;

const Select = styled.select`
  height: 42px;
  padding: 0 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: var(--gray-800);

  &:focus {
    outline: none;
    border-color: var(--sage);
  }
`;

const HelpText = styled.span`
  font-size: 12px;
  color: var(--gray-400);
`;

// 약관 동의
const AgreeAll = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid #f0ede6;
  margin-bottom: 8px;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  cursor: pointer;
  font-size: 13px;
  color: var(--gray-800);
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 15px;
  height: 15px;
  accent-color: #a8b89f;
  cursor: pointer;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
  background: ${(p) =>
    p.$req ? 'rgba(226, 75, 74, 0.1)' : 'rgba(168, 184, 159, 0.18)'};
  color: ${(p) => (p.$req ? '#e24b4a' : '#5b6b53')};
`;

const ViewLink = styled.button`
  font-size: 11px;
  color: var(--gray-400);
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  text-decoration: underline;
  &:hover {
    color: var(--sage);
  }
`;

// 파일 업로드
const FileBox = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FileName = styled.div`
  flex: 1;
  height: 42px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 13px;
  color: var(--gray-400);
  background: #fff;
`;

const FileBtn = styled.label`
  height: 42px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  background: var(--sage);
  color: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
`;

// 안내
const InfoBox = styled.div`
  background: rgba(168, 184, 159, 0.12);
  border-radius: 10px;
  padding: 16px 18px;
  font-size: 12px;
  color: #5b6b53;
  line-height: 1.6;
`;

// 버튼
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const PrimaryBtn = styled.button`
  height: 44px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: var(--sage);
  color: #fff;

  &:hover {
    opacity: 0.9;
  }
`;

const GhostBtn = styled.button`
  height: 44px;
  padding: 0 28px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);

  &:hover {
    border-color: var(--gray-400);
  }
`;

// 완료 화면
const CompleteWrap = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const CompleteIcon = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #e8efe5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`;

const CompleteTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
`;

const CompleteDesc = styled.p`
  font-size: 13px;
  color: var(--gray-400);
  line-height: 1.7;
`;

const CompleteBtnRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
function HostApplyPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  // 신청 완료 화면
  if (submitted) {
    return (
      <PageLayout title="호스트 신청">
        <Card>
          <CompleteWrap>
            <CompleteIcon>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 12l2 2 4-4"
                  stroke="#5a7a42"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#A8B89F"
                  strokeWidth="2"
                />
              </svg>
            </CompleteIcon>
            <CompleteTitle>호스트 신청이 접수됐어요!</CompleteTitle>
            <CompleteDesc>
              영업일 기준 1~3일 내 검토 후<br />
              이메일로 결과를 안내드려요.
            </CompleteDesc>
            <CompleteBtnRow>
              <GhostBtn onClick={() => navigate('/host/profile')}>
                마이페이지로
              </GhostBtn>
              <PrimaryBtn onClick={() => navigate('/user/host/status')}>
                신청 현황 보기
              </PrimaryBtn>
            </CompleteBtnRow>
          </CompleteWrap>
        </Card>
      </PageLayout>
    );
  }

  // 신청 입력 화면
  return (
    <PageLayout
      title="호스트 신청"
      description="Sloway 호스트가 되어 나만의 공간을 등록하고 수익을 만들어보세요."
    >
      <CardStack>
        {/* 약관 동의 */}
        <Card>
          <SectionTitle>약관 동의</SectionTitle>

          <AgreeAll>
            <CheckboxRow>
              <Checkbox />
              <strong>전체 동의합니다</strong>
            </CheckboxRow>
          </AgreeAll>

          {TERMS.map((t) => (
            <CheckboxRow key={t.id}>
              <Checkbox />
              <Badge $req={t.required}>{t.required ? '필수' : '선택'}</Badge>
              <span>{t.label}</span>
              <ViewLink type="button">전문 보기</ViewLink>
            </CheckboxRow>
          ))}
        </Card>

        {/* 사업자 정보 */}
        <Card>
          <SectionTitle>사업자 정보</SectionTitle>

          <FormGroup>
            <Label>
              상호명 <Required>*</Required>
            </Label>
            <Input placeholder="예) 청평 힐링 스테이" />
          </FormGroup>

          <FormGroup>
            <Label>
              대표자명 <Required>*</Required>
            </Label>
            <Input placeholder="홍길동" />
          </FormGroup>

          <FormGroup>
            <Label>
              사업자등록번호 <Required>*</Required>
            </Label>
            <Input placeholder="000-00-00000" maxLength={12} />
          </FormGroup>

          <FormGroup>
            <Label>
              사업자등록증 <Required>*</Required>
            </Label>
            <FileBox>
              <FileName>파일을 선택해주세요 (PDF, JPG, PNG)</FileName>
              <FileBtn>
                파일 선택
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
              </FileBtn>
            </FileBox>
            <HelpText>승인 검토에 사용되며 외부에 공개되지 않아요.</HelpText>
          </FormGroup>
        </Card>

        {/* 정산 계좌 */}
        <Card>
          <SectionTitle>정산 계좌</SectionTitle>

          <FormGroup>
            <Label>
              은행 <Required>*</Required>
            </Label>
            <Select defaultValue="">
              <option value="" disabled>
                은행 선택
              </option>
              {BANKS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              계좌번호 <Required>*</Required>
            </Label>
            <Input placeholder="'-' 없이 숫자만 입력" inputMode="numeric" />
          </FormGroup>

          <FormGroup>
            <Label>
              예금주 <Required>*</Required>
            </Label>
            <Input placeholder="대표자명과 일치해야 해요" />
          </FormGroup>
        </Card>

        {/* 안내 */}
        <InfoBox>
          <strong style={{ display: 'block', marginBottom: 4 }}>
            호스트 승인 안내
          </strong>
          신청 후 영업일 기준 1~3일 내 검토 후 승인 결과를 이메일로 안내드려요.
          승인 전까지 호스트 기능 사용이 제한되며, 반려된 경우 사유를 확인하고
          다시 신청할 수 있어요.
        </InfoBox>

        <ButtonRow>
          <GhostBtn onClick={() => navigate('/user/mypage')}>취소</GhostBtn>
          <PrimaryBtn onClick={() => setSubmitted(true)}>
            호스트 신청
          </PrimaryBtn>
        </ButtonRow>
      </CardStack>
    </PageLayout>
  );
}

export default HostApplyPage;
