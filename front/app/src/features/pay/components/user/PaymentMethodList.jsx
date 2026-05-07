import styled from 'styled-components';
import { Section } from '../../../pay_shared/components';
import { PaymentMethodOption } from './PaymentMethodOption';

const DEFAULT_METHODS = [
  {
    id: 'kakao',
    name: '카카오페이',
    icon: '💬',
    bg: '#FEE500',
    color: '#191919',
    desc: '카카오페이 Ready API 연동',
    primary: true,
  },
  {
    id: 'naver',
    name: '네이버페이',
    icon: 'N',
    bg: '#03C75A',
    color: '#FFFFFF',
    desc: 'UI 시뮬레이션',
  },
  {
    id: 'toss',
    name: '토스페이',
    icon: 'T',
    bg: '#0064FF',
    color: '#FFFFFF',
    desc: 'UI 시뮬레이션',
  },
  {
    id: 'card',
    name: '신용/체크카드',
    icon: '💳',
    bg: '#FFFFFF',
    color: '#333333',
    desc: 'UI 시뮬레이션',
  },
];

export function PaymentMethodList({
  methods = DEFAULT_METHODS,
  selected,
  onChange,
}) {
  return (
    <Section title="결제 수단 선택">
      <List>
        {methods.map((method) => (
          <PaymentMethodOption
            key={method.id}
            method={method}
            selected={selected === method.id}
            onSelect={onChange}
          />
        ))}
      </List>
    </Section>
  );
}

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;
