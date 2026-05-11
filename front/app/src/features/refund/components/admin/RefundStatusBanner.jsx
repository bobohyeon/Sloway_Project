import styled, { css } from 'styled-components'

const VARIANT_MAP = {
  success: {
    icon: '✓',
    bg: 'rgba(168, 184, 159, 0.15)',
    border: 'rgba(168, 184, 159, 0.4)',
    color: '#5b6b53',
  },
  warning: {
    icon: '⚠️',
    bg: 'rgba(212, 134, 31, 0.1)',
    border: 'rgba(212, 134, 31, 0.3)',
    color: '#b8730f',
  },
  danger: {
    icon: '⚠️',
    bg: 'rgba(184, 90, 78, 0.08)',
    border: 'rgba(184, 90, 78, 0.3)',
    color: '#a04c42',
  },
  info: {
    icon: '💡',
    bg: 'var(--cream)',
    border: 'var(--gray-200)',
    color: 'var(--gray-800)',
  },
}

export function RefundStatusBanner({ variant = 'success', title, description }) {
  const style = VARIANT_MAP[variant] || VARIANT_MAP.success

  return (
    <Wrap $bg={style.bg} $border={style.border}>
      <IconWrap>{style.icon}</IconWrap>
      <Content>
        <Title $color={style.color}>{title}</Title>
        {description && <Description>{description}</Description>}
      </Content>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: ${(props) => props.$bg};
  border: 1px solid ${(props) => props.$border};
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-5);
`

const IconWrap = styled.div`
  font-size: 1.5rem;
  flex-shrink: 0;
`

const Content = styled.div`
  flex: 1;
`

const Title = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${(props) => props.$color};
  margin-bottom: 4px;
`

const Description = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  line-height: 1.5;
`
