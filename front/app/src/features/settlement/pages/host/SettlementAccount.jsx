import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaUniversity } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section } from '../../../pay_shared/components';
import { registerAccount, findAccountByHostNo } from '../../api/accountApi';

export default function SettlementAccount() {
  const [account, setAccount] = useState(null);
  const [form, setForm] = useState({ bankName: '', accountNo: '', holder: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const data = await findAccountByHostNo(); // 미등록이면 null
      setAccount(data || null);
      if (data) {
        setForm({
          bankName: data.bankName ?? '',
          accountNo: data.accountNo ?? '',
          holder: data.holder ?? '',
        });
      }
    } catch (err) {
      console.error('정산 계좌 조회 실패', err);
    }
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  const handleSave = async () => {
    if (!form.bankName || !form.accountNo || !form.holder) {
      alert('은행명, 계좌번호, 예금주를 모두 입력하세요.');
      return;
    }
    setSaving(true);
    try {
      await registerAccount({ ...form });
      await load(); // 저장 후 갱신
      alert('정산 계좌가 저장되었습니다.');
    } catch (err) {
      console.error('정산 계좌 저장 실패', err);
      alert('계좌 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      title="정산 계좌"
      description="정산 입금 계좌를 관리합니다"
      maxWidth={800}
    >
      <Section title="등록된 계좌">
        <AccountCard padded>
          <AccountHeader>
            <AccountIcon>
              <FaUniversity />
            </AccountIcon>
            <AccountTitle>
              {account ? '정산 입금 계좌' : '아직 등록된 계좌가 없습니다'}
            </AccountTitle>
          </AccountHeader>
          <Fields>
            <FieldRow>
              <FieldLabel>은행</FieldLabel>
              <FieldValue>{account?.bankName ?? '—'}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>계좌번호</FieldLabel>
              <FieldValue>{account?.accountNo ?? '—'}</FieldValue>
            </FieldRow>
            <FieldRow>
              <FieldLabel>예금주</FieldLabel>
              <FieldValue>{account?.holder ?? '—'}</FieldValue>
            </FieldRow>
          </Fields>
        </AccountCard>
      </Section>

      <Section title={account ? '계좌 수정' : '계좌 등록'}>
        <FormCard padded>
          <Field>
            <label>은행명</label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="예: 카카오뱅크"
            />
          </Field>
          <Field>
            <label>계좌번호</label>
            <input
              type="text"
              value={form.accountNo}
              onChange={(e) => setForm({ ...form, accountNo: e.target.value })}
              placeholder="- 없이 입력"
            />
          </Field>
          <Field>
            <label>예금주</label>
            <input
              type="text"
              value={form.holder}
              onChange={(e) => setForm({ ...form, holder: e.target.value })}
              placeholder="예금주명"
            />
          </Field>
          <SaveBtn onClick={handleSave} disabled={saving}>
            {saving ? '저장 중…' : account ? '계좌 수정' : '계좌 등록'}
          </SaveBtn>
        </FormCard>
      </Section>
    </PageLayout>
  );
}

const AccountCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
`;
const AccountHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--gray-100);
`;
const AccountIcon = styled.div`
  font-size: 1.4rem;
  color: var(--sage);
`;
const AccountTitle = styled.span`
  font-size: 0.95rem;
  color: var(--gray-800);
  font-weight: 600;
`;
const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;
const FieldRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FieldLabel = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`;
const FieldValue = styled.span`
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--gray-800);
`;

const FormCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.82rem;
    color: var(--gray-700);
  }

  input {
    padding: 9px 12px;
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;
const SaveBtn = styled.button`
  margin-top: var(--space-2);
  padding: 10px 16px;
  background: var(--sage);
  border: none;
  border-radius: var(--radius-md);
  color: var(--white);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
