import styled from 'styled-components';
import { Card, Section, Checkbox } from '../../../pay_shared/components';
import { TermsRow } from './TermsRow';

const DEFAULT_TERMS = [
  { key: 'terms', label: '결제 이용약관 동의 (필수)', required: true },
  { key: 'privacy', label: '개인정보 제3자 제공 동의 (필수)', required: true },
  { key: 'refund', label: '취소·환불 정책 동의 (필수)', required: true },
];

export function TermsAgreement({
  terms = DEFAULT_TERMS,
  agrees,
  onChange,
  onViewTerm,
}) {
  const allChecked = Object.values(agrees).every(Boolean);

  const toggleAll = () => {
    const next = !allChecked;
    const updated = {};
    terms.forEach((t) => {
      updated[t.key] = next;
    });
    onChange(updated);
  };

  const toggleOne = (key) => {
    onChange({ ...agrees, [key]: !agrees[key] });
  };

  return (
    <Section title="약관 동의">
      <Card padded>
        <AllRow>
          <Checkbox
            label="전체 동의"
            checked={allChecked}
            onChange={toggleAll}
          />
        </AllRow>
        <Divider />
        <List>
          {terms.map((t) => (
            <TermsRow
              key={t.key}
              label={t.label}
              required={t.required}
              checked={!!agrees[t.key]}
              onChange={() => toggleOne(t.key)}
              onView={onViewTerm ? () => onViewTerm(t.key) : undefined}
            />
          ))}
        </List>
      </Card>
    </Section>
  );
}

const AllRow = styled.div`
  padding-bottom: var(--space-3);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: 0 0 var(--space-2);
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;
