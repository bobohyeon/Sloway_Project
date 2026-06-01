import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaLock } from 'react-icons/fa';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import EmailVerifyField from '../../components/user/EmailVerifyField';
import { useHostMyPage } from '../../hooks/useHostMyPage';
import { updateHostMyPage, changeHostEmail } from '../../api/hostApi';
import { logout } from '../../../auth/store/authSlice';

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
  const dispatch = useDispatch();
  const { data: initial, loading } = useHostMyPage();

  // 수정 가능 필드 (백엔드가 받는 것만): 상호명·이름·휴대폰
  const [form, setForm] = useState({ businessName: '', name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  // 이메일 변경 (별도)
  const [newEmail, setNewEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        businessName: initial.businessName ?? '',
        name: initial.name ?? '',
        phone: initial.phone ?? '',
      });
      setNewEmail(initial.email ?? '');
    }
  }, [initial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── 기본 정보 저장 (상호명·이름·휴대폰) ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await updateHostMyPage({
        businessName: form.businessName.trim(),
        name: form.name.trim(),
        phone: form.phone,
      });
      alert('저장되었습니다.');
      navigate('/host/profile');
    } catch (err) {
      alert(err.response?.data?.message ?? '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  // ── 이메일 변경 → 성공 시 로그아웃 ──
  const handleEmailChange = async () => {
    if (!emailVerified || changingEmail) return;
    setChangingEmail(true);
    try {
      await changeHostEmail(newEmail);
      alert('이메일이 변경되었습니다. 보안을 위해 다시 로그인해주세요.');
      dispatch(logout());
      navigate('/host/login');
    } catch (err) {
      alert(err.response?.data?.message ?? '이메일 변경에 실패했습니다.');
    } finally {
      setChangingEmail(false);
    }
  };

  if (loading || !initial) {
    return (
      <PageLayout title="호스트 정보 수정">
        <div style={{ padding: 40, color: '#888' }}>불러오는 중...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="호스트 정보 수정">
      <Form onSubmit={handleSubmit} noValidate>
        {/* 사업자 정보 */}
        <Card>
          <SectionTitle>사업자 정보</SectionTitle>
          <LockNotice>
            <FaLock size={11} />
            <span>
              대표자명·사업자등록번호는 사업자 신원과 직결된 정보예요.
              변경하려면 호스트 재인증이 필요해요.
            </span>
          </LockNotice>

          <FormGroup>
            <Label htmlFor="businessName">상호명</Label>
            <Input
              id="businessName"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="상호명을 입력해주세요"
            />
            <HelpText>고객에게 노출되는 공간 운영 이름입니다.</HelpText>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="businessNo">사업자등록번호</Label>
            <Input id="businessNo" value={initial.businessNo ?? ''} disabled />
            <HelpText>변경할 수 없습니다.</HelpText>
          </FormGroup>
        </Card>

        {/* 담당자 연락처 */}
        <Card>
          <SectionTitle>담당자 연락처</SectionTitle>

          <FormGroup>
            <Label htmlFor="name">담당자명</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="실제 응대하는 담당자 이름"
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">휴대폰</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              inputMode="numeric"
            />
            <HelpText>예약 알림이 전달되는 번호예요.</HelpText>
          </FormGroup>
        </Card>

        {/* 버튼 */}
        <ButtonRow>
          <GhostBtn type="button" onClick={() => navigate('/host/profile')}>
            취소
          </GhostBtn>
          <PrimaryBtn type="submit" disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </PrimaryBtn>
        </ButtonRow>
      </Form>

      {/* 이메일 변경 — 별도 섹션 (저장과 분리, 성공 시 로그아웃) */}
      <Card style={{ marginTop: 20 }}>
        <SectionTitle>이메일 변경</SectionTitle>
        <FormGroup>
          <EmailVerifyField
            value={newEmail}
            onChange={setNewEmail}
            initialEmail={initial.email}
            onVerifiedChange={setEmailVerified}
          />
        </FormGroup>
        <ButtonRow>
          <PrimaryBtn
            type="button"
            onClick={handleEmailChange}
            disabled={!emailVerified || changingEmail}
          >
            {changingEmail ? '변경 중...' : '이메일 변경'}
          </PrimaryBtn>
        </ButtonRow>
        <HelpText>이메일 변경 시 보안을 위해 다시 로그인해야 합니다.</HelpText>
      </Card>
    </PageLayout>
  );
}

export default HostProfileEditPage;
