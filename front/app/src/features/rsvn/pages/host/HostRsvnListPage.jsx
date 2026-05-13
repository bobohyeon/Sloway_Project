import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  TabBar,
  TabBtn,
  TabCount,Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  Price,
  BtnOutline,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  Pagination,
  PageBtn,
  COLOR,
} from '../../components/user/RsvnStyled';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  flex: 1;
  min-width: 160px;
  &:focus {
    border-color: ${COLOR.sage};
  }
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
  &:hover {
    background: #1a3a2a;
  }
`;

const MsgBtn = styled.button`
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  cursor: pointer;
  &:hover {
    border-color: ${COLOR.sage};
  }
`;

// 상태별 탭 — 승인대기 없음
const TABS = [
  { label: '전체', status: null },
  { label: '확정', status: 'S' },
  { label: '완료', status: 'E' },
  { label: '거절', status: 'R' },
  { label: '취소', status: 'C' },
];

const STATUS_LABEL = { S: '확정', E: '완료', R: '거절', C: '취소' };
const STATUS_STYLE = {
  S: { bg: '#EEF5EE', color: '#2D6A4F' },
  E: { bg: '#F0F0F0', color: '#666' },
  R: { bg: '#FFF3E0', color: '#E65100' },
  C: { bg: '#FFF0F0', color: '#C0392B' },
};

const DUMMY = [
  {
    id: 1,
    status: 'S',
    type: '워크앤스테이',
    guestName: '홍길동',
    title: '청평 숲속 파인뷰',
    code: 'SW-20260508-000847',
    date: '2026.05.08 · 2박',
    guests: 2,
    price: '326,500원',
    icon: '🌲',
  },
  {
    id: 2,
    status: 'S',
    type: '오피스',
    guestName: '이지은',
    title: '성수 브릭라운지',
    code: 'SW-20260428-000523',
    date: '2026.04.28',
    guests: 1,
    price: '28,000원',
    icon: '🧱',
  },
  {
    id: 3,
    status: 'E',
    type: '숙소',
    guestName: '김수현',
    title: '제주 돌담집 리트릿',
    code: 'SW-20260415-000412',
    date: '2026.04.15 · 2박',
    guests: 2,
    price: '444,000원',
    icon: '🌴',
  },
  {
    id: 4,
    status: 'R',
    type: '워크앤스테이',
    guestName: '정유리',
    title: '청평 숲속 파인뷰',
    code: 'SW-20260320-000218',
    date: '2026.03.20 · 2박',
    guests: 2,
    price: '330,000원',
    icon: '🌲',
  },
  {
    id: 5,
    status: 'C',
    type: '워크앤스테이',
    guestName: '박민수',
    title: '청평 숲속 파인뷰',
    code: 'SW-20260301-000100',
    date: '2026.03.01 · 1박',
    guests: 3,
    price: '185,000원',
    icon: '🌲',
  },
];

function HostRsvnListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [spaceFilter, setSpaceFilter] = useState('전체 공간');
  const [periodFilter, setPeriodFilter] = useState('전체 기간');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const counts = TABS.map((tab, idx) =>
    idx === 0
      ? DUMMY.length
      : DUMMY.filter((i) => i.status === tab.status).length
  );

  const filtered = DUMMY.filter(
    (i) => activeTab === 0 || i.status === TABS[activeTab].status
  ).filter(
    (i) => !keyword || i.guestName.includes(keyword) || i.code.includes(keyword)
  );

  return (
    <PageLayout
      title="예약 목록"
      description="내 공간의 예약 현황을 관리하세요"
      maxWidth={1200}
    >

      {/* 상단 스탯 카드 — 클릭 시 필터링 or 이동 */}
      <StatCards>
        <StatCard style={{ cursor: 'pointer' }} onClick={() => setActiveTab(0)}>
          <StatLabel>전체 예약</StatLabel>
          <StatValue>{DUMMY.length}건</StatValue>
        </StatCard>
        <StatCard style={{ cursor: 'pointer' }} onClick={() => setActiveTab(1)}>
          <StatLabel>확정</StatLabel>
          <StatValue $color={COLOR.green}>{counts[1]}건</StatValue>
        </StatCard>
        <StatCard style={{ cursor: 'pointer' }} onClick={() => setActiveTab(2)}>
          <StatLabel>완료</StatLabel>
          <StatValue>{counts[2]}건</StatValue>
        </StatCard>
        <StatCard
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/host/settlement/dashboard')}
        >
          <StatLabel>이번 달 매출 →</StatLabel>
          <StatValue $color={COLOR.terra} style={{ fontSize: 18 }}>
            3,420,000원
          </StatValue>
        </StatCard>
      </StatCards>

      {/* 탭 */}
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

      {/* 필터 */}
      <FilterRow>
        <Select
          value={spaceFilter}
          onChange={(e) => setSpaceFilter(e.target.value)}
        >
          <option>전체 공간</option>
          <option>청평 숲속 파인뷰</option>
          <option>성수 브릭라운지</option>
        </Select>
        <Select
          value={periodFilter}
          onChange={(e) => setPeriodFilter(e.target.value)}
        >
          <option>전체 기간</option>
          <option>이번 달</option>
          <option>지난 3개월</option>
        </Select>
        <SearchInput
          placeholder="예약자명 · 예약번호"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
        />
        <SearchBtn onClick={() => setPage(1)}>검색</SearchBtn>
      </FilterRow>

      {/* 목록 */}
      {filtered.map((item) => {
        const st = STATUS_STYLE[item.status];
        return (
          <Card
            key={item.id}
            onClick={() => navigate(`/host/reservation/list/${item.id}`)}
          >
            <CardRow>
              <Thumb>{item.icon}</Thumb>
              <CardBody>
                <TagRow>
                  <RsvnStatusBadge type="type" label={item.type} />
                  {/* 상태 뱃지 직접 렌더 */}
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: 4,
                      background: st.bg,
                      color: st.color,
                    }}
                  >
                    {STATUS_LABEL[item.status]}
                  </span>
                </TagRow>
                <CardTitle>
                  {item.guestName} · {item.title}
                </CardTitle>
                <CardMeta>
                  <span>{item.code}</span>
                  <span>·</span>
                  <span>📅 {item.date}</span>
                  <span>·</span>
                  <span>👤 {item.guests}명</span>
                </CardMeta>
              </CardBody>
              <CardRight>
                <Price>{item.price}</Price>
                <MsgBtn
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/host/chat');
                  }}
                >
                  💬 메시지
                </MsgBtn>
              </CardRight>
            </CardRow>
          </Card>
        );
      })}

      {filtered.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px 0',
            color: COLOR.gray400,
            fontSize: 14,
          }}
        >
          조건에 맞는 예약이 없어요
        </div>
      )}

      <Pagination>
        <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</PageBtn>
        {[1, 2].map((p) => (
          <PageBtn key={p} $active={page === p} onClick={() => setPage(p)}>
            {p}
          </PageBtn>
        ))}
        <PageBtn onClick={() => setPage((p) => p + 1)}>›</PageBtn>
      </Pagination>
    </PageLayout>
  );
}

export default HostRsvnListPage;
