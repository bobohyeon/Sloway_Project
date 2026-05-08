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
  BtnPrimary,
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

  return (
    <Card onClick={() => navigate(`/user/reservation/${item.id}`)}>
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
              onClick={(e) => {
                e.stopPropagation();
              }}
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
