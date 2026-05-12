import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import RsvnCard from '../../components/user/RsvnCard';
import {
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  PageSub,
} from '../../components/user/RsvnStyled';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  animation: ${fadeInUp} 480ms ease-out both;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TABS = [
  { label: '전체', status: null },
  { label: '이용 예정', status: '이용 예정' },
  { label: '이용 완료', status: '이용 완료' },
  { label: '취소', status: '취소됨' },
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
    spaceType: 'workstays',
  },
  {
    id: 2,
    type: '오피스',
    status: '이용 예정',
    dday: 'D-4',
    title: '성수 브릭라운지',
    date: '4월 26일 14:00 ~ 18:00',
    code: 'SW-20260428-000523',
    price: '28,000원',
    icon: '🧱',
    action: '취소/환불',
    spaceType: 'coworking-offices',
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
    spaceType: 'accommodations',
  },
  {
    id: 4,
    type: '오피스',
    status: '이용 완료',
    dday: null,
    title: '강릉 바다향 커먼워크',
    date: '4월 2일 10:00 ~ 14:00',
    code: 'SW-20260402-000331',
    price: '28,000원',
    icon: '🌊',
    action: '리뷰 작성',
    spaceType: 'coworking-offices',
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
    spaceType: 'workstays',
  },
];

function RsvnListPage() {
  const [activeTab, setActiveTab] = useState(0);

  const filtered =
    activeTab === 0
      ? DUMMY
      : DUMMY.filter((i) => i.status === TABS[activeTab].status);

  const counts = TABS.map((tab, idx) =>
    idx === 0
      ? DUMMY.length
      : DUMMY.filter((i) => i.status === tab.status).length
  );

  return (
    <Page>
      <Header>
        <PageTitle>예약 목록</PageTitle>
        <PageSub>내가 예약한 공간의 이용 현황을 확인하세요</PageSub>
      </Header>

      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      <List>
        {filtered.map((item) => (
          <RsvnCard key={item.id} item={item} />
        ))}
      </List>
    </Page>
  );
}

export default RsvnListPage;
