import styled, { css } from 'styled-components';
import { Badge } from '../../../pay_shared/components';

export function PaymentMethodOption({ method, selected, onSelect }) {
  return (
    <Wrap $selected={selected} onClick={() => onSelect(method.id)}>
      <Icon style={{ background: method.bg, color: method.color }}>
        {method.icon}
      </Icon>
      <Body>
        <Name>{method.name}</Name>
        <Desc>{method.desc}</Desc>
      </Body>
      <Radio $selected={selected} />
    </Wrap>
  );
}

const Wrap = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  padding: var(--space-4) var(--space-5);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  text-align: left;
  transition: all 160ms ease;

  &:hover {
    border-color: var(--sage);
  }

  ${(props) =>
    props.$selected &&
    css`
      border-color: var(--sage);
      background: var(--cream);
      box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
    `}
`;

const Icon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid var(--gray-200);
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const Desc = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const Radio = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--gray-200);
  flex-shrink: 0;
  transition: all 160ms ease;
  position: relative;

  ${(props) =>
    props.$selected &&
    css`
      border-color: var(--sage);
      background: var(--sage);

      &::after {
        content: '';
        position: absolute;
        inset: 4px;
        border-radius: 50%;
        background: var(--white);
      }
    `}
`;
