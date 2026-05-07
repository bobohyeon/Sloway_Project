import styled from 'styled-components';
import { Card, Section, Button, Badge } from '../../../pay_shared/components';

export function CouponSection({
  coupons,
  selected,
  onSelect,
  onRemove,
  onOpenModal,
}) {
  return (
    <Section
      title="쿠폰 적용"
      action={
        <Button variant="ghost" size="sm" onClick={onOpenModal}>
          쿠폰 선택 →
        </Button>
      }
    >
      {selected ? (
        <Applied>
          <AppliedInfo>
            <Badge variant="sage" size="sm">
              쿠폰 적용됨
            </Badge>
            <AppliedName>{selected.name}</AppliedName>
            <AppliedAmount>
              -{calculateDiscount(selected, 0).toLocaleString()}원 할인
            </AppliedAmount>
          </AppliedInfo>
          <RemoveBtn onClick={onRemove}>×</RemoveBtn>
        </Applied>
      ) : (
        <Empty>
          <span>🎟️ 보유한 쿠폰이 {coupons.length}장 있어요</span>
          <Button variant="ghost" size="sm" onClick={onOpenModal}>
            쿠폰 보기
          </Button>
        </Empty>
      )}
    </Section>
  );
}

function calculateDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  return coupon.type === 'percent'
    ? Math.floor((subtotal * coupon.discount) / 100)
    : coupon.discount;
}

const Applied = styled(Card)`
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--cream);
  border-color: var(--sage);
`;

const AppliedInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AppliedName = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-top: 4px;
`;

const AppliedAmount = styled.div`
  font-size: 0.82rem;
  color: var(--sage);
  font-weight: 500;
`;

const RemoveBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.3rem;
  color: var(--gray-400);

  &:hover {
    background: var(--white);
    color: var(--gray-800);
  }
`;

const Empty = styled(Card)`
  padding: var(--space-4) var(--space-5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--gray-600);
`;
