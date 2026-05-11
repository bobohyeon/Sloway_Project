import styled from 'styled-components'
import { Card, Section } from '../../../pay_shared/components'

export function AdminMemoBox({ memo, onChange, savedMemos = [] }) {
  return (
    <Section title="관리자 메모">
      <MemoCard padded>
        {savedMemos.length > 0 && (
          <SavedMemos>
            {savedMemos.map((m, i) => (
              <SavedMemo key={i}>
                <SavedHeader>
                  <Author>{m.author}</Author>
                  <Time>{m.at}</Time>
                </SavedHeader>
                <SavedContent>{m.content}</SavedContent>
              </SavedMemo>
            ))}
          </SavedMemos>
        )}

        <TextareaWrap>
          <Textarea
            placeholder="처리 과정이나 특이사항을 기록해주세요 (내부용)"
            value={memo || ''}
            onChange={(e) => onChange(e.target.value)}
            maxLength={500}
          />
          <CharCount>{(memo || '').length} / 500</CharCount>
        </TextareaWrap>
      </MemoCard>
    </Section>
  )
}

const MemoCard = styled(Card)``

const SavedMemos = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  padding-bottom: var(--space-3);
  border-bottom: 1px dashed var(--gray-200);
`

const SavedMemo = styled.div`
  padding: var(--space-3);
  background: var(--gray-100);
  border-radius: var(--radius-md);
`

const SavedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`

const Author = styled.span`
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--gray-800);
`

const Time = styled.span`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--gray-400);
`

const SavedContent = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  line-height: 1.5;
  white-space: pre-wrap;
`

const TextareaWrap = styled.div`
  position: relative;
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 90px;
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
