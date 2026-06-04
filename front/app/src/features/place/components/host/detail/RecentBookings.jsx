import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Section = styled.div`
  background: white;
  border-radius: 15px;
  padding: 25px;
  border: 1px solid #eee;
  margin-bottom: 40px;
`;

const TitleArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h3 {
    font-size: 18px;
    color: #333;
  }
  .view-all {
    font-size: 13px;
    color: #888;
    cursor: pointer;
    &:hover {
      color: #333;
    }
  }
`;

const BookingCard = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: transform 0.2s;

  &:hover {
    background-color: #fafafa;
  }
`;

const UserIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f1f1f1;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 20px;
`;

const BookingInfo = styled.div`
  flex: 1;
  .user-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .sub-info {
    font-size: 13px;
    color: #999;
    display: flex;
    gap: 15px;
  }
`;

const PriceArea = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

function RecentBookings({ bookings = [] }) {
  const navigate = useNavigate();
  const formatBookingPeriod = (periodString) => {
    if (!periodString) return '';
    const parts = periodString.split('-');
    const dates = periodString.match(/\d{4}-\d{2}-\d{2}/g);
    if (!dates || dates.length < 2) return periodString;

    const formatDate = (dateStr) => {
      const [year, month, day] = dateStr.split('-');
      return `${month}.${day}`;
    };

    return `${formatDate(dates[0])} ~ ${formatDate(dates[1])}`;
  };
  return (
    <Section>
      <TitleArea>
        <h3>최근 예약</h3>
        <div
          className="view-all"
          onClick={() => {
            navigate(`/host/reservation/list`);
          }}
        >
          전체 →
        </div>
      </TitleArea>

      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <BookingCard
            key={booking.bookingId}
            onClick={() => {
              navigate(`/host/reservation/list/${booking.bookingId}`);
            }}
          >
            <UserIcon>👤</UserIcon>
            <BookingInfo>
              <div className="user-name">{booking.userName}</div>
              <div className="sub-info">
                <span>{booking.bookingCode}</span>
                <span>📅 {formatBookingPeriod(booking.bookingPeriod)}</span>
              </div>
            </BookingInfo>
            <PriceArea>{booking.totalPrice}원</PriceArea>
          </BookingCard>
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '30px', color: '#ccc' }}>
          최근 예약 내역이 없습니다.
        </div>
      )}
    </Section>
  );
}

export default RecentBookings;
