import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #eee;
  position: relative;
  ${(props) => props.highlight && `border-left: 5px solid #768966;`}
  .label {
    font-size: 13px;
    color: #888;
    margin-bottom: 10px;
  }
  .value {
    font-size: 20px;
    font-weight: bold;
  }
`;

export default function DetailSummaryCards({ data }) {
  const cards = [
    { label: '📅 이번 달 예약', value: `${data.monthlyBookings}건` },
    {
      label: '💰 이번 달 매출',
      value: `${data.monthlyRevenue}원`,
      highlight: true,
    },
    { label: '⭐ 평균 평점', value: `${data.averageRating}점` },
    { label: '💬 총 리뷰 수', value: `${data.totalReviews}개` },
  ];
  return (
    <Grid>
      {cards.map((c, i) => (
        <Card key={i} highlight={c.highlight}>
          <div className="label">{c.label}</div>
          <div className="value">{c.value}</div>
        </Card>
      ))}
    </Grid>
  );
}
