import { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Card, Badge } from '../../../pay_shared/components'

export function PaymentMethodCard({ method, onSetDefault, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <Wrap>
      <Icon style={{ background: method.bg, color: method.color }}>
        {method.icon}
      </Icon>

      <Body>
        <NameRow>
          <Name>{method.name}</Name>
          {method.isDefault && <Badge variant="sage" size="sm">기본</Badge>}
        </NameRow>
        <SubInfo>
          {method.subInfo && <span>{method.subInfo}</span>}
          {method.expiry && (
            <>
              <Sep>·</Sep>
              <span>유효기간 {method.expiry}</span>
            </>
          )}
        </SubInfo>
      </Body>

      <MenuWrap ref={ref}>
        <MenuTrigger onClick={() => setMenuOpen(!menuOpen)}>⋯</MenuTrigger>
        {menuOpen && (
          <MenuDropdown>
            {!method.isDefault && (
              <MenuItem
                onClick={() => {
                  onSetDefault(method)
                  setMenuOpen(false)
                }}
              >
                기본 결제 수단으로
              </MenuItem>
            )}
            <MenuItem
              $danger
              onClick={() => {
                onDelete(method)
                setMenuOpen(false)
              }}
            >
              삭제
            </MenuItem>
          </MenuDropdown>
        )}
      </MenuWrap>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  position: relative;
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
  }
`

const Icon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  flex-shrink: 0;
  border: 1px solid var(--gray-200);
`

const Body = styled.div`
  flex: 1;
  min-width: 0;
`

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`

const Name = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
`

const SubInfo = styled.div`
  display: flex;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--gray-400);
`

const Sep = styled.span`
  opacity: 0.5;
`

const MenuWrap = styled.div`
  position: relative;
`

const MenuTrigger = styled.button`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  font-size: 1.3rem;
  color: var(--gray-400);

  &:hover {
    background: var(--gray-100);
    color: var(--gray-800);
  }
`

const MenuDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 180px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 4px;
  z-index: 10;
  animation: fadeIn 160ms ease-out;
`

const MenuItem = styled.button`
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  font-size: 0.85rem;
  color: var(--gray-800);
  border-radius: var(--radius-sm);
  transition: background 120ms ease;

  &:hover {
    background: var(--gray-100);
  }

  ${(props) =>
    props.$danger &&
    css`
      color: #b85a4e;
    `}
`
