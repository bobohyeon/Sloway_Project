import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import DetailLayout from '../../layouts/DetailLayout';
import DetailImageBox from '../../components/common/DetailImageBox';
import DetailMainBox from '../../components/common/DetailMainBox';
import DetailRsvnBox from '../../components/common/DetailRsvnBox';
import { findReviewsByPlace } from '../../../../review/api/reviewApi';
import { getOfficeDetail } from '../../../api/searchApi';
import { saveRecentViewed } from '../../../recentPlace/api/recentApi';
import { findBlackoutsByEntity } from '../../../../rsvn/api/blackoutApi';

function OfficeDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const selectedRoom = location.state?.selectedRoom ?? null;
  const [checkIn, setCheckIn] = useState(location.state?.checkIn ?? '');
  const [checkOut, setCheckOut] = useState(location.state?.checkOut ?? '');
  const [guests, setGuests] = useState(location.state?.guests ?? 2);
  const [space, setSpace] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [blackouts, setBlackouts] = useState([]);

  // 오피스는 4시간 단위 과금 — 시간 차이를 4로 나눈 횟수
  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 4)))
    : 1;

  useEffect(() => {
    const load = async () => {
      try {
        const [spaceData, reviewData, blackoutData] = await Promise.all([
          getOfficeDetail(Number(id)),
          findReviewsByPlace(Number(id), 'OFFICE'),
          findBlackoutsByEntity(Number(id)),
        ]);
        const avgScore = reviewData.length > 0
          ? Math.round(reviewData.reduce((sum, r) => sum + (r.scoreTotal ?? 0), 0) / reviewData.length)
          : 0;
        setSpace({ ...spaceData, score: avgScore, reviewCount: reviewData.length });
        setReviews(reviewData);
        setBlackouts(blackoutData ?? []);
        saveRecentViewed(spaceData.placeNo).catch(() => {});
      } catch (e) {
        console.error('데이터 조회 실패', e);
      }
    };
    load();
  }, [id]);

  if (!space) return null;

  // 표시용·결제용 가격을 한 곳에서 결정 (백엔드 basePrice → 없으면 0)
  const unitPrice = selectedRoom?.price ?? space?.basePrice ?? 0;

  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌊" images={space?.images ?? []} />}
      mainBox={
        <DetailMainBox
          space={space}
          reviews={reviews}
        />
      }
      rsvnBox={
        <DetailRsvnBox
          type="office"
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          nights={nights}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          onGuestsChange={setGuests}
          blackouts={blackouts}
          exceptionPeriods={space?.exceptionPeriods ?? []}
          price={unitPrice}
          priceUnit="원/4시간"
          roomName={selectedRoom?.name ?? null}
          rsvnDto={{
            officeNo: space?.entityNo,
            count: guests,
            amt: unitPrice,
            checkIn: checkIn || null,
            checkOut: checkOut || null,
            special: null,
          }}
        />
      }
    />
  );
}

export default OfficeDetailPage;
