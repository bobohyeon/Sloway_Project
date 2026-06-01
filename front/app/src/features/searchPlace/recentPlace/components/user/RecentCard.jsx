import styled from 'styled-components';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const Card = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

const Thumb = styled.div`
  width: 64px;
  height: 64px;
  background: ${COLOR.cream};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  flex-shrink: 0;
`;

const TypeTag = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

const TimeAgo = styled.span`
  font-size: 12px;
  color: ${COLOR.gray400};
`;

const Rating = styled.span`
  color: ${COLOR.terra};
  font-weight: 600;
  font-size: 13px;
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${COLOR.black};
  white-space: nowrap;
  span {
    font-size: 12px;
    font-weight: 400;
    color: ${COLOR.gray400};
  }
`;

const DeleteBtn = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 1.5px solid #d0d0d0;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #b0b0b0;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  &:hover {
    border-color: #999;
    color: #555;
  }
`;

function RecentCard({ item, onDelete, onClick }) {
  return (
    <Card onClick={() => onClick && onClick(item)}>
      <Thumb>{item.icon}</Thumb>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 4,
          }}
        >
          <TypeTag>{item.type}</TypeTag>
          <TimeAgo>{item.timeAgo}</TimeAgo>
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: COLOR.black,
            marginBottom: 4,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {item.title}
        </div>
        <div
          style={{
            fontSize: 13,
            color: COLOR.gray600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>📍 {item.location}</span>
          {item.rating != null && (
            <>
              <span>·</span>
              <Rating>★ {item.rating}</Rating>
            </>
          )}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <Price>
          {item.price != null ? item.price.toLocaleString() : '—'}
          {item.price != null && <span>원~</span>}
        </Price>
        <DeleteBtn
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        >
          ✕
        </DeleteBtn>
      </div>
    </Card>
  );
}

export default RecentCard;
