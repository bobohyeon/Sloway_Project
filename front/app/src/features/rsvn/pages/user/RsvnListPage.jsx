import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnCard from '../../components/user/RsvnCard';
import {
  TabBar,
  TabBtn,
  TabCount,
  COLOR,
} from '../../components/user/RsvnStyled';
import api from '../../../../app/api/axiosApi';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TABS = [
  { label: '전체', statuses: null },
  { label: '이용 예정', statuses: ['S'] },
  { label: '이용 완료', statuses: ['E'] },
  { label: '취소/거절', statuses: ['C', 'R'] },
];

const STATUS_LABEL = { S: '예약확정', E: '이용완료', C: '예약취소', R: '예약거절' };
const ACTION_MAP = { S: '취소/환불', E: '리뷰 작성', C: null, R: null };
const SPACE_ROUTE = { office: 'coworking-offices', workstay: 'workstays', station: 'stations' };

const toCardItem = (rsvn) => {
  const ci = dayjs(rsvn.checkIn);
  const co = dayjs(rsvn.checkOut);
  const diff = ci.diff(dayjs(), 'day');
  const dday = rsvn.status === 'S'
    ? (diff >= 0 ? `D-${diff}` : `D+${Math.abs(diff)}`)
    : null;

  const spaceRoute = rsvn.officeNo ? 'coworking-offices'
    : rsvn.workStayNo ? 'workstays'
    : rsvn.stationNo ? 'stations'
    : null;

  return {
    id: rsvn.no,
    type: rsvn.spaceType ?? '공간',
    status: STATUS_LABEL[rsvn.status] ?? rsvn.status,
    dday,
    title: rsvn.spaceName ?? `예약 ${rsvn.no}`,
    date: `${ci.format('M월 D일')} ~ ${co.format('M월 D일')}`,
    code: `SW-${String(rsvn.no).padStart(8, '0')}`,
    price: `${rsvn.amt?.toLocaleString()}원`,
    icon: spaceRoute === 'workstays' ? '🌲' : spaceRoute === 'coworking-offices' ? '🏢' : '🏠',
    action: ACTION_MAP[rsvn.status] ?? null,
    spaceType: null, // 카드 클릭 시 예약 상세로 이동
  };
};

function RsvnListPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [rsvns, setRsvns] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/reservation');
        setRsvns(res.data);
      } catch {
        setRsvns([]);
      }
    };
    fetch();
  }, []);

  const filtered = TABS[activeTab].statuses
    ? rsvns.filter((r) => TABS[activeTab].statuses.includes(r.status))
    : rsvns;

  const counts = TABS.map((tab) =>
    tab.statuses ? rsvns.filter((r) => tab.statuses.includes(r.status)).length : rsvns.length
  );

  return (
    <PageLayout
      title="예약 목록"
      description="내가 예약한 공간의 이용 현황을 확인하세요"
      maxWidth={960}
    >
      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn key={idx} $active={activeTab === idx} onClick={() => setActiveTab(idx)}>
            {tab.label}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: COLOR.gray400, fontSize: 14 }}>
          해당하는 예약이 없어요
        </div>
      )}

      <List>
        {filtered.map((rsvn) => (
          <RsvnCard key={rsvn.no} item={toCardItem(rsvn)} />
        ))}
      </List>
    </PageLayout>
  );
}

export default RsvnListPage;
