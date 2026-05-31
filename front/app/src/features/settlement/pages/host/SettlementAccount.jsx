import styled from 'styled-components';
import { FaInfoCircle, FaUniversity } from 'react-icons/fa';

import PageLayout from '../../../../app/layouts/page/PageLayout';
import { Card, Section, EmptyState, Badge } from '../../../pay_shared/components';

const FIELDS = [
  { key: 'bank', label: '은행' },
  { key: 'accountNo', label: '계좌번호' },
  { key: 'holder', label: '예금주' },
  { key: 'verifiedAt', label: '인증 일시' },
];

export default function SettlementAccount() {
  return (
    <PageLayout
      title="정산 계좌"
      description="정산 입금 계좌를 관리합니다"
      maxWidth={800}
    >
      <NoticeCard padded>
        <NoticeIcon><FaInfoCircle /></NoticeIcon>
        <NoticeText>
          정산 계좌 등록 기능을 준비 중입니다. 본인 인증 및 계좌 인증 절차 완료 후
          활성화됩니다.
        </NoticeText>
      </NoticeCard>

      <Section title="등록된 계좌" action={<Badge>등록 대기</Badge>}>
        <AccountCard padded>
          <AccountHeader>
            <AccountIcon><FaUniversity /></AccountIcon>
            <AccountTitle>아직 등록된 계좌가 없습니다</AccountTitle>
          </AccountHeader>
          <Fields>
            {FIELDS.map((f) => (
              <FieldRow key={f.key}>
                <FieldLabel>{f.label}</FieldLabel>
                <FieldValue>—</FieldValue>
              </FieldRow>
            ))}
          </Fields>
        </AccountCard>
      </Section>

      <Section title="계좌 등록">
        <EmptyCard padded>
          <EmptyState
            icon="🏦"
            title="계좌 등록 준비 중"
            description="본인 인증 및 계좌 인증 절차 완료 후 등록할 수 있습니다."
          />
        </EmptyCard>
      </Section>
    </PageLayout>
  );
}

const NoticeCard = styled(Card)`
  display: flex; align-items: flex-start; gap: var(--space-3);
  margin-bottom: var(--space-4);
  background: var(--cream); border-color: var(--sage);
`;
const NoticeIcon = styled.div`font-size: 1.1rem; color: var(--sage); flex-shrink: 0; margin-top: 2px;`;
const NoticeText = styled.p`font-size: 0.85rem; color: var(--gray-800); line-height: 1.6; margin: 0;`;
const AccountCard = styled(Card)`display: flex; flex-direction: column; gap: var(--space-4);`;
const AccountHeader = styled.div`
  display: flex; align-items: center; gap: var(--space-3);
  padding-bottom: var(--space-3); border-bottom: 1px solid var(--gray-100);
`;
const AccountIcon = styled.div`font-size: 1.4rem; color: var(--gray-400);`;
const AccountTitle = styled.span`font-size: 0.95rem; color: var(--gray-600);`;
const Fields = styled.div`display: flex; flex-direction: column; gap: var(--space-2);`;
const FieldRow = styled.div`display: flex; justify-content: space-between; align-items: center;`;
const FieldLabel = styled.span`font-size: 0.85rem; color: var(--gray-600);`;
const FieldValue = styled.span`font-family: var(--font-mono); font-size: 0.88rem; color: var(--gray-400);`;
const EmptyCard = styled(Card)`padding: var(--space-6) var(--space-5);`;
