import styled from 'styled-components';
import { Card, Badge } from '../../../pay_shared/components';

export function ReservationInfoCard({ reservation }) {
  return (
    <Card padded>
      <TopRow>
        <BookingId>
          <Label>예약 번호</Label>
          <Value>{reservation.bookingId}</Value>
        </BookingId>
        <Badge variant="success" size="md">
          ✓ 예약 확정
        </Badge>
      </TopRow>

      <Divider />

      <SpaceRow>
        <Image>{reservation.emoji}</Image>
        <SpaceInfo>
          <Badge variant="sage" size="sm">
            {reservation.type}
          </Badge>
          <SpaceName>{reservation.name}</SpaceName>
          <Loc>📍 {reservation.loc}</Loc>
        </SpaceInfo>
      </SpaceRow>

      <Divider />

      <Grid>
        <InfoBlock>
          <BlockTitle>이용 정보</BlockTitle>
          <InfoRow>
            <span>일정</span>
            <strong>{reservation.dates}</strong>
          </InfoRow>
          <InfoRow>
            <span>인원</span>
            <strong>{reservation.guests}</strong>
          </InfoRow>
          <InfoRow>
            <span>체크인</span>
            <strong>{reservation.checkIn}</strong>
          </InfoRow>
        </InfoBlock>

        <InfoBlock>
          <BlockTitle>결제 정보</BlockTitle>
          <InfoRow>
            <span>결제 금액</span>
            <strong>{reservation.amount.toLocaleString()}원</strong>
          </InfoRow>
          <InfoRow>
            <span>결제 수단</span>
            <strong>{reservation.method}</strong>
          </InfoRow>
          <InfoRow>
            <span>승인 번호</span>
            <strong>{reservation.approvalNo}</strong>
          </InfoRow>
          <InfoRow>
            <span>결제 일시</span>
            <strong>{reservation.paidAt}</strong>
          </InfoRow>
        </InfoBlock>
      </Grid>

      <EarnBox>
        <span>🌱</span>
        <span>
          이용 완료 후{' '}
          <strong>{reservation.earnPoints.toLocaleString()}P</strong> 적립 예정
        </span>
        <Hint>결제액의 1% 적립 · 이용 완료 후 확정 지급</Hint>
      </EarnBox>
    </Card>
  );
}

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-4);
`;

const BookingId = styled.div``;

const Label = styled.div`
  font-size: 0.78rem;
  color: var(--gray-400);
  margin-bottom: 4px;
`;

const Value = styled.div`
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: var(--space-4) 0;
`;

const SpaceRow = styled.div`
  display: flex;
  gap: var(--space-4);
  align-items: center;
`;

const Image = styled.div`
  width: 64px;
  height: 64px;
  background: var(--gray-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
`;

const SpaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SpaceName = styled.div`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gray-800);
  margin: 6px 0 4px;
  letter-spacing: -0.01em;
`;

const Loc = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BlockTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: var(--space-2);
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

const EarnBox = styled.div`
  margin-top: var(--space-5);
  padding: var(--space-4);
  background: var(--cream);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: var(--gray-600);

  strong {
    color: var(--sage);
    font-weight: 600;
  }
`;

const Hint = styled.div`
  width: 100%;
  font-size: 0.72rem;
  color: var(--gray-400);
  margin-top: 4px;
`;
