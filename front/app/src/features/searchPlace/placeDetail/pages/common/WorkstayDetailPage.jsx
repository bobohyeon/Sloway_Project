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

function WorkstayDetailPage() {
  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌲" moreCount={12} />}
      mainBox={<DetailMainBox space={SPACE} />}
      rsvnBox={
        <DetailRsvnBox
          spaceType="workstay"
          rsvnInfo={RSVN_INFO}
          price={185000}
          priceUnit="원/박"
        />
      }
    />
  );
}

export default WorkstayDetailPage;
