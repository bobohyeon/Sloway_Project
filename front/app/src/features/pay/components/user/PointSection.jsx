import styled from 'styled-components';
import { Card, Section } from '../../../pay_shared/components';

export function PointSection({ heldPoints, points, onChange }) {
  const handleInput = (e) => {
    const v = Math.min(Math.max(0, Number(e.target.value) || 0), heldPoints);
    onChange(v);
  };

  return (
    <Section title="포인트 사용">
      <Card padded>
        <Row>
          <PointInfo>
            <Label>보유 포인트</Label>
            <Value>
              {heldPoints.toLocaleString()}
              <Unit>P</Unit>
            </Value>
          </PointInfo>
          <InputWrap>
            <InputField>
              <input
                type="number"
                placeholder="사용할 포인트"
                value={points || ''}
                onChange={handleInput}
                max={heldPoints}
              />
              <InputUnit>P</InputUnit>
            </InputField>
            <UseAllBtn onClick={() => onChange(heldPoints)}>
              전액 사용
            </UseAllBtn>
          </InputWrap>
        </Row>
        <Hint>최소 1,000P부터 사용 가능 · 결제액의 30%까지 사용 가능</Hint>
      </Card>
    </Section>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-6);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-3);
  }
`;

const PointInfo = styled.div`
  flex-shrink: 0;
`;

const Label = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--sage);
  letter-spacing: -0.02em;
`;

const Unit = styled.span`
  font-size: 0.9rem;
  margin-left: 2px;
  color: var(--gray-600);
`;

const InputWrap = styled.div`
  flex: 1;
  display: flex;
  gap: var(--space-2);
`;

const InputField = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  padding: 0 14px;
  transition: border-color 160ms ease;

  &:focus-within {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(168, 184, 159, 0.15);
  }

  input {
    flex: 1;
    padding: 10px 0;
    border: none;
    background: transparent;
    outline: none;
    font-size: 0.95rem;
    color: var(--gray-800);
    text-align: right;

    &::placeholder {
      color: var(--gray-400);
      text-align: left;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
`;

const InputUnit = styled.span`
  margin-left: 6px;
  color: var(--gray-400);
  font-size: 0.9rem;
`;

const UseAllBtn = styled.button`
  padding: 10px 16px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  color: var(--gray-800);
  white-space: nowrap;
  transition: all 160ms ease;

  &:hover {
    background: var(--sage);
    color: var(--white);
  }
`;

const Hint = styled.div`
  margin-top: var(--space-3);
  font-size: 0.78rem;
  color: var(--gray-400);
`;
