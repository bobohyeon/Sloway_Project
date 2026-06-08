import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DetailLayout from '../../layouts/DetailLayout';
import DetailImageBox from '../../components/common/DetailImageBox';
import DetailMainBox from '../../components/common/DetailMainBox';
import DetailRsvnBox from '../../components/common/DetailRsvnBox';
import { findReviewsByPlace } from '../../../../review/api/reviewApi';
import { getStationDetail } from '../../../api/searchApi';
import { saveRecentViewed } from '../../../recentPlace/api/recentApi';

function StayDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const selectedRoom = location.state?.selectedRoom ?? null;
  const [checkIn, setCheckIn] = useState(location.state?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(location.state?.checkOut ?? '');
  const [guests, setGuests] = useState(location.state?.guests ?? 2);
  const [space, setSpace] = useState(null);
  const [reviews, setReviews] = useState([]);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)))
    : 1;

  useEffect(() => {
    const load = async () => {
      try {
        const [spaceData, reviewData] = await Promise.all([
          getStationDetail(Number(id)),
          findReviewsByPlace(Number(id), 'STATION'),
        ]);
        const avgScore = reviewData.length > 0
          ? Math.round(reviewData.reduce((sum, r) => sum + (r.scoreTotal ?? 0), 0) / reviewData.length)
          : 0;
        setSpace({ ...spaceData, score: avgScore, reviewCount: reviewData.length });
        setReviews(reviewData);
        saveRecentViewed(spaceData.placeNo).catch(() => {});
      } catch (e) {
        console.error('데이터 조회 실패', e);
      }
    };
    load();
  }, [id]);

  if (!space) return null;

  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌴" />}
      mainBox={<DetailMainBox space={space} reviews={reviews} />}
      rsvnBox={
        <DetailRsvnBox
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          nights={nights}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          onGuestsChange={setGuests}
          price={selectedRoom?.price ?? space?.basePrice ?? 220000}
          priceUnit="원/박"
          roomName={selectedRoom?.name ?? null}
          rsvnDto={{
            stationNo: space?.entityNo,
            count: guests,
            amt: (selectedRoom?.price ?? space?.basePrice ?? 0) * nights,
            checkIn: checkIn ? new Date(checkIn).toISOString().slice(0, 19) : null,
            checkOut: checkOut ? new Date(checkOut).toISOString().slice(0, 19) : null,
            special: null,
          }}
        />
      }
    />
  );
}

export default StayDetailPage;
