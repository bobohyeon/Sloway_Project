import { useState, useEffect } from 'react';
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
import { findAllRsvnsForAdmin, findRsvnStatsForAdmin, forceCancelForAdmin } from '../../api/rsvnApi';
import { getPageNumbers } from '../../../account/utils/pagination';

const STATUS_LABEL = { P: '결제대기', S: '확정', E: '완료', R: '거절', C: '취소' };
const STATUS_TABS = [
  { label: '전체', status: null },
  { label: '확정', status: 'S' },
  { label: '완료', status: 'E' },
  { label: '거절', status: 'R' },
  { label: '취소', status: 'C' },
];
const SPACE_TYPE_LABEL = { WORK_STAY: '워크앤스테이', OFFICE: '코워킹오피스', STATION: '숙소' };
const AVATAR_COLORS = ['#A8B89F', '#7B9EA8', '#C97D4C', '#6B8E6B', '#A87B6B', '#8B7BA8'];

const statusCode = (s) => (typeof s === 'object' ? s?.name ?? String(s) : s);
const formatCode = (no, createdAt) => {
  const d = createdAt ? String(createdAt).slice(0, 10).replaceAll('-', '') : '00000000';
  return `SW-${d}-${String(no).padStart(6, '0')}`;
};
const formatDate = (dt) => (dt ? String(dt).slice(0, 10).replaceAll('-', '.') : '');
const formatPeriod = (checkIn, checkOut, spaceType) => {
  if (!checkIn || !checkOut) return '';
  const ms = new Date(checkOut) - new Date(checkIn);
  if (spaceType === 'OFFICE') return `${Math.ceil(ms / (1000 * 60 * 60))}시간`;
  const nights = Math.round(ms / (1000 * 60 * 60 * 24));
  return nights === 0 ? '당일' : `${nights}박`;
};

const FilterRow = styled.div`
  display: flex; gap: 8px; margin-bottom: 16px; align-items: center; flex-wrap: wrap;
`;
const Select = styled.select`
  padding: 8px 12px; border: 1px solid ${COLOR.gray200}; border-radius: 8px; font-size: 13px; background: #fff; outline: none;
`;
const SearchInput = styled.input`
  flex: 1; padding: 8px 12px; border: 1px solid ${COLOR.gray200}; border-radius: 8px; font-size: 13px; outline: none; min-width: 180px;
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
const CancelBtn = styled.button`
  padding: 4px 10px; border-radius: 6px; border: 1px solid #fcc;
  background: #fff0f0; color: #e05555; font-size: 12px; font-weight: 600;
  cursor: pointer; white-space: nowrap;
  &:hover:not(:disabled) { background: #ffe0e0; }
  &:disabled { opacity: 0.35; cursor: not-allowed; }
`;

const PAGE_SIZE = 10;

function AdminRsvnListPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [rsvns, setRsvns] = useState([]);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [stats, setStats] = useState({});


  // 마운트 시 1회 — StatCards용 상태별 건수
  useEffect(() => {
    findRsvnStatsForAdmin().then(setStats).catch(() => {});
  }, []);

  useEffect(() => {
    const status = STATUS_TABS[activeTab].status; // 전체 탭이면 null
    findAllRsvnsForAdmin(page - 1, PAGE_SIZE, status)
      .then((data) => {
        setRsvns(data.content);
        setTotalElements(data.totalElements);
      })
      .catch(() => setRsvns([]));
  }, [page, activeTab]); // 페이지 또는 탭 바뀔 때마다 서버 재조회

  // status 필터는 서버가 처리 — 키워드 검색만 클라이언트에서 처리
  const filtered = rsvns.filter((i) =>
    !keyword ||
    (i.guestName ?? '').includes(keyword) ||
    (i.spaceName ?? '').includes(keyword) ||
    formatCode(i.no, i.createdAt).includes(keyword)
  );

  // TabBar 배지: stats에서 각 탭 건수 표시
  const statKey = { 0: 'TOTAL', 1: 'S', 2: 'E', 3: 'R', 4: 'C' };
  const counts = STATUS_TABS.map((_, idx) => stats[statKey[idx]] ?? null);

  // 서버 totalElements 기준으로 총 페이지 수 계산
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);
  // 서버가 이미 페이지 단위로 줬으므로 클라이언트 슬라이싱 불필요
  const paged = filtered;

  return (
    <PageLayout title="전체 예약 관리" description="모든 예약을 조회하고 문제 상황을 처리하세요" maxWidth={1200}>

      <StatCards>
        <StatCard onClick={() => { setActiveTab(0); setPage(1); }} style={{ cursor: 'pointer' }}>
          <StatLabel>전체 예약</StatLabel><StatValue>{stats.TOTAL ?? '-'}건</StatValue>
        </StatCard>
        <StatCard onClick={() => { setActiveTab(1); setPage(1); }} style={{ cursor: 'pointer' }}>
          <StatLabel>확정</StatLabel><StatValue $color={COLOR.green}>{stats.S ?? '-'}건</StatValue>
        </StatCard>
        <StatCard onClick={() => { setActiveTab(4); setPage(1); }} style={{ cursor: 'pointer' }}>
          <StatLabel>취소</StatLabel><StatValue $color={COLOR.red}>{stats.C ?? '-'}건</StatValue>
        </StatCard>
      </StatCards>

      <TabBar>
        {STATUS_TABS.map((tab, idx) => (
          <TabBtn key={idx} $active={activeTab === idx} onClick={() => { setActiveTab(idx); setPage(1); }}>
            {tab.label}
            {counts[idx] !== null && <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>}
          </TabBtn>
        ))}
      </TabBar>

      <FilterRow>
        <SearchInput
          placeholder="게스트명 · 공간명 · 예약번호"
          value={keyword}
          onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
        />
      </FilterRow>

      <Table>
        <thead>
          <tr>
            <Th>예약번호</Th>
            <Th>게스트</Th>
            <Th>공간</Th>
            <Th>유형</Th>
            <Th>체크인</Th>
            <Th>기간</Th>
            <Th>금액</Th>
            <Th>등록일</Th>
            <Th>상태</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {paged.map((item) => (
            <Tr key={item.no}>
              <Td><span style={{ fontSize: 12, color: COLOR.gray400 }}>{formatCode(item.no, item.createdAt)}</span></Td>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar $color={AVATAR_COLORS[item.no % AVATAR_COLORS.length]}>
                    {item.guestName?.[0]}
                  </Avatar>
                  {item.guestName}
                </div>
              </Td>
              <Td>{item.spaceName}</Td>
              <Td><RsvnStatusBadge type="type" label={SPACE_TYPE_LABEL[item.spaceType] ?? item.spaceType} /></Td>
              <Td>{formatDate(item.checkIn)}</Td>
              <Td>{formatPeriod(item.checkIn, item.checkOut, item.spaceType)}</Td>
              <Td style={{ fontWeight: 700 }}>{item.amt?.toLocaleString()}원</Td>
              <Td style={{ fontSize: 12 }}>{formatDate(item.createdAt)}</Td>
              <Td>
                <RsvnStatusBadge type="status" label={STATUS_LABEL[statusCode(item.status)] ?? statusCode(item.status)} />
                {item.refunded && <RsvnStatusBadge type="status" label="환불" />}
              </Td>
              <Td onClick={(e) => e.stopPropagation()}>
                <CancelBtn
                  disabled={['C', 'R'].includes(statusCode(item.status))}
                  onClick={() => {
                    if (!window.confirm(`예약 ${formatCode(item.no, item.createdAt)}을 강제취소 하시겠습니까?`)) return;
                    forceCancelForAdmin(item.no)
                      .then(() => {
                        // 취소 후 현재 페이지 재조회
                        const status = STATUS_TABS[activeTab].status;
                        findAllRsvnsForAdmin(page - 1, PAGE_SIZE, status)
                          .then((data) => { setRsvns(data.content); setTotalElements(data.totalElements); });
                        findRsvnStatsForAdmin().then(setStats);
                      })
                      .catch(() => alert('강제취소 실패. 다시 시도해주세요.'));
                  }}
                >
                  강제취소
                </CancelBtn>
              </Td>
            </Tr>
          ))}
          {paged.length === 0 && (
            <tr>
              <Td colSpan={10} style={{ textAlign: 'center', color: COLOR.gray400, padding: '40px 0' }}>
                조건에 맞는 예약이 없어요
              </Td>
            </tr>
          )}
        </tbody>
      </Table>

      {totalPages > 1 && (() => {
        const { pages, hasPrev, hasNext, prevBlockPage, nextBlockPage } = getPageNumbers(page, totalPages);
        return (
          <Pagination>
            <PageBtn disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>이전</PageBtn>
            {hasPrev && <PageBtn onClick={() => setPage(prevBlockPage)}>…</PageBtn>}
            {pages.map((p) => (
              <PageBtn key={p} $active={p === page} onClick={() => setPage(p)}>{p}</PageBtn>
            ))}
            {hasNext && <PageBtn onClick={() => setPage(nextBlockPage)}>…</PageBtn>}
            <PageBtn disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>다음</PageBtn>
          </Pagination>
        );
      })()}
    </PageLayout>
  );
}

export default AdminRsvnListPage;
