import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DetailLayout from '../../layouts/DetailLayout';
import DetailImageBox from '../../components/common/DetailImageBox';
import DetailMainBox from '../../components/common/DetailMainBox';
import DetailRsvnBox from '../../components/common/DetailRsvnBox';

const SPACE = {
  type: '워크앤스테이',
  title: '청평 숲속 파인뷰 스테이',
  score: 4.9,
  reviewCount: 127,
  location: '경기 가평군 청평면',
  description:
    '소나무 숲에 둘러싸인 완벽한 업무·휴식 공간. 듀얼 모니터, 고속 와이파이, 작은 회의실까지 갖추어 팀 워크숍에도 적합합니다. 밤에는 장작불 앞에서 차 한 잔.',
  infoItems: [
    { label: '체크인', value: '오후 3:00' },
    { label: '체크아웃', value: '오전 11:00' },
    { label: '최대 인원', value: '6명 (기준 4명)' },
    { label: '업무 공간', value: '독립형 데스크 4석' },
  ],
  facilities: [
    { icon: '🖥', name: '듀얼 모니터' },
    { icon: '📶', name: '기가 와이파이' },
    { icon: '🏢', name: '소형 회의실' },
    { icon: '🖨', name: '프린터' },
    { icon: '🍳', name: '주방' },
    { icon: '🧺', name: '세탁기' },
    { icon: '🚗', name: '주차 가능' },
    { icon: '♨️', name: '장작 난로' },
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
    name: '민정',
    avatar: '민',
    avatarColor: '#A8B89F',
    date: '2026.04.22',
    usedDate: '2026.04.18 ~ 2026.04.20',
    scores: [
      { label: '종합 만족도', val: 5 },
      { label: '업무 환경', val: 5 },
      { label: '편의시설', val: 4 },
      { label: '집중도', val: 5 },
    ],
    text: '조용하고 몰입감 있어요. 듀얼모니터도 잘 쓰고 왔습니다. 다음에 팀원들이랑 또 오고 싶어요! 회의실도 넓고 쾌적했고, 와이파이도 빠릿빠릿해서 화상회의도 문제없었어요.',
    helpful: 24,
    imgs: 3,
    reply: {
      hostName: '청평스테이',
      date: '2026.04.23',
      text: '감사합니다! 다음에도 좋은 시간 보내러 오세요 🌲',
    },
  },
  {
    id: 2,
    name: '준호',
    avatar: '준',
    avatarColor: '#C97D4C',
    date: '2026.04.10',
    usedDate: '2026.04.05 ~ 2026.04.07',
    scores: [
      { label: '종합 만족도', val: 5 },
      { label: '업무 환경', val: 5 },
      { label: '편의시설', val: 5 },
      { label: '집중도', val: 5 },
    ],
    text: '리모트 워크 일주일 했는데 너무 좋았어요. 인터넷 속도 빠르고 데스크 셋업이 진짜 편했습니다.',
    helpful: 18,
    imgs: 2,
    reply: null,
  },
  {
    id: 3,
    name: '소영',
    avatar: '소',
    avatarColor: '#7A9B7E',
    date: '2026.03.28',
    usedDate: '2026.03.22 ~ 2026.03.24',
    scores: [
      { label: '종합 만족도', val: 4 },
      { label: '업무 환경', val: 4 },
      { label: '편의시설', val: 4 },
      { label: '집중도', val: 5 },
    ],
    text: '전반적으로 만족스러웠어요. 조용한 환경에서 집중해서 일할 수 있었고, 침구도 깨끗했습니다.',
    helpful: 12,
    imgs: 1,
    reply: {
      hostName: '청평스테이',
      date: '2026.03.29',
      text: '소중한 후기 감사드려요! 🙏',
    },
  },
];

function WorkstayDetailPage() {
  const [wished, setWished] = useState(false);

  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌲" />}
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
          spaceType="workstay"
          rsvnInfo={RSVN_INFO}
          price={185000}
          priceUnit="원/박"
          onWishToggle={() => setWished((v) => !v)}
        />
      }
    />
  );
}

export default WorkstayDetailPage;
