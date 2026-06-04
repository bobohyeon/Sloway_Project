import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';
import { saveRsvn } from '../../../../rsvn/api/rsvnApi';

const Box = styled.div`
  background: #fff;
  border: 1px solid #e8dfd0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  font-family: 'Noto Sans KR', sans-serif;
`;

const PriceRow = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f2ede4;
`;

const Price = styled.span`
  font-family: 'DM Serif Display', serif;
  font-size: 28px;
  color: ${COLOR.black};
`;

const PriceUnit = styled.span`
  font-size: 14px;
  color: #4a4a4a;
  margin-left: 4px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f2ede4;
  font-size: 14px;
`;

const InfoLabel = styled.span`
  color: #666;
`;
const InfoValue = styled.span`
  font-weight: 600;
  color: ${COLOR.black};
`;

const RsvnBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: ${COLOR.green};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  margin: 16px 0 10px;
  transition: background 0.2s;
  &:hover {
    background: #1a3a2a;
  }
`;


const CalcBox = styled.div`
  border-top: 1px solid #f2ede4;
  padding-top: 14px;
  margin-bottom: 12px;
`;

const CalcRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #555;
  margin-bottom: 8px;
`;

const CalcTotal = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 700;
  color: ${COLOR.black};
  border-top: 1px solid #f2ede4;
  padding-top: 12px;
  margin-top: 4px;
`;

const CancelPolicy = styled.p`
  font-size: 12px;
  color: #8a8a8a;
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
`;

function DetailRsvnBox({
  rsvnInfo = {},
  price = 0,
  priceUnit = '원/박',
  serviceFee = 12000,
  cancelPolicy = '무료 취소 · 이용 7일 전까지',
  rsvnDto,
}) {
  const navigate = useNavigate();

  const {
    checkIn = '5월 8일',
    checkOut = '5월 10일',
    guests = '성인 2명',
    nights = 2,
  } = rsvnInfo;

  const totalBase = price * nights;
  const grandTotal = totalBase + serviceFee;

  async function handleRsvn() {
    const rsvnNo = await saveRsvn(rsvnDto);
    navigate(`/user/payment/checkout`, { state: { rsvnNo } });
  }

  return (
    <Box>
      <PriceRow>
        <Price>{price.toLocaleString()}</Price>
        <PriceUnit>{priceUnit}</PriceUnit>
      </PriceRow>

      <InfoRow>
        <InfoLabel>날짜</InfoLabel>
        <InfoValue>
          {checkIn} → {checkOut}
        </InfoValue>
      </InfoRow>
      <InfoRow>
        <InfoLabel>인원</InfoLabel>
        <InfoValue>{guests}</InfoValue>
      </InfoRow>

      <RsvnBtn onClick={handleRsvn}>예약하기</RsvnBtn>

      {price > 0 && nights > 0 && (
        <CalcBox>
          <CalcRow>
            <span>
              {price.toLocaleString()}원 × {nights}박
            </span>
            <span>{totalBase.toLocaleString()}원</span>
          </CalcRow>
          <CalcRow>
            <span>서비스 수수료</span>
            <span>{serviceFee.toLocaleString()}원</span>
          </CalcRow>
          <CalcTotal>
            <span>합계</span>
            <span>{grandTotal.toLocaleString()}원</span>
          </CalcTotal>
        </CalcBox>
      )}

      <CancelPolicy>{cancelPolicy}</CancelPolicy>
    </Box>
  );
}

export default DetailRsvnBox;
