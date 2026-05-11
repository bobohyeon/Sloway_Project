import DetailLayout from '../../layouts/DetailLayout';
import DetailImageBox from '../../components/common/DetailImageBox';
import DetailMainBox from '../../components/common/DetailMainBox';
import DetailRsvnBox from '../../components/common/DetailRsvnBox';

const SPACE = {
  type: '코워킹오피스',
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

function OfficeDetailPage() {
  return (
    <DetailLayout
      imageBox={<DetailImageBox icon="🌊" moreCount={12} />}
      mainBox={<DetailMainBox space={SPACE} />}
      rsvnBox={
        <DetailRsvnBox
          spaceType="office"
          rsvnInfo={RSVN_INFO}
          price={28000}
          priceUnit="원/4시간"
          serviceFee={12000}
        />
      }
    />
  );
}

export default OfficeDetailPage;
