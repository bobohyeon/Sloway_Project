import styled from 'styled-components';

const STATUS = {
  '이용 예정': { bg: '#EEF5EE', color: '#2D6A4F' },
  '이용 완료': { bg: '#F0F0F0', color: '#666' },
  취소됨: { bg: '#FFF0F0', color: '#C0392B' },
  확정: { bg: '#EEF5EE', color: '#2D6A4F' },
  거절: { bg: '#FFF3E0', color: '#E65100' },
  취소: { bg: '#FFF0F0', color: '#C0392B' },
  완료: { bg: '#F0F0F0', color: '#666' },
  '처리 중': { bg: '#FFF3E0', color: '#E65100' },
  '환불 불가': { bg: '#FFF0F0', color: '#C0392B' },
};

const DDAY = { bg: '#FFF3E0', color: '#E65100' };
const TYPE = { bg: 'rgba(168,184,159,0.18)', color: '#5b6b53' };

const Badge = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
`;

function RsvnStatusBadge({ type, label }) {
  let style;
  if (type === 'status')
    style = STATUS[label] || { bg: '#F0F0F0', color: '#666' };
  else if (type === 'dday') style = DDAY;
  else style = TYPE;

  return (
    <Badge $bg={style.bg} $color={style.color}>
      {label}
    </Badge>
  );
}

export default RsvnStatusBadge;
