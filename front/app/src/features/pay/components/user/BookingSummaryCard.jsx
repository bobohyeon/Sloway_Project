import styled from 'styled-components';
import { Card, Badge } from '../../../pay_shared/components';

const Wrap = styled.div`
  display: flex;
  gap: var(--space-5);
  align-items: flex-start;
`;

const Image = styled.div`
  width: 100px;
  height: 100px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  flex-shrink: 0;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Name = styled.div`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--gray-800);
  margin: 8px 0 4px;
  letter-spacing: -0.01em;
`;

const Loc = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: var(--space-3);
  border-top: 1px dashed var(--gray-200);
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;

  span {
    color: var(--gray-400);
  }

  strong {
    color: var(--gray-800);
    font-weight: 500;
  }
`;

export function BookingSummaryCard({ booking }) {
  return (
    <Card padded>
      <Wrap>
        <Image>{booking.emoji}</Image>
        <Body>
          <Badge variant="sage" size="sm">
            {booking.type}
          </Badge>
          <Name>{booking.name}</Name>
          <Loc>📍 {booking.loc}</Loc>
          <InfoList>
            <InfoRow>
              <span>일정</span>
              <strong>{booking.dates}</strong>
            </InfoRow>
            <InfoRow>
              <span>인원</span>
              <strong>{booking.guests}</strong>
            </InfoRow>
            <InfoRow>
              <span>기간</span>
              <strong>
                {booking.nights}박 {booking.nights + 1}일
              </strong>
            </InfoRow>
          </InfoList>
        </Body>
      </Wrap>
    </Card>
  );
}
