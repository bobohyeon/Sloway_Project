import { Fragment } from 'react';
import styled, { css } from 'styled-components';

export function PaymentSteps({ current = 2 }) {
  const steps = [
    { num: 1, label: '공간 선택' },
    { num: 2, label: '결제 진행' },
    { num: 3, label: '예약 확정' },
  ];

  return (
    <Wrap>
      {steps.map((step, i) => (
        <Fragment key={step.num}>
          <Step>
            <Dot $done={current > step.num} $active={current === step.num}>
              {current > step.num ? '✓' : step.num}
            </Dot>
            <Label $active={current === step.num}>{step.label}</Label>
          </Step>
          {i < steps.length - 1 && <Line $done={current > step.num} />}
        </Fragment>
      ))}
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-4) var(--space-6);
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-8);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  flex-shrink: 0;

  ${(props) =>
    props.$done &&
    css`
      background: var(--sage);
      color: var(--white);
    `}

  ${(props) =>
    props.$active &&
    css`
      background: var(--sage);
      color: var(--white);
      box-shadow: 0 0 0 4px rgba(168, 184, 159, 0.2);
    `}

  ${(props) =>
    !props.$done &&
    !props.$active &&
    css`
      background: var(--gray-100);
      color: var(--gray-400);
    `}
`;

const Label = styled.span`
  font-size: 0.9rem;
  color: ${(props) => (props.$active ? 'var(--gray-800)' : 'var(--gray-400)')};
  font-weight: ${(props) => (props.$active ? 500 : 400)};
`;

const Line = styled.div`
  flex: 0 0 60px;
  height: 1px;
  background: ${(props) => (props.$done ? 'var(--sage)' : 'var(--gray-200)')};
`;
