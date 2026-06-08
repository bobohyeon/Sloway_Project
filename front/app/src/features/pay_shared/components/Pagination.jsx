import styled, { css } from 'styled-components'
import { getPageNumbers } from '../../account/utils/pagination'

// 회원/호스트 목록과 동일한 페이징 UI (이전/다음 + ◀▶ 블록 점프)
export function Pagination({ currentPage = 1, totalPages = 1, onChange }) {
  if (totalPages <= 1) return null

  const { pages, hasPrev, hasNext, prevBlockPage, nextBlockPage } =
    getPageNumbers(currentPage, totalPages)

  return (
    <Wrap>
      <Btn
        disabled={currentPage === 1}
        onClick={() => onChange(currentPage - 1)}
      >
        이전
      </Btn>

      {hasPrev && <Btn onClick={() => onChange(prevBlockPage)}>◀</Btn>}

      {pages.map((p) => (
        <Btn key={p} $active={p === currentPage} onClick={() => onChange(p)}>
          {p}
        </Btn>
      ))}

      {hasNext && <Btn onClick={() => onChange(nextBlockPage)}>▶</Btn>}

      <Btn
        disabled={currentPage === totalPages}
        onClick={() => onChange(currentPage + 1)}
      >
        다음
      </Btn>
    </Wrap>
  )
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
