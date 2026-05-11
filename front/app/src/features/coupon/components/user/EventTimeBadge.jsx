import styled, { css } from 'styled-components'

export function EventTimeBadge({ daysLeft, ended }) {
  if (ended) {
    return <Badge $variant="ended">종료</Badge>
  }

  if (daysLeft <= 0) {
    return <Badge $variant="urgent">오늘 마감</Badge>
  }

  if (daysLeft <= 3) {
    return <Badge $variant="urgent">⏰ D-{daysLeft}</Badge>
  }

  if (daysLeft <= 7) {
    return <Badge $variant="warning">D-{daysLeft}</Badge>
  }

  return <Badge $variant="normal">D-{daysLeft}</Badge>
}

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 600;
  font-family: var(--font-mono);
  letter-spacing: 0.02em;

  ${(props) =>
    props.$variant === 'urgent' &&
    css`
      background: #b85a4e;
      color: var(--white);
    `}

  ${(props) =>
    props.$variant === 'warning' &&
    css`
      background: rgba(212, 134, 31, 0.15);
      color: #b8730f;
    `}

  ${(props) =>
    props.$variant === 'normal' &&
    css`
      background: rgba(168, 184, 159, 0.2);
      color: #5b6b53;
    `}

  ${(props) =>
    props.$variant === 'ended' &&
    css`
      background: var(--gray-100);
      color: var(--gray-400);
    `}
`
