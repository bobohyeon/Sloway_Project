import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

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
`;

const Modal = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18), 0 6px 16px rgba(0, 0, 0, 0.1);
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-5) var(--space-6);
  border-bottom: 1px solid var(--gray-200);

  h3 {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 500;
    color: var(--gray-800);
  }
`;

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
`;

const Body = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`;

const CouponItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--gray-100);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 160ms ease;
  position: relative;

  &:hover {
    background: var(--cream);
  }

  ${(props) =>
    props.$selected &&
    css`
      background: var(--cream);
      border-color: var(--sage);
    `}

  ${(props) =>
    props.$disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      &:hover {
        background: var(--gray-100);
      }
    `}
`;

const Discount = styled.div`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--sage);
  min-width: 80px;
  text-align: center;
  letter-spacing: -0.02em;
`;

const Info = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const Meta = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
  margin-bottom: 4px;
`;

const Expires = styled.div`
  font-size: 0.72rem;
  color: #b85a4e;
  font-weight: 500;
`;

const Unavailable = styled.div`
  font-size: 0.72rem;
  color: var(--gray-400);
  font-style: italic;
`;

export function CouponModal({ coupons, selectedId, onSelect, onClose }) {
  return createPortal(
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Head>
          <h3>쿠폰 선택</h3>
          <CloseBtn onClick={onClose}>×</CloseBtn>
        </Head>
        <Body>
          {coupons.map((c) => (
            <CouponItem
              key={c.id}
              $disabled={!c.available}
              $selected={selectedId === c.id}
              onClick={() => c.available && onSelect(c)}
            >
              <Discount>
                {c.type === 'percent'
                  ? `${c.discount}%`
                  : `${c.discount.toLocaleString()}원`}
              </Discount>
              <Info>
                <Name>{c.name}</Name>
                <Meta>
                  {c.minAmount > 0 && (
                    <span>최소 {c.minAmount.toLocaleString()}원 결제 시</span>
                  )}
                  {c.minAmount > 0 && <span> · </span>}
                  <span>적용 · {c.scope}</span>
                </Meta>
                {c.expired ? (
                  <Unavailable>기간 만료됨</Unavailable>
                ) : (
                  <Expires>D-{c.expiresIn}</Expires>
                )}
              </Info>
              {!c.available && !c.expired && (
                <Unavailable>사용 조건 불충족</Unavailable>
              )}
            </CouponItem>
          ))}
        </Body>
      </Modal>
    </Backdrop>,
    document.body
  );
}
