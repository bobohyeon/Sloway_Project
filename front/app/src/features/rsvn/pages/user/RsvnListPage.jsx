import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RsvnCard from '../../components/user/RsvnCard';
import {
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  PageSub,
} from '../../components/user/RsvnStyled';

const TABS = [
  { label: '전체', count: 5 },
  { label: '이용 예정', count: 2 },
  { label: '이용 완료', count: 2 },
  { label: '취소', count: 1 },
];

const DUMMY = [
  {
    id: 1,
    type: '워크앤스테이',
    status: '이용 예정',
    dday: 'D-14',
    title: '청평 숲속 파인뷰 스테이',
    date: '5월 8일 ~ 5월 10일 · 2박',
    code: 'SW-20260508-000847',
    price: '372,000원',
    icon: '🌲',
    action: '취소/환불',
  },
  {
    id: 2,
    type: '코워킹오피스',
    status: '이용 예정',
    dday: 'D-4',
    title: '성수 브릭라운지',
    date: '4월 26일 14:00 ~ 18:00',
    code: 'SW-20260428-000523',
    price: '28,000원',
    icon: '🧱',
    action: '취소/환불',
  },
  {
    id: 3,
    type: '숙소',
    status: '이용 완료',
    dday: null,
    title: '제주 돌담집 리트릿',
    date: '4월 15일 ~ 4월 17일 · 2박',
    code: 'SW-20260415-000412',
    price: '444,000원',
    icon: '🌴',
    action: '리뷰 작성',
  },
  {
    id: 4,
    type: '코워킹오피스',
    status: '이용 완료',
    dday: null,
    title: '강릉 바다향 커먼워크',
    date: '4월 2일 10:00 ~ 14:00',
    code: 'SW-20260402-000331',
    price: '28,000원',
    icon: '🌊',
    action: '리뷰 작성',
  },
  {
    id: 5,
    type: '워크앤스테이',
    status: '취소됨',
    dday: null,
    title: '남해 올리브 팜스테이',
    date: '3월 20일 ~ 3월 22일 · 2박',
    code: 'SW-20260320-000218',
    price: '330,000원',
    icon: '✉️',
    action: null,
  },
];

function RsvnListPage() {
  const [activeTab, setActiveTab] = useState(0);

  const filtered =
    activeTab === 0
      ? DUMMY
      : DUMMY.filter(
          (i) => i.status === TABS[activeTab].label || i.status === '취소됨'
        );

  return (
    <div>
      <PageTitle>예약 목록</PageTitle>
      <PageSub>내가 예약한 공간의 이용 현황을 확인하세요</PageSub>

      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
            <TabCount $active={activeTab === idx}>{tab.count}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      {DUMMY.map((item) => (
        <RsvnCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default RsvnListPage;
