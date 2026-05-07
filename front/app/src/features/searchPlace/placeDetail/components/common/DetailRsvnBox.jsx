import { useState } from 'react';
import styled from 'styled-components';

const Box = styled.div`
  background: #fff;
  border: 1px solid #e8dfd0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  font-family: 'Noto Sans KR', sans-serif;
`;

const PriceRow = styled.div`
  margin-bottom: 20px;
`;

const Price = styled.span`
  font-family: 'DM Serif Display', serif;
  font-size: 26px;
  color: #0d2418;
`;

const PriceUnit = styled.span`
  font-size: 14px;
  color: #4a4a4a;
  margin-left: 4px;
`;

const DateGrid = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 16px;
`;

const DateItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Arrow = styled.span`
  color: #8a8a8a;
  font-size: 14px;
  padding-bottom: 10px;
  flex-shrink: 0;
`;

const Label = styled.label`
  font-size: 11px;
  color: #8a8a8a;
  letter-spacing: 0.04em;
`;

const DateInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e8dfd0;
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Noto Sans KR', sans-serif;
  color: #1a1a1a;
  background: #faf7f2;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #52796f;
    background: #fff;
  }
`;

const GuestRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 12px;
  border: 1px solid #e8dfd0;
  border-radius: 8px;
`;

const GuestCtrl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const GuestBtn = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid #e8dfd0;
  background: #fff;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a4a4a;
  transition: all 0.2s;

  &:hover {
    border-color: #52796f;
    color: #2d6a4f;
  }
`;

const GuestCount = styled.span`
  font-size: 13px;
  color: #1a1a1a;
  min-width: 60px;
  text-align: center;
`;

const RsvnBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #2d6a4f;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 10px;

  &:hover {
    background: #1a3a2a;
  }
`;

const WishBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: none;
  color: #4a4a4a;
  border: 1px solid #e8dfd0;
  border-radius: 10px;
  font-size: 13px;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 20px;

  &:hover {
    border-color: #84a98c;
    color: #2d6a4f;
  }
`;

const Calc = styled.div`
  border-top: 1px solid #f2ede4;
  padding-top: 16px;
  margin-bottom: 16px;
`;

const CalcRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: ${({ $total }) => ($total ? '15px' : '13px')};
  font-weight: ${({ $total }) => ($total ? 700 : 400)};
  color: ${({ $total }) => ($total ? '#1A1A1A' : '#4A4A4A')};
  margin-bottom: 10px;
`;

const CalcDivider = styled.div`
  height: 1px;
  background: #f2ede4;
  margin: 12px 0;
`;

const CancelPolicy = styled.p`
  font-size: 11px;
  color: #8a8a8a;
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
`;

function DetailRsvnBox({ space = {} }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);

  const {
    pricePerNight = 0,
    serviceFee = 0,
    cancelPolicy = '무료 취소 · 이용 7일 전까지',
  } = space;

  const nights =
    checkIn && checkOut
      ? Math.ceil(
          (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
        )
      : 0;

  const totalPrice = pricePerNight * nights;
  const grandTotal = totalPrice + serviceFee;

  return (
    <Box>
      <PriceRow>
        <Price>{pricePerNight.toLocaleString()}</Price>
        <PriceUnit>원/박</PriceUnit>
      </PriceRow>

      <DateGrid>
        <DateItem>
          <Label>날짜</Label>
          <DateInput
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </DateItem>
        <Arrow>→</Arrow>
        <DateItem>
          <Label>&nbsp;</Label>
          <DateInput
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </DateItem>
      </DateGrid>

      <GuestRow>
        <Label>인원</Label>
        <GuestCtrl>
          <GuestBtn onClick={() => setGuests((g) => Math.max(1, g - 1))}>
            −
          </GuestBtn>
          <GuestCount>성인 {guests}명</GuestCount>
          <GuestBtn onClick={() => setGuests((g) => g + 1)}>+</GuestBtn>
        </GuestCtrl>
      </GuestRow>

      <RsvnBtn>예약하기</RsvnBtn>
      <WishBtn>찜하기</WishBtn>

      {nights > 0 && (
        <Calc>
          <CalcRow>
            <span>
              {pricePerNight.toLocaleString()}원 × {nights}박
            </span>
            <span>{totalPrice.toLocaleString()}원</span>
          </CalcRow>
          {serviceFee > 0 && (
            <CalcRow>
              <span>서비스 수수료</span>
              <span>{serviceFee.toLocaleString()}원</span>
            </CalcRow>
          )}
          <CalcDivider />
          <CalcRow $total>
            <span>합계</span>
            <span>{grandTotal.toLocaleString()}원</span>
          </CalcRow>
        </Calc>
      )}

      <CancelPolicy>{cancelPolicy}</CancelPolicy>
    </Box>
  );
}

export default DetailRsvnBox;
