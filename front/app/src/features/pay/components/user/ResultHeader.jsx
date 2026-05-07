import styled, { css } from 'styled-components'

export function ResultHeader({ variant = 'success', title, description }) {
  return (
    <Wrap>
      <Icon $variant={variant}>
        {variant === 'success' ? '✓' : '🔒'}
      </Icon>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
    </Wrap>
  )
}

const Wrap = styled.div`
  text-align: center;
  margin-bottom: var(--space-10);
  animation: fadeInUp 480ms ease-out both;
`

const Icon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto var(--space-5);

  ${(props) =>
    props.$variant === 'success' &&
    css`
      background: var(--sage);
      color: var(--white);
      box-shadow: 0 0 0 12px rgba(168, 184, 159, 0.15);
    `}

  ${(props) =>
    props.$variant === 'fail' &&
    css`
      background: #f4dfdc;
      color: #b85a4e;
      box-shadow: 0 0 0 12px rgba(184, 90, 78, 0.1);
      border: 2px dashed #b85a4e;
      box-sizing: content-box;
    `}
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: var(--space-3);
`

const Description = styled.p`
  font-size: 0.95rem;
  color: var(--gray-600);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
`
