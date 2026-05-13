import { useState } from 'react';
import DetailLayout from '../../layouts/DetailLayout';
import DetailImageBox from '../../components/common/DetailImageBox';
import DetailMainBox from '../../components/common/DetailMainBox';
import DetailRsvnBox from '../../components/common/DetailRsvnBox';

const SPACE = {
  type: '오피스',
  title: '강릉 바다향 커먼워크',
  score: 4.8,
  reviewCount: 203,
  location: '강원 강릉시 경포동',
  description:
    '경포 바다가 한눈에 보이는 시야, 집중과 영감이 동시에 필요한 당신을 위한 공간. 시간 단위 이용부터 데이 패스까지 유연하게 선택하세요.',
  infoItems: [
    { label: '운영 시간', value: '오전 8시 ~ 오후 11시' },
    { label: '전체 좌석', value: '60석 (오픈 40 · 전용 20)' },
    { label: '최소 이용', value: '2시간부터' },
    { label: '요금 옵션', value: '시간 / 하루 / 주 / 월' },
  ],
  facilities: [
    { icon: '📶', name: '기가 와이파이' },
    { icon: '🖨', name: '프린터' },
    { icon: '📹', name: 'webcam' },
    { icon: '📞', name: '폰부스' },
    { icon: '🏢', name: '회의실' },
    { icon: '☕', name: '카페테리아' },
    { icon: '🚗', name: '주차 가능' },
    { icon: '🔌', name: '멀티탭' },
    { icon: '🖥', name: '모니터 대여' },
  ],
  notices: [
    {
      title: '5월 성수기 요금 인상 안내',
      desc: '5/1 ~ 5/31 기간에 성수기 요금이 적용됩니다.',
    },
  ],
};

const RSVN_INFO = {
  checkIn: '5월 8일',
  checkOut: '5월 10일',
  guests: '성인 2명',
  nights: 2,
};

const REVIEWS = [
  {
    id: 1,
    name: '민재',
    avatar: '민',
    avatarColor: '#8B7BA8',
    date: '2026.04.05',
    usedDate: '2026.04.02',
    scores: [
      { label: '종합 만족도', val: 4 },
      { label: '업무 환경', val: 5 },
      { label: '편의시설', val: 4 },
      { label: '집중도', val: 4 },
    ],
    text: '전체적으로 좋았는데 주말에 사람이 조금 많은 편이에요. 조용한 공간을 원하시면 평일 추천!',
    helpful: 7,
    imgs: 0,
    reply: {
      hostName: '바다향커먼',
      date: '2026.04.05',
      text: '피드백 감사합니다! 주말 혼잡 문제는 예약 시스템 개선으로 나아질 예정이에요 🙏',
    },
  },
  {
    id: 2,
    name: '이강',
    avatar: '이',
    avatarColor: '#6B7BA8',
    date: '2026.03.18',
    usedDate: '2026.03.15',
    scores: [
      { label: '종합 만족도', val: 5 },
      { label: '업무 환경', val: 5 },
      { label: '편의시설', val: 5 },
      { label: '집중도', val: 5 },
    ],
    text: '바다 뷰 보면서 일하는 게 너무 좋아요. 와이파이 엄청 빠르고 폰부스도 있어서 화상회의도 편하게 할 수 있었어요.',
    helpful: 28,
    imgs: 2,
    reply: null,
  },
];

function OfficeDetailPage() {
  const [wished, setWished] = useState(false);

  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌊" />}
      mainBox={
        <DetailMainBox
          space={SPACE}
          reviews={REVIEWS}
          wished={wished}
          onWishToggle={setWished}
        />
      }
      rsvnBox={
        <DetailRsvnBox
          spaceType="office"
          rsvnInfo={RSVN_INFO}
          price={28000}
          priceUnit="원/4시간"
          serviceFee={12000}
          onWishToggle={() => setWished((v) => !v)}
        />
      }
    />
  );
}

export default OfficeDetailPage;
