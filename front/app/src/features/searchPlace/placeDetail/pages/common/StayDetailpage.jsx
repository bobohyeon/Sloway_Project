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

function StayDetailPage() {
  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌴" moreCount={12} />}
      mainBox={<DetailMainBox space={SPACE} />}
      rsvnBox={
        <DetailRsvnBox
          spaceType="stay"
          rsvnInfo={RSVN_INFO}
          price={220000}
          priceUnit="원/박"
        />
      }
    />
  );
}

export default StayDetailPage;
