import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  TabBar,
  TabBtn,
  TabCount,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  Pagination,
  PageBtn,
  COLOR,
} from '../../components/user/RsvnStyled';

// TODO: 관리자 전용 예약 목록 API 연동 — 현재 DUMMY 유지
const DUMMY = [
  { id: 1, code: 'SW-20260508-000847', type: '워크앤스테이', status: '확정', guest: '홍', guestName: '홍길동', hostName: '청평스테이', space: '청평 숲속 파인뷰', checkin: '2026.05.08', period: '2박', price: '326,500원', paidAt: '2026.04.24 14:32', guestColor: '#A8B89F' },
  { id: 2, code: 'SW-20260428-000523', type: '코워킹오피스', status: '확정', guest: '이', guestName: '이지은', hostName: '성수브릭', space: '성수 브릭라운지', checkin: '2026.04.28', period: '당일', price: '28,000원', paidAt: '2026.04.18', guestColor: '#7B9EA8' },
  { id: 3, code: 'SW-20260424-000892', type: '워크앤스테이', status: '승인 대기', guest: '박', guestName: '박민수', hostName: '청평스테이', space: '청평 숲속 파인뷰', checkin: '2026.05.10', period: '2박', price: '370,000원', paidAt: '방금 전', guestColor: '#C97D4C' },
  { id: 4, code: 'SW-20260415-000412', type: '숙소', status: '이용 완료', guest: '김', guestName: '김수현', hostName: '돌담집호스트', space: '제주 돌담집 리트릿', checkin: '2026.04.15', period: '2박', price: '444,000원', paidAt: '2026.04.10', guestColor: '#6B8E6B' },
  { id: 5, code: 'SW-20260320-000218', type: '워크앤스테이', status: '취소', guest: '최', guestName: '최민재', hostName: '남해올리브', space: '남해 올리브 팜스테이', checkin: '2026.03.20', period: '2박', price: '330,000원', paidAt: '2026.03.18', guestColor: '#A87B6B' },
];

const STATUS_TABS = ['전체', '승인 대기', '확정', '이용 완료', '취소'];

const FilterRow = styled.div`
  display: flex; gap: 8px; margin-bottom: 16px; align-items: center; flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 8px 12px; border: 1px solid ${COLOR.gray200}; border-radius: 8px; font-size: 13px; background: #fff; outline: none;
`;

const SearchInput = styled.input`
  flex: 1; padding: 8px 12px; border: 1px solid ${COLOR.gray200}; border-radius: 8px; font-size: 13px; outline: none; min-width: 180px;
`;

const SearchBtn = styled.button`
  padding: 8px 16px; background: ${COLOR.green}; color: #fff; border: none; border-radius: 8px;
  font-size: 13px; font-weight: 600; cursor: pointer; &:hover { background: #1a3a2a; }
`;

const Table = styled.table`
  width: 100%; border-collapse: collapse; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid ${COLOR.gray200};
`;

const Th = styled.th`
  padding: 11px 14px; font-size: 12px; font-weight: 600; color: ${COLOR.gray400}; text-align: left;
  border-bottom: 1px solid ${COLOR.gray200}; background: ${COLOR.gray100};
`;

const Tr = styled.tr`
  cursor: pointer;
  &:hover td { background: #fafafa; }
  &:not(:last-child) td { border-bottom: 1px solid #f0f0f0; }
`;

const Td = styled.td`padding: 14px; font-size: 13px; color: ${COLOR.black}; vertical-align: middle;`;

const Avatar = styled.div`
  width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 13px; color: #fff; background: ${({ $color }) => $color}; flex-shrink: 0;
`;

function AdminRsvnListPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const filtered = DUMMY
    .filter((i) => activeTab === 0 || i.status === STATUS_TABS[activeTab])
    .filter((i) => !keyword || i.guestName.includes(keyword) || i.hostName.includes(keyword) || i.code.includes(keyword));

  const counts = STATUS_TABS.map((tab, idx) =>
    idx === 0 ? DUMMY.length : DUMMY.filter((i) => i.status === tab).length
  );

  return (
    <PageLayout title="전체 예약 관리" description="모든 예약을 조회하고 문제 상황을 처리하세요" maxWidth={1200}>

      <StatCards>
        <StatCard><StatLabel>전체 예약</StatLabel><StatValue>{DUMMY.length}건</StatValue></StatCard>
        <StatCard><StatLabel>확정</StatLabel><StatValue $color={COLOR.green}>{counts[2]}건</StatValue></StatCard>
        <StatCard><StatLabel>승인 대기</StatLabel><StatValue $color={COLOR.orange}>{counts[1]}건</StatValue></StatCard>
        <StatCard><StatLabel>취소</StatLabel><StatValue $color={COLOR.red}>{counts[4]}건</StatValue></StatCard>
      </StatCards>

      <TabBar>
        {STATUS_TABS.map((tab, idx) => (
          <TabBtn key={idx} $active={activeTab === idx} onClick={() => setActiveTab(idx)}>
            {tab}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>

      <FilterRow>
        <Select><option>전체 유형</option><option>워크앤스테이</option><option>코워킹오피스</option><option>숙소</option></Select>
        <SearchInput placeholder="게스트·호스트·예약번호" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <SearchBtn>검색</SearchBtn>
      </FilterRow>

      <Table>
        <thead>
          <tr>
            <Th>예약번호</Th>
            <Th>게스트</Th>
            <Th>호스트 / 공간</Th>
            <Th>유형</Th>
            <Th>체크인</Th>
            <Th>기간</Th>
            <Th>금액</Th>
            <Th>결제일</Th>
            <Th>상태</Th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((item) => (
            <Tr key={item.id} onClick={() => navigate(`/admin/reservation/${item.id}`, { state: { rsvn: item } })}>
              <Td><span style={{ fontSize: 12, color: COLOR.gray400 }}>{item.code}</span></Td>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar $color={item.guestColor}>{item.guest}</Avatar>
                  {item.guestName}
                </div>
              </Td>
              <Td>
                <div style={{ fontWeight: 600 }}>{item.hostName}</div>
                <div style={{ fontSize: 11, color: COLOR.gray400 }}>{item.space}</div>
              </Td>
              <Td><RsvnStatusBadge type="type" label={item.type} /></Td>
              <Td>{item.checkin}</Td>
              <Td>{item.period}</Td>
              <Td style={{ fontWeight: 700 }}>{item.price}</Td>
              <Td style={{ fontSize: 12 }}>{item.paidAt}</Td>
              <Td><RsvnStatusBadge type="status" label={item.status} /></Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <PageBtn>‹</PageBtn>
        {[1, 2, 3].map((p) => <PageBtn key={p} $active={p === 1}>{p}</PageBtn>)}
        <PageBtn>›</PageBtn>
      </Pagination>
    </PageLayout>
  );
}

export default AdminRsvnListPage;
