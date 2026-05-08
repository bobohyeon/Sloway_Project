import styled, { css } from 'styled-components'

export function Pagination({ currentPage = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null

  const pages = getPageNumbers(currentPage, totalPages)

  return (
    <Wrap>
      <Btn
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        ‹
      </Btn>

      {pages.map((p, i) =>
        p === '...' ? (
          <Ellipsis key={`ellipsis-${i}`}>···</Ellipsis>
        ) : (
          <Btn
            key={p}
            $active={p === currentPage}
            onClick={() => onChange(p)}
          >
            {p}
          </Btn>
        )
      )}

      <Btn
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        ›
      </Btn>
    </Wrap>
  )
}

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = []
  if (current <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', total)
  } else if (current >= total - 3) {
    pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }
  return pages
}

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: var(--space-6);
`

const Btn = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--gray-600);
  transition: all 160ms ease;

  &:hover:not(:disabled) {
    background: var(--gray-100);
    color: var(--gray-800);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  ${(props) =>
    props.$active &&
    css`
      background: var(--sage);
      color: var(--white);
      font-weight: 600;

      &:hover:not(:disabled) {
        background: var(--sage);
        color: var(--white);
      }
    `}
`

const Ellipsis = styled.span`
  padding: 0 8px;
  color: var(--gray-400);
`
