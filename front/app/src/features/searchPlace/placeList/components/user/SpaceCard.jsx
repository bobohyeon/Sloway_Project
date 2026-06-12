import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  addLikePlace,
  deleteLikePlace,
} from '../../../../wishList/api/wishListApi';
import { COLOR } from '../../../../rsvn/components/user/RsvnStyled';

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid ${COLOR.gray200};
  cursor: pointer;
  transition:
    box-shadow 0.2s,
    transform 0.2s;
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
`;

const ImgBox = styled.div`
  position: relative;
  height: 180px;
  background: ${COLOR.cream};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  overflow: hidden;
`;

const WishBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #fff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  cursor: pointer;
`;

const RoomBadge = styled.div`
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 20px;
`;

const SoldOutOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(80, 80, 80, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  flex-direction: column;
  gap: 4px;
`;

const Body = styled.div`
  padding: 14px 16px 16px;
`;

const TypeTag = styled.span`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${COLOR.gray600};
`;

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${COLOR.black};
  margin: 6px 0 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Location = styled.div`
  font-size: 12px;
  color: ${COLOR.gray400};
  margin-bottom: 8px;
`;

const AmenityRow = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const AmenityTag = styled.span`
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${COLOR.gray100};
  color: ${COLOR.gray600};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Price = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${COLOR.black};
  span {
    font-size: 12px;
    font-weight: 400;
    color: ${COLOR.gray400};
  }
`;

const ArrowBtn = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid ${COLOR.gray200};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: ${COLOR.gray400};
`;

function SpaceCard({ item, onClick }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(item.liked ?? false);
  const [likeNo, setLikeNo] = useState(item.likeNo ?? null);

  const handleClick = () => {
    if (onClick) {
      onClick(item);
    } else {
      navigate(`/spaces/${item.id}/rooms`, { state: { space: item } });
    }
  };

  const handleWish = async (e) => {
    e.stopPropagation();
    const prevLiked = liked;
    const prevLikeNo = likeNo;
    try {
      if (liked) {
        setLiked(false);
        setLikeNo(null);
        await deleteLikePlace(likeNo);
      } else {
        const res = await addLikePlace(item.placeNo);
        setLiked(true);
        setLikeNo(res.data?.no ?? res.data?.likeNo ?? null);
      }
    } catch (err) {
      // 실패 시 이전 상태로 되돌림
      setLiked(prevLiked);
      setLikeNo(prevLikeNo);
      console.error('찜 실패:', err.response?.status, err.response?.data);
    }
  };

  return (
    <Card onClick={handleClick}>
      <ImgBox>
        {item.thumbnailUrl
          ? <img src={item.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : item.icon
        }
        <WishBtn
          onClick={handleWish}
          style={{ color: liked ? '#e74c3c' : '#999' }}
        >
          {liked ? '♥' : '♡'}
        </WishBtn>
        {item.roomLeft > 0 && <RoomBadge>{item.roomLeft}개 남음</RoomBadge>}
        {item.soldOut && (
          <SoldOutOverlay>
            <span>예약 마감</span>
            <span style={{ fontSize: 12, opacity: 0.85 }}>다른 날짜 보기</span>
          </SoldOutOverlay>
        )}
      </ImgBox>
      <Body>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <TypeTag>{item.type}</TypeTag>
          <ScoreRow>
            <span style={{ color: '#C97D4C' }}>★</span>
            <span style={{ fontWeight: 600 }}>{item.score}</span>
            <span>({item.reviewCount})</span>
          </ScoreRow>
        </div>
        <Title>{item.title}</Title>
        <Location>📍 {item.location}</Location>
        <AmenityRow>
          {item.amenities.map((a, i) => (
            <AmenityTag key={i}>{a}</AmenityTag>
          ))}
        </AmenityRow>
        <PriceRow>
          <Price>
            {item.price.toLocaleString()}
            <span> {item.priceUnit}</span>
          </Price>
          <ArrowBtn>→</ArrowBtn>
        </PriceRow>
      </Body>
    </Card>
  );
}

export default SpaceCard;
