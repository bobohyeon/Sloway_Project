import { createPortal } from 'react-dom'
import styled from 'styled-components'

export function Modal({ open, onClose, title, children, footer, maxWidth = '480px' }) {
  if (!open) return null

  return createPortal(
    <Backdrop onClick={onClose}>
      <ModalWrap $maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        {title && (
          <Head>
            <Title>{title}</Title>
            <CloseBtn onClick={onClose}>×</CloseBtn>
          </Head>
        )}
        <Body>{children}</Body>
        {footer && <Footer>{footer}</Footer>}
      </ModalWrap>
    </Backdrop>,
    document.body
  )
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
  animation: fadeIn 200ms ease-out;
`

const ModalWrap = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: ${(props) => props.$maxWidth};
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeInUp 240ms ease-out;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18), 0 6px 16px rgba(0, 0, 0, 0.1);
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--gray-200);
`

const Title = styled.h3`
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--gray-800);
`

const CloseBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.5rem;
  color: var(--gray-400);

  &:hover {
    background: var(--gray-100);
    color: var(--gray-800);
  }
`

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
`

const Footer = styled.div`
  display: flex;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--gray-200);
  justify-content: flex-end;
`
