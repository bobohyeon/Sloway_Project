import styled, { css } from 'styled-components'

export function RefundPolicyBadge({ rate }) {
  const variant = rate >= 100 ? 'success' : rate >= 50 ? 'warning' : 'danger'
  const label = rate > 0 ? `${rate}% 환불` : '환불 불가'

  return <Badge $variant={variant}>{label}</Badge>
}

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;

  ${(props) =>
    props.$variant === 'success' &&
    css`
      background: var(--sage);
      color: var(--white);
    `}

  ${(props) =>
    props.$variant === 'warning' &&
    css`
      background: rgba(212, 134, 31, 0.18);
      color: #b8730f;
    `}

  ${(props) =>
    props.$variant === 'danger' &&
    css`
      background: rgba(184, 90, 78, 0.18);
      color: #a04c42;
    `}
`
