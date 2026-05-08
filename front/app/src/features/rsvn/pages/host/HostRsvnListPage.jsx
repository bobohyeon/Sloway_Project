import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  Card,
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
import { ApproveBtn } from '../../components/host/HostRsvnStyled';

const TABS = [
  { label: '전체', count: 5 },
  { label: '승인 대기', count: 1 },
  { label: '확정', count: 2 },
  { label: '이용 완료', count: 1 },
  { label: '취소', count: 1 },
];

const DUMMY = [
  {
    id: 1,
    type: '워크앤스테이',
    status: '확정',
    isNew: false,
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
    type: '코워킹오피스',
    status: '확정',
    isNew: false,
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
    type: '워크앤스테이',
    status: '승인 대기',
    isNew: true,
    guestName: '박민수',
    title: '청평 숲속 파인뷰',
    code: 'SW-20260424-000892',
    date: '2026.05.10 · 2박',
    guests: 3,
    price: '370,000원',
    icon: '🌲',
  },
  {
    id: 4,
    type: '숙소',
    status: '이용 완료',
    isNew: false,
    guestName: '김수현',
    title: '제주 돌담집 리트릿',
    code: 'SW-20260415-000412',
    date: '2026.04.15 · 2박',
    guests: 2,
    price: '444,000원',
    icon: '🌴',
  },
  {
    id: 5,
    type: '워크앤스테이',
    status: '취소',
    isNew: false,
    guestName: '정유리',
    title: '청평 숲속 파인뷰',
    code: 'SW-20260320-000218',
    date: '2026.03.20 · 2박',
    guests: 2,
    price: '330,000원',
    icon: '🌲',
  },
];

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
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
  &:focus {
    border-color: ${COLOR.sage};
  }
`;

const NewBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: #fff0e0;
  color: ${COLOR.orange};
`;

function HostRsvnListPage() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  return (
    <div>
      <StatCards>
        <StatCard>
          <StatLabel>전체 예약</StatLabel>
          <StatValue>5건</StatValue>
        </StatCard>
        <StatCard $accent={COLOR.orange}>
          <StatLabel>승인 대기</StatLabel>
          <StatValue $color={COLOR.orange}>1건</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>확정</StatLabel>
          <StatValue>2건</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>이번 달 매출</StatLabel>
          <StatValue $color={COLOR.terra} style={{ fontSize: 18 }}>
            3,420,000원
          </StatValue>
        </StatCard>
      </StatCards>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        <TabBar style={{ margin: 0, border: 'none' }}>
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
        <FilterRow>
          <Select>
            <option>전체 공간</option>
          </Select>
          <Select>
            <option>전체 기간</option>
          </Select>
          <SearchInput placeholder="예약자·예약번호" />
        </FilterRow>
      </div>

      {DUMMY.map((item) => (
        <Card
          key={item.id}
          style={{
            borderColor:
              item.status === '승인 대기' ? COLOR.orange : COLOR.gray200,
          }}
          onClick={() => navigate(`/host/reservation/list/${item.id}`)}
        >
          <CardRow>
            <Thumb>{item.icon}</Thumb>
            <CardBody>
              <TagRow>
                <RsvnStatusBadge type="type" label={item.type} />
                <RsvnStatusBadge type="status" label={item.status} />
                {item.isNew && <NewBadge>NEW</NewBadge>}
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
              {item.status === '승인 대기' ? (
                <div style={{ display: 'flex', gap: 4 }}>
                  <ApproveBtn $reject onClick={(e) => e.stopPropagation()}>
                    거절
                  </ApproveBtn>
                  <ApproveBtn onClick={(e) => e.stopPropagation()}>
                    승인
                  </ApproveBtn>
                </div>
              ) : (
                <BtnOutline
                  style={{ fontSize: 12, padding: '5px 12px' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  메시지
                </BtnOutline>
              )}
            </CardRight>
          </CardRow>
        </Card>
      ))}

      <Pagination>
        <PageBtn>‹</PageBtn>
        {[1, 2].map((p) => (
          <PageBtn key={p} $active={p === 1}>
            {p}
          </PageBtn>
        ))}
        <PageBtn>›</PageBtn>
      </Pagination>
    </div>
  );
}

export default HostRsvnListPage;
