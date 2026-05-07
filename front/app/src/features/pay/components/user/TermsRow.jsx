import styled from 'styled-components';
import { Checkbox } from '../../../pay_shared/components';

export function TermsRow({ label, required, checked, onChange, onView }) {
  return (
    <Row>
      <Checkbox
        label={label}
        required={required}
        checked={checked}
        onChange={onChange}
      />
      {onView && <ViewBtn onClick={onView}>전문 보기</ViewBtn>}
    </Row>
  );
}

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
`;

const ViewBtn = styled.button`
  font-size: 0.78rem;
  color: var(--gray-400);
  text-decoration: underline;

  &:hover {
    color: var(--gray-800);
  }
`;
