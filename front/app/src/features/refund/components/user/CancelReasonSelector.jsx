import styled, { css } from 'styled-components'
import { Section } from '../../../pay_shared/components'

const DEFAULT_REASONS = [
  { id: 'schedule', label: '일정이 변경됐어요' },
  { id: 'other_space', label: '다른 공간으로 변경하려고요' },
  { id: 'health', label: '건강상의 이유' },
  { id: 'personal', label: '개인 사정 / 긴급 상황' },
  { id: 'price', label: '가격이 부담돼요' },
  { id: 'etc', label: '기타' },
]

export function CancelReasonSelector({
  reasons = DEFAULT_REASONS,
  selected,
  onChange,
  detail,
  onDetailChange,
}) {
  const showDetail = selected === 'etc'

  return (
    <Section title="취소 사유 *">
      <Description>서비스 개선을 위해 취소 사유를 남겨주시면 감사합니다</Description>

      <Grid>
        {reasons.map((r) => (
          <ReasonItem
            key={r.id}
            $selected={selected === r.id}
            onClick={() => onChange(r.id)}
          >
            {r.label}
          </ReasonItem>
        ))}
      </Grid>

      {showDetail && (
        <DetailWrap>
          <DetailTextarea
            placeholder="기타 사유를 입력해주세요 (10자 이상)"
            value={detail || ''}
            onChange={(e) => onDetailChange(e.target.value)}
            maxLength={500}
          />
          <CharCount>{(detail || '').length} / 500</CharCount>
        </DetailWrap>
      )}
    </Section>
  )
}

const Description = styled.p`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-3);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`

const ReasonItem = styled.button`
  padding: var(--space-3) var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  text-align: left;
  font-size: 0.88rem;
  color: var(--gray-800);
  transition: all 160ms ease;

  &:hover {
    border-color: var(--sage);
  }

  ${(props) =>
    props.$selected &&
    css`
      border-color: var(--sage);
      background: var(--cream);
      color: var(--gray-800);
      font-weight: 500;
    `}
`

const DetailWrap = styled.div`
  position: relative;
  margin-top: var(--space-3);
`

const DetailTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: var(--space-3) var(--space-4);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.88rem;
  color: var(--gray-800);
  outline: none;
  resize: vertical;
  font-family: inherit;
  transition: border-color 160ms ease;

  &:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }

  &::placeholder {
    color: var(--gray-400);
  }
`

const CharCount = styled.div`
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-size: 0.72rem;
  color: var(--gray-400);
`
