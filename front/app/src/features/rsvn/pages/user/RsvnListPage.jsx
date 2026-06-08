import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnCard from '../../components/user/RsvnCard';
import {
  TabBar,
  TabBtn,
  TabCount,
  COLOR,
  Card,
} from '../../components/user/RsvnStyled';
import { findMyRsvns, cancelRsvn } from '../../api/rsvnApi';
import { Pagination } from '../../../pay_shared/components/Pagination';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

/* P 상태: 카드+버튼을 하나의 블록으로 묶어 이어보이게 */
const CardWithBtn = styled.div`
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid ${COLOR.gray200};

  ${Card} {
    border: none;
    border-radius: 0;
    margin-bottom: 0;
    box-shadow: none;
  }
`;

const BtnRow = styled.div`
  display: flex;
  gap: 0;
  border-top: 1px solid ${COLOR.gray200};
`;

const PayBtn = styled.button`
  flex: 1;
  padding: 12px;
  background: #2d6a4f;
  color: #fff;
  border: none;
  border-radius: 0;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #1a3a2a; }
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 12px;
  background: #f5f0eb;
  color: #8a4a2a;
  border: none;
  border-left: 1px solid ${COLOR.gray200};
  border-radius: 0;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  &:hover { background: #e8dfd0; }
`;

const TABS = [
  { label: '전체', statuses: null },
  { label: '결제대기', statuses: ['P'] },
  { label: '이용 예정', statuses: ['S'] },
  { label: '이용 완료', statuses: ['E'] },
  { label: '취소/거절', statuses: ['C', 'R'] },
];

const STATUS_LABEL = { P: '결제대기', S: '예약확정', E: '이용완료', C: '예약취소', R: '예약거절' };
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

const PAGE_SIZE = 10;

function RsvnListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [rsvns, setRsvns] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await findMyRsvns();
        setRsvns(data);
      } catch {
        setRsvns([]);
      }
    };
    fetch();
  }, []);

  const handleCancelP = async (rsvnNo) => {
    if (!window.confirm('결제대기 예약을 취소하시겠어요?')) return;
    try {
      await cancelRsvn(rsvnNo, null);
    } catch (e) {
      console.error('취소 API 실패:', e.response?.status, e.response?.data);
      alert(`취소에 실패했습니다. (${e.response?.status ?? '네트워크 오류'})`);
      return;
    }
    try {
      const data = await findMyRsvns();
      setRsvns(data);
    } catch {
      window.location.reload();
    }
  };

  const filtered = TABS[activeTab].statuses
    ? rsvns.filter((r) => TABS[activeTab].statuses.includes(r.status))
    : rsvns;

  const counts = TABS.map((tab) =>
    tab.statuses ? rsvns.filter((r) => tab.statuses.includes(r.status)).length : rsvns.length
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageLayout
      title="예약 목록"
      description="내가 예약한 공간의 이용 현황을 확인하세요"
      maxWidth={960}
    >
      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn key={idx} $active={activeTab === idx} onClick={() => { setActiveTab(idx); setPage(1); }}>
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
        {paged.map((rsvn) =>
          rsvn.status === 'P' ? (
            <CardWithBtn key={rsvn.no}>
              <RsvnCard item={toCardItem(rsvn)} />
              <BtnRow>
                <PayBtn onClick={() => navigate('/user/payment/checkout', { state: { rsvnNo: rsvn.no } })}>
                  결제하기
                </PayBtn>
                <CancelBtn onClick={() => handleCancelP(rsvn.no)}>
                  예약 취소
                </CancelBtn>
              </BtnRow>
            </CardWithBtn>
          ) : (
            <div key={rsvn.no}>
              <RsvnCard item={toCardItem(rsvn)} />
            </div>
          )
        )}
      </List>
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
      />
    </PageLayout>
  );
}

export default RsvnListPage;
