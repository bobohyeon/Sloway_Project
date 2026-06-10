import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import { findHostRsvns, rejectRsvn } from '../../api/rsvnApi';
import { Pagination } from '../../../pay_shared/components/Pagination';
import {
  TabBar,
  TabBtn,
  TabCount,
  Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  Price,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  COLOR,
} from '../../components/user/RsvnStyled';

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  flex: 1;
  min-width: 160px;
  &:focus { border-color: ${COLOR.sage}; }
`;

const SearchBtn = styled.button`
  padding: 8px 18px;
  border-radius: 8px;
  background: ${COLOR.green};
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover { background: #1a3a2a; }
`;

const MsgBtn = styled.button`
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  cursor: pointer;
  &:hover { border-color: ${COLOR.sage}; }
`;

const RejectBtn = styled.button`
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #f0a0a0;
  background: #fff;
  color: #c0392b;
  cursor: pointer;
  margin-top: 4px;
  &:hover { background: #fff0f0; }
`;

const TABS = [
  { label: '전체', status: null },
  { label: '결제대기', status: 'P' },
  { label: '확정', status: 'S' },
  { label: '완료', status: 'E' },
  { label: '거절', status: 'R' },
  { label: '취소', status: 'C' },
];

const STATUS_LABEL = { P: '결제대기', S: '확정', E: '완료', R: '거절', C: '취소' };
const STATUS_STYLE = {
  P: { bg: '#FFF9E6', color: '#B8860B' },
  S: { bg: '#EEF5EE', color: '#2D6A4F' },
  E: { bg: '#F0F0F0', color: '#666' },
  R: { bg: '#FFF3E0', color: '#E65100' },
  C: { bg: '#FFF0F0', color: '#C0392B' },
};

const SPACE_TYPE_ICON = { 워크앤스테이: '🌲', 오피스: '🧱', 숙소: '🌴' };

function HostRsvnListPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const data = await findHostRsvns();
        setList(data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  // status 값이 enum 객체로 올 수 있으므로 문자열 변환
  const statusCode = (item) => (typeof item.status === 'object' ? item.status?.name ?? item.status : item.status);

  const handleReject = async (e, item) => {
    e.stopPropagation();
    if (!window.confirm('예약을 거절하시겠어요?')) return;
    try {
      await rejectRsvn(item.no, item.payNo);
      const data = await findHostRsvns();
      setList(data);
    } catch {
      alert('거절 처리에 실패했습니다.');
    }
  };

  const filtered = list
    .filter((i) => activeTab === 0 || statusCode(i) === TABS[activeTab].status)
    .filter((i) => !keyword || (i.guestName ?? '').includes(keyword));

  const counts = TABS.map((tab, idx) =>
    idx === 0 ? list.length : list.filter((i) => statusCode(i) === tab.status).length
  );

  const totalPages = Math.ceil(filtered.length / 10);
  const paged = filtered.slice((page - 1) * 10, page * 10);

  const formatDate = (checkIn, checkOut) => {
    if (!checkIn) return '';
    const inStr = checkIn.slice(0, 10).replaceAll('-', '.');
    if (!checkOut) return inStr;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const nights = Math.round((outDate - inDate) / (1000 * 60 * 60 * 24));
    return nights > 0 ? `${inStr} · ${nights}박` : inStr;
  };

  return (
    <PageLayout
      title="예약 목록"
      description="내 공간의 예약 현황을 관리하세요"
      maxWidth={1200}
    >
      <StatCards>
        <StatCard style={{ cursor: 'pointer' }} onClick={() => setActiveTab(0)}>
          <StatLabel>전체 예약</StatLabel>
          <StatValue>{list.length}건</StatValue>
        </StatCard>
        <StatCard style={{ cursor: 'pointer' }} onClick={() => setActiveTab(2)}>
          <StatLabel>확정</StatLabel>
          <StatValue $color={COLOR.green}>{counts[2]}건</StatValue>
        </StatCard>
        <StatCard style={{ cursor: 'pointer' }} onClick={() => setActiveTab(3)}>
          <StatLabel>완료</StatLabel>
          <StatValue>{counts[3]}건</StatValue>
        </StatCard>
        <StatCard style={{ cursor: 'pointer' }} onClick={() => navigate('/host/settlement/dashboard')}>
          <StatLabel>이번 달 매출 →</StatLabel>
          <StatValue $color={COLOR.terra} style={{ fontSize: 18 }}>—</StatValue>
        </StatCard>
      </StatCards>

      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn key={idx} $active={activeTab === idx} onClick={() => { setActiveTab(idx); setPage(1); }}>
            {tab.label}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      <FilterRow>
        <SearchInput
          placeholder="예약자명 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <SearchBtn onClick={() => {}}>검색</SearchBtn>
      </FilterRow>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: COLOR.gray400, fontSize: 14 }}>
          조건에 맞는 예약이 없어요
        </div>
      )}

      {paged.map((item) => {
        const sc = statusCode(item);
        const st = STATUS_STYLE[sc] ?? { bg: '#f0f0f0', color: '#666' };
        const icon = SPACE_TYPE_ICON[item.spaceType] ?? '🏠';
        return (
          <Card
            key={item.no}
            onClick={() => navigate(`/host/reservation/list/${item.no}`, { state: { rsvn: item } })}
          >
            <CardRow>
              <Thumb>{icon}</Thumb>
              <CardBody>
                <TagRow>
                  <RsvnStatusBadge type="type" label={item.spaceType} />
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: st.bg, color: st.color }}>
                    {STATUS_LABEL[sc] ?? sc}
                  </span>
                </TagRow>
                <CardTitle>{item.guestName} · {item.spaceName}</CardTitle>
                <CardMeta>
                  <span>예약 #{item.no}</span>
                  <span>·</span>
                  <span>📅 {formatDate(item.checkIn, item.checkOut)}</span>
                  <span>·</span>
                  <span>👤 {item.count}명</span>
                </CardMeta>
              </CardBody>
              <CardRight>
                <Price>{item.amt?.toLocaleString()}원</Price>
                <MsgBtn onClick={(e) => { e.stopPropagation(); navigate('/host/chat'); }}>
                  💬 메시지
                </MsgBtn>
                {sc === 'S' && new Date(item.checkIn) > new Date() && (
                  <RejectBtn onClick={(e) => handleReject(e, item)}>
                    거절
                  </RejectBtn>
                )}
              </CardRight>
            </CardRow>
          </Card>
        );
      })}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onChange={(p) => { setPage(p); window.scrollTo(0, 0); }}
      />
    </PageLayout>
  );
}

export default HostRsvnListPage;
