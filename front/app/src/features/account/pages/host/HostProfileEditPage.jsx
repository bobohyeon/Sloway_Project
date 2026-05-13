import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─── 더미 초기 데이터 (백엔드 연동 후 GET API로 교체) ───────
const DUMMY_INITIAL = {
  imgUrl: null,
  businessName: '청평 힐링 스테이',
  representative: '김우영',
  businessNumber: '123-45-67890',
  introduction:
    '청평에서 자연과 함께하는 휴식 공간을 운영하고 있습니다. 도시의 소음에서 벗어나 진짜 쉼을 찾는 분들을 위한 공간이에요.',
  contactName: '김우영',
  email: 'wykim@sloway.co.kr',
  phone: '010-1234-5678',
  bank: 'KB국민은행',
  accountNumber: '123-456-789012',
  accountHolder: '김우영',
};

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

const INTRO_MAX = 500;

// ─── Styled Components ─────────────────────────────────────
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Card = styled.section`
  background: #fff;
  border: 1px solid #e8e4dc;
  border-radius: 16px;
  padding: 24px 28px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 16px;
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
  &:disabled {
    background: #f5f3ef;
    color: var(--gray-400);
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: var(--gray-800);
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
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

const InputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const BtnAction = styled.button`
  height: 42px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    border-color: var(--sage);
    color: var(--sage);
  }
`;

// 사업자 정보 잠금 안내
const LockNotice = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  background: #f5f3ef;
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 12px;
  color: var(--gray-400);
  line-height: 1.6;
  margin-bottom: 16px;

  svg {
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

// 프로필 이미지
const ImageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ImagePreview = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--sage);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: bold;
  flex-shrink: 0;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ImageActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ImageBtn = styled.label`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--gray-200);
  background: #fff;
  color: var(--gray-800);
  transition: all 0.15s;

  &:hover {
    border-color: var(--sage);
    color: var(--sage);
  }
`;

const RemoveBtn = styled.button`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #e8d4d2;
  background: #fff;
  color: #a04c42;
  transition: all 0.15s;

  &:hover {
    background: #fdf5f4;
  }
`;

// 글자 수 카운터
const TextareaFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
`;

const CharCount = styled.span`
  font-size: 12px;
  color: var(--gray-400);
`;

// 버튼
const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
`;

const PrimaryBtn = styled.button`
  height: 42px;
  padding: 0 22px;
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
  height: 42px;
  padding: 0 22px;
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

// ─── 컴포넌트 ──────────────────────────────────────────────
function HostProfileEditPage() {
  const navigate = useNavigate();
  const initial = DUMMY_INITIAL;

  return (
    <PageLayout title="호스트 정보 수정">
      <Form noValidate>
        {/* 프로필 이미지 */}
        <Card>
          <SectionTitle>프로필 이미지</SectionTitle>
          <ImageRow>
            <ImagePreview>
              {initial.imgUrl ? (
                <img src={initial.imgUrl} alt="프로필" />
              ) : (
                initial.businessName[0]
              )}
            </ImagePreview>
            <ImageActions>
              <ImageBtn>
                이미지 변경
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </ImageBtn>
              <RemoveBtn type="button">삭제</RemoveBtn>
            </ImageActions>
          </ImageRow>
        </Card>

        {/* 사업자 정보 */}
        <Card>
          <SectionTitle>사업자 정보</SectionTitle>
          <LockNotice>
            <FaLock size={11} />
            <span>
              대표자명, 사업자등록번호, 사업자등록증은 사업자 신원과 직결된
              정보예요. 변경하려면 호스트 재인증이 필요해요.
            </span>
          </LockNotice>

          <FormGroup>
            <Label htmlFor="businessName">상호명</Label>
            <Input
              id="businessName"
              defaultValue={initial.businessName}
              placeholder="상호명을 입력해주세요"
            />
            <HelpText>고객에게 노출되는 공간 운영 이름입니다.</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="representative">대표자명</Label>
            <Input
              id="representative"
              defaultValue={initial.representative}
              disabled
            />
            <HelpText>변경할 수 없습니다.</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="businessNumber">사업자등록번호</Label>
            <Input
              id="businessNumber"
              defaultValue={initial.businessNumber}
              disabled
            />
            <HelpText>변경할 수 없습니다.</HelpText>
          </FormGroup>
        </Card>

        {/* 호스트 소개 */}
        <Card>
          <SectionTitle>호스트 소개</SectionTitle>
          <FormGroup>
            <Label htmlFor="introduction">소개글</Label>
            <Textarea
              id="introduction"
              defaultValue={initial.introduction}
              maxLength={INTRO_MAX}
              placeholder="공간과 호스트를 게스트에게 소개해주세요"
            />
            <TextareaFooter>
              <HelpText>게스트에게 노출되는 정보입니다.</HelpText>
              <CharCount>0 / {INTRO_MAX}</CharCount>
            </TextareaFooter>
          </FormGroup>
        </Card>

        {/* 담당자 연락처 */}
        <Card>
          <SectionTitle>담당자 연락처</SectionTitle>

          <FormGroup>
            <Label htmlFor="contactName">담당자명</Label>
            <Input
              id="contactName"
              defaultValue={initial.contactName}
              placeholder="실제 응대하는 담당자 이름"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">이메일</Label>
            <InputRow>
              <Input
                id="email"
                type="email"
                defaultValue={initial.email}
                style={{ flex: 1 }}
              />
              <BtnAction type="button">인증 발송</BtnAction>
            </InputRow>
            <HelpText>
              이메일 변경 시 재인증이 필요해요. 인증 링크 유효시간은 30분이에요.
            </HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">휴대폰</Label>
            <Input
              id="phone"
              defaultValue={initial.phone}
              placeholder="010-0000-0000"
              inputMode="numeric"
            />
            <HelpText>예약 알림이 전달되는 번호예요.</HelpText>
          </FormGroup>
        </Card>

        {/* 정산 계좌 */}
        <Card>
          <SectionTitle>정산 계좌</SectionTitle>

          <FormGroup>
            <Label htmlFor="bank">은행</Label>
            <Select id="bank" defaultValue={initial.bank}>
              {BANKS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="accountNumber">계좌번호</Label>
            <Input
              id="accountNumber"
              defaultValue={initial.accountNumber}
              placeholder="'-' 없이 숫자만 입력"
              inputMode="numeric"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="accountHolder">예금주</Label>
            <Input id="accountHolder" defaultValue={initial.accountHolder} />
            <HelpText>
              대표자명({initial.representative})과 일치해야 해요.
            </HelpText>
          </FormGroup>
        </Card>

        {/* 버튼 */}
        <ButtonRow>
          <GhostBtn type="button" onClick={() => navigate('/host/profile')}>
            취소
          </GhostBtn>
          <PrimaryBtn type="button" onClick={() => navigate('/host/profile')}>
            저장
          </PrimaryBtn>
        </ButtonRow>
      </Form>
    </PageLayout>
  );
}

export default HostProfileEditPage;
