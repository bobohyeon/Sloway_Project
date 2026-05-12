import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RsvnStatusBadge from './RsvnStatusBadge';
import {
  Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  Price,
  BtnSm,
  COLOR,
} from './RsvnStyled';

const ActionBtn = styled(BtnSm)`
  ${({ $primary }) =>
    $primary &&
    `
    background: #2D6A4F;
    color: #fff;
    border-color: #2D6A4F;
    &:hover { background: #1A3A2A; }
  `}
`;

function RsvnCard({ item }) {
  const navigate = useNavigate();

  const handleAction = (e) => {
    e.stopPropagation();
    if (item.action === '취소/환불') {
      navigate('/user/refund/request');
    } else if (item.action === '리뷰 작성') {
      navigate('/user/review/write');
    }
  };

  // 공간 상세로 이동 — spaceType이 있으면 해당 경로, 없으면 예약상세로
  const handleCardClick = () => {
    if (item.spaceType) {
      navigate(`/${item.spaceType}/${item.id}`);
    } else {
      navigate(`/user/reservation/${item.id}`);
    }
  };

  return (
    <Card onClick={handleCardClick}>
      <CardRow>
        <Thumb>{item.icon}</Thumb>
        <CardBody>
          <TagRow>
            <RsvnStatusBadge type="type" label={item.type} />
            <RsvnStatusBadge type="status" label={item.status} />
            {item.dday && <RsvnStatusBadge type="dday" label={item.dday} />}
          </TagRow>
          <CardTitle>{item.title}</CardTitle>
          <CardMeta>
            <span>📅 {item.date}</span>
            <span>·</span>
            <span>{item.code}</span>
          </CardMeta>
        </CardBody>
        <CardRight>
          <Price>{item.price}</Price>
          {item.action && (
            <ActionBtn
              $primary={item.action === '리뷰 작성'}
              onClick={handleAction}
            >
              {item.action}
            </ActionBtn>
          )}
        </CardRight>
      </CardRow>
    </Card>
  );
}

export default RsvnCard;
