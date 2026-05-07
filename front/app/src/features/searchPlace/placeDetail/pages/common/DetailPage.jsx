import DetailImageBox from '../../components/common/detailImageBox';
import DetailMainBox from '../../components/common/detailMainBox';
import DetailRsvnBox from '../../components/common/detailRsvnBox';
import DetailLayout from '../../layouts/detailLayout';

export default function DetailPage() {
  const space = {
    type: '숙소',
    name: '제주 돌담집 리트릿',
    score: 4.9,
    reviewCount: 89,
    region: '제주 서귀포시 안덕면',
    checkIn: '15:00',
    checkOut: '11:00',
    maxGuest: 4,
    baseGuest: 2,
    rooms: 2,
    beds: 2,
    description:
      '돌담 너머로 바다가 보이는 조용한 마을에서, 제주의 리듬을 천천히 느껴보세요.',
    notices: [],
    facilities: [],
    pricePerNight: 220000,
    serviceFee: 12000,
    cancelPolicy: '무료 취소 · 이용 7일 전까지',
  };

  return (
    <DetailLayout
      imageBox={<DetailImageBox />}
      mainBox={<DetailMainBox space={space} />}
      rsvnBox={<DetailRsvnBox space={space} />}
    />
  );
}
