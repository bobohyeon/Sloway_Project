import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// 요일 인덱스(0=일) → exceptionPeriod 필드명
const DAY_FIELD = ['sunPrice','monPrice','tuePrice','wedPrice','thuPrice','friPrice','satPrice'];

// 날짜 범위 내 예외기간 요금 합산 (숙소·워크앤스테이 전용)
function calcTotalWithExceptions(checkIn, checkOut, basePrice, exceptionPeriods) {
  let total = 0;
  let cur = new Date(checkIn);
  const end = new Date(checkOut);
  while (cur < end) {
    const dateStr = cur.toISOString().slice(0, 10);
    const ep = exceptionPeriods.find(e => dateStr >= e.startDate && dateStr < e.endDate);
    total += ep ? (ep[DAY_FIELD[cur.getDay()]] ?? basePrice) : basePrice;
    cur.setDate(cur.getDate() + 1);
  }
  return total;
}
import dayjs from 'dayjs';
import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';
import { saveRsvn } from '../../../../rsvn/api/rsvnApi';

// 선택 구간이 블랙아웃 범위와 겹치는지 확인
function hasOverlap(checkIn, checkOut, blackouts) {
  if (!checkIn || !checkOut || !blackouts?.length) return false;
  const ci = new Date(checkIn);
  const co = new Date(checkOut);
  return blackouts.some((b) => ci < new Date(b.endDate) && co > new Date(b.startDate));
}

function DetailRsvnBox({
  type = 'stay',           // 'stay' | 'office'
  checkIn = '',
  checkOut = '',
  guests = 2,
  nights = 1,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  price = 0,
  priceUnit = '원/박',
  cancelPolicy = '무료 취소 · 이용 7일 전까지',
  rsvnDto,
  roomName = null,
  blackouts = [],
  exceptionPeriods = [],
  chargeAdd = 0,
  baseCnt = 1,
}) {
  const navigate = useNavigate();

  // 오피스는 예외기간 계산 없이 단순 price × nights
  const grandTotal = useMemo(() => {
    const baseCost = (type === 'office' || !checkIn || !checkOut || !exceptionPeriods.length)
      ? price * nights
      : calcTotalWithExceptions(checkIn, checkOut, price, exceptionPeriods);
    // 기본 인원 초과분에만 추가요금 적용
    const extraPeople = Math.max(0, guests - baseCnt);
    const addCost = extraPeople * (chargeAdd ?? 0) * nights;
    return baseCost + addCost;
  }, [type, checkIn, checkOut, price, nights, exceptionPeriods, chargeAdd, guests, baseCnt]);

  const hasException = type !== 'office' && exceptionPeriods.length > 0
    && checkIn && checkOut
    && calcTotalWithExceptions(checkIn, checkOut, price, exceptionPeriods) !== price * nights;

  const hasExtra = checkIn && checkOut && (chargeAdd ?? 0) > 0 && guests > baseCnt;

  const isBlocked = useMemo(
    () => hasOverlap(checkIn, checkOut, blackouts),
    [checkIn, checkOut, blackouts]
  );

  const inputType = type === 'office' ? 'datetime-local' : 'date';
  const minDate = type === 'office' ? undefined : dayjs().format('YYYY-MM-DD');
  const minCheckOut = type === 'office' ? undefined : (checkIn || dayjs().format('YYYY-MM-DD'));

  async function handleRsvn() {
    try {
      const rsvnNo = await saveRsvn({ ...rsvnDto, amt: grandTotal });
      navigate(`/user/payment/checkout`, { state: { rsvnNo } });
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('로그인이 필요합니다');
        navigate('/login');
      } else {
        alert('예약 할 수 없습니다.');
      }
    }
  }

  return (
    <Box>
      <PriceRow>
        <Price>{price.toLocaleString()}</Price>
        <PriceUnit>{priceUnit}</PriceUnit>
        {(hasException || hasExtra) && (
          <ExceptionBadge>요금 별도 적용</ExceptionBadge>
        )}
        {roomName && <RoomNameTag>{roomName}</RoomNameTag>}
      </PriceRow>

      <InfoRow>
        <InfoLabel>체크인</InfoLabel>
        <DateInput
          type={inputType}
          value={checkIn}
          min={minDate}
          $error={isBlocked}
          onChange={(e) => onCheckInChange?.(e.target.value)}
        />
      </InfoRow>
      <InfoRow>
        <InfoLabel>체크아웃</InfoLabel>
        <DateInput
          type={inputType}
          value={checkOut}
          min={minCheckOut}
          $error={isBlocked}
          onChange={(e) => onCheckOutChange?.(e.target.value)}
        />
      </InfoRow>

      {isBlocked && (
        <ErrorMsg>이 기간은 이용 불가 기간입니다.</ErrorMsg>
      )}

      <InfoRow>
        <InfoLabel>인원</InfoLabel>
        <GuestSelect
          value={guests}
          onChange={(e) => onGuestsChange?.(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <option key={n} value={n}>{n}명</option>
          ))}
        </GuestSelect>
      </InfoRow>

      <RsvnBtn
        onClick={handleRsvn}
        disabled={isBlocked || !checkIn || !checkOut}
      >
        예약하기
      </RsvnBtn>

      {price > 0 && nights > 0 && (
        <CalcBox>
          <CalcRow>
            {hasException ? (
              <span style={{ color: '#888', fontSize: 12 }}>날짜별 요금 적용</span>
            ) : (
              <span>
                {price.toLocaleString()}원 × {nights}{type === 'office' ? '회' : '박'}
              </span>
            )}
            <span>
              {((type === 'office' || !checkIn || !checkOut || !exceptionPeriods.length)
                ? price * nights
                : calcTotalWithExceptions(checkIn, checkOut, price, exceptionPeriods)
              ).toLocaleString()}원
            </span>
          </CalcRow>
          {hasExtra && (
            <CalcRow>
              <span>인원 추가요금 (+{guests - baseCnt}명 × {(chargeAdd ?? 0).toLocaleString()}원 × {nights}{type === 'office' ? '회' : '박'})</span>
              <span>{(Math.max(0, guests - baseCnt) * (chargeAdd ?? 0) * nights).toLocaleString()}원</span>
            </CalcRow>
          )}
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

const InfoLabel = styled.span`color: #666;`;
const InfoValue = styled.span`font-weight: 600; color: ${COLOR.black};`;

const DateInput = styled.input`
  border: none;
  border-bottom: 1.5px solid ${({ $error }) => ($error ? '#E53E3E' : '#e8dfd0')};
  font-size: 14px;
  font-weight: 600;
  color: ${({ $error }) => ($error ? '#E53E3E' : '#2c2c2a')};
  background: transparent;
  cursor: pointer;
  &:focus {
    outline: none;
    border-bottom-color: ${({ $error }) => ($error ? '#E53E3E' : '#2d6a4f')};
  }
`;

const ErrorMsg = styled.p`
  font-size: 12px;
  color: #E53E3E;
  margin: 4px 0 8px;
  padding: 0;
`;

const GuestSelect = styled.select`
  border: none;
  border-bottom: 1px solid #e8dfd0;
  font-size: 14px;
  font-weight: 600;
  background: transparent;
  cursor: pointer;
`;

const RsvnBtn = styled.button`
  width: 100%;
  padding: 15px;
  background: ${({ disabled }) => (disabled ? '#b0aca4' : COLOR.green)};
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  margin: 16px 0 10px;
  transition: background 0.2s;
  &:hover:not(:disabled) {
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

const RoomNameTag = styled.span`
  margin-left: auto;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 12px;
  background: rgba(45, 106, 79, 0.1);
  color: #2d6a4f;
`;

const ExceptionBadge = styled.span`
  margin-left: 8px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgba(201, 125, 76, 0.12);
  color: #c97d4c;
  white-space: nowrap;
`;

export default DetailRsvnBox;
