import { useState, useEffect } from 'react';
import DetailLayout from '../../layouts/DetailLayout';
import DetailImageBox from '../../components/common/DetailImageBox';
import DetailMainBox from '../../components/common/DetailMainBox';
import DetailRsvnBox from '../../components/common/DetailRsvnBox';
import { findReviewsByPlace } from '../../../../review/api/reviewApi';
import { getWorkStayDetail } from '../../../api/searchApi';

const RSVN_INFO = {
  checkIn: '5월 8일',
  checkOut: '5월 10일',
  guests: '성인 2명',
  nights: 2,
};

function WorkstayDetailPage() {
  const [space, setSpace] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [spaceData, reviewData] = await Promise.all([
          getWorkStayDetail(9001),
          findReviewsByPlace(9005),
        ]);
        setSpace(spaceData);
        setReviews(reviewData);
      } catch (e) {
        console.error('데이터 조회 실패', e);
      }
    };
    load();
  }, []);

  if (!space) return null;

  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌲" />}
      mainBox={
        <DetailMainBox
          space={space}
          reviews={reviews}
        />
      }
      rsvnBox={
        <DetailRsvnBox
          rsvnInfo={RSVN_INFO}
          price={185000}
          priceUnit="원/박"
          rsvnDto={{
            workStayNo: 9001,
            count: 2,
            amt: 185000,
            checkIn: '2026-06-10T15:00:00',
            checkOut: '2026-06-12T11:00:00',
            special: null,
          }}
        />
      }
    />
  );
}

export default WorkstayDetailPage;
