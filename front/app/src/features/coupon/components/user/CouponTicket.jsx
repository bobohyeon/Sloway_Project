import styled, { css } from 'styled-components'
import { Button } from '../../../pay_shared/components'

export function CouponTicket({ coupon, onUse, status }) {
  const isUsed = status === 'used'
  const isExpired = status === 'expired'
  const isAvailable = status === 'available'

  return (
    <Wrap $status={status}>
      <Left $status={status}>
        <DiscountValue>
          {coupon.discountType === 'percent' ? (
            <>
              <DiscountNumber>{coupon.discountValue}</DiscountNumber>
              <DiscountUnit>%</DiscountUnit>
            </>
          ) : (
            <>
              <DiscountNumber>
                {coupon.discountValue >= 1000
                  ? (coupon.discountValue / 1000).toFixed(0)
                  : coupon.discountValue}
              </DiscountNumber>
              <DiscountUnit>
                {coupon.discountValue >= 1000 ? '천원' : '원'}
              </DiscountUnit>
            </>
          )}
        </DiscountValue>
        <DiscountLabel>{coupon.discountType === 'percent' ? '할인' : '즉시 할인'}</DiscountLabel>
      </Left>

      <DividerLine />

      <Right>
        <RightHeader>
          <Title>{coupon.title}</Title>
          {isAvailable && coupon.daysLeft <= 7 && coupon.daysLeft > 0 && (
            <ExpiringTag>⏰ D-{coupon.daysLeft}</ExpiringTag>
          )}
        </RightHeader>

        <InfoRow>
          <Label>유효기간</Label>
          <Value $expired={isExpired}>{coupon.expireDate}까지</Value>
        </InfoRow>

        {coupon.maxDiscount && (
          <InfoRow>
            <Label>최대 할인</Label>
            <Value>{coupon.maxDiscount.toLocaleString()}원</Value>
          </InfoRow>
        )}

        {coupon.minPayment && (
          <InfoRow>
            <Label>최소 결제</Label>
            <Value>{coupon.minPayment.toLocaleString()}원 이상</Value>
          </InfoRow>
        )}

        <TagRow>
          {coupon.category && <Tag>{coupon.category}</Tag>}
          {coupon.scope && <Tag>{coupon.scope}</Tag>}
        </TagRow>

        <ActionRow>
          {isAvailable && (
            <Button variant="primary" size="sm" onClick={() => onUse?.(coupon)}>
              지금 사용하기
            </Button>
          )}
          {isUsed && (
            <UsedInfo>
              ✓ {coupon.usedAt}에 사용됨
              {coupon.usedFor && <UsedSpaceName>{coupon.usedFor}</UsedSpaceName>}
            </UsedInfo>
          )}
          {isExpired && <ExpiredText>만료된 쿠폰이에요</ExpiredText>}
        </ActionRow>
      </Right>
    </Wrap>
  )
}

const Wrap = styled.div`
  display: flex;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all 200ms ease;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    background: var(--cream);
    border-radius: 50%;
    z-index: 1;
  }

  &::before {
    left: 138px;
    top: -8px;
  }

  &::after {
    left: 138px;
    bottom: -8px;
  }

  @media (max-width: 640px) {
    &::before {
      left: 100px;
    }
    &::after {
      left: 100px;
    }
  }

  &:hover {
    border-color: var(--sage);
    transform: translateY(-1px);
  }

  ${(props) =>
    props.$status === 'used' &&
    css`
      opacity: 0.55;
      &:hover {
        transform: none;
      }
    `}

  ${(props) =>
    props.$status === 'expired' &&
    css`
      opacity: 0.4;
      &:hover {
        transform: none;
        border-color: var(--gray-200);
      }
    `}
`

const Left = styled.div`
  width: 140px;
  flex-shrink: 0;
  background: ${(props) =>
    props.$status === 'available' ? 'var(--sage)' : 'var(--gray-200)'};
  color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);

  @media (max-width: 640px) {
    width: 100px;
    padding: var(--space-3);
  }
`

const DiscountValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
`

const DiscountNumber = styled.span`
  font-family: var(--font-display);
  font-size: 2.6rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
`

const DiscountUnit = styled.span`
  font-family: var(--font-display);
  font-size: 1.1rem;
  margin-top: 4px;
`

const DiscountLabel = styled.div`
  font-size: 0.78rem;
  margin-top: 6px;
  opacity: 0.9;
`

const DividerLine = styled.div`
  width: 0;
  border-left: 2px dashed var(--gray-200);
`

const Right = styled.div`
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const RightHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 6px;
  margin-bottom: 4px;
`

const Title = styled.h4`
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.01em;
  flex: 1;
`

const ExpiringTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: rgba(184, 90, 78, 0.1);
  color: #a04c42;
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 600;
  font-family: var(--font-mono);
  flex-shrink: 0;
`

const InfoRow = styled.div`
  display: flex;
  gap: 8px;
  font-size: 0.78rem;
  align-items: baseline;
`

const Label = styled.span`
  color: var(--gray-400);
  flex-shrink: 0;
  min-width: 56px;
`

const Value = styled.span`
  color: ${(props) => (props.$expired ? '#a04c42' : 'var(--gray-800)')};
  font-weight: 500;
`

const TagRow = styled.div`
  display: flex;
  gap: 4px;
  margin: 6px 0;
  flex-wrap: wrap;
`

const Tag = styled.span`
  padding: 2px 8px;
  background: var(--gray-100);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  color: var(--gray-600);
`

const ActionRow = styled.div`
  margin-top: 6px;
`

const UsedInfo = styled.div`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const UsedSpaceName = styled.span`
  margin-left: 6px;
  color: var(--gray-400);
`

const ExpiredText = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
`
