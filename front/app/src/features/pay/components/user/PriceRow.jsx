import styled, { css } from 'styled-components';

export function PriceRow({ label, amount, type = 'normal' }) {
  return (
    <Row $type={type}>
      <span>{label}</span>
      <strong>
        {type === 'discount' && '-'}
        {Math.abs(amount).toLocaleString()}원
      </strong>
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.88rem;
  padding: 6px 0;

  span {
    color: var(--gray-600);
  }

  strong {
    color: var(--gray-800);
    font-weight: 500;
  }

  ${(props) =>
    props.$type === 'discount' &&
    css`
      strong {
        color: #b85a4e;
      }
    `}
`;
