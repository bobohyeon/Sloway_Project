import { useState } from 'react';
import DetailLayout from '../../layouts/DetailLayout';
import DetailImageBox from '../../components/common/DetailImageBox';
import DetailMainBox from '../../components/common/DetailMainBox';
import DetailRsvnBox from '../../components/common/DetailRsvnBox';

const SPACE = {
  type: '숙소',
  title: '제주 돌담집 리트릿',
  score: 4.9,
  reviewCount: 89,
  location: '제주 서귀포시 안덕면',
  description:
    '돌담 너머로 바다가 보이는 조용한 마을에서, 제주의 리듬을 천천히 느껴보세요. 200년 된 돌담과 현대적 인테리어가 조화롭게 어우러진 1일 1팀 프라이빗 스테이입니다.',
  infoItems: [
    { label: '체크인', value: '오후 3:00' },
    { label: '체크아웃', value: '오전 11:00' },
    { label: '최대 인원', value: '4명 (기준 2명)' },
    { label: '침실', value: '2개 · 침대 2개' },
  ],
  facilities: [
    { icon: '🍳', name: '풀 주방' },
    { icon: '🧺', name: '세탁기' },
    { icon: '📶', name: '와이파이' },
    { icon: '🛁', name: '욕조' },
    { icon: '🌿', name: '개인 정원' },
    { icon: '🚗', name: '주차 가능' },
    { icon: '❄️', name: '에어컨' },
    { icon: '🔥', name: '바베큐 그릴' },
    { icon: '📺', name: 'TV' },
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
    name: '수연',
    avatar: '수',
    avatarColor: '#7B9EA8',
    date: '2026.04.10',
    usedDate: '2026.04.05 ~ 2026.04.07',
    scores: [
      { label: '종합 만족도', val: 5 },
      { label: '업무 환경', val: 5 },
      { label: '편의시설', val: 5 },
      { label: '집중도', val: 5 },
    ],
    text: '돌담 너머 바다 보면서 일하는 게 너무 좋았어요. 호스트님이 주신 감귤차도 정말 맛있었습니다 :)',
    helpful: 32,
    imgs: 2,
    reply: {
      hostName: '돌담집호스트',
      date: '2026.04.11',
      text: '감사합니다! 다음 방문 때 또 따뜻한 차 준비해들게요 🍊',
    },
  },
  {
    id: 2,
    name: '지훈',
    avatar: '지',
    avatarColor: '#A87B6B',
    date: '2026.03.20',
    usedDate: '2026.03.15 ~ 2026.03.17',
    scores: [
      { label: '종합 만족도', val: 5 },
      { label: '업무 환경', val: 4 },
      { label: '편의시설', val: 5 },
      { label: '집중도', val: 5 },
    ],
    text: '제주 특유의 돌담과 현대적인 인테리어가 정말 잘 어우러져 있었어요. 조용하고 프라이빗해서 혼자 작업하기 완벽했습니다.',
    helpful: 21,
    imgs: 3,
    reply: null,
  },
];

function StayDetailPage() {
  const [wished, setWished] = useState(false);

  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌴" />}
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
          spaceType="stay"
          rsvnInfo={RSVN_INFO}
          price={220000}
          priceUnit="원/박"
          onWishToggle={() => setWished((v) => !v)}
        />
      }
    />
  );
}

export default StayDetailPage;
