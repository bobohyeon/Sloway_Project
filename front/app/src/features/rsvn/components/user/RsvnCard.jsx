import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RsvnStatusBadge from './RsvnStatusBadge';
import { useAuth } from '../../../auth/hooks/useAuth';
import { findCompletedPayByRsvnNo } from '../../../pay/api/payApi';
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
  const { user } = useAuth();

  const handleAction = async (e) => {
    e.stopPropagation();
    if (item.action === '취소/환불') {
      // 예약에 해당하는 결제(payNo)를 찾아 바로 환불 신청 페이지로 이동
      const memberNo = user?.memberNo;
      if (!memberNo) {
        navigate('/login');
        return;
      }
      try {
        const pay = await findCompletedPayByRsvnNo(memberNo, item.id);
        if (pay) {
          navigate(`/user/refund/request?payNo=${pay.no}`);
        } else {
          // 결제건을 못 찾으면 기존처럼 결제 목록에서 직접 선택하도록 안내
          alert('환불 가능한 결제 내역을 찾을 수 없어요. 결제 내역에서 확인해주세요.');
          navigate('/user/payment');
        }
      } catch (err) {
        console.error('결제 조회 실패', err);
        navigate('/user/payment');
      }
    } else if (item.action === '리뷰 작성') {
      navigate('/user/review/write', { state: { rsvnNo: item.id } });
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
        <Thumb>
          {item.thumbUrl
            ? <img src={item.thumbUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
            : item.icon}
        </Thumb>
        <CardBody>
          <TagRow>
            <RsvnStatusBadge type="type" label={item.type} />
            <RsvnStatusBadge type="status" label={item.status} />
            {item.refunded && <RsvnStatusBadge type="status" label="환불" />}
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
