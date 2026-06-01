import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { findHostRsvns } from '../../api/rsvnApi';
import {
  SectionBox,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  COLOR,
} from '../../components/user/RsvnStyled';

const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const slideRight = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const ViewToggle = styled.div`display: flex; gap: 4px;`;

const ToggleBtn = styled.button`
  padding: 6px 14px; font-size: 12px; font-weight: 600; border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.green : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#555')};
  cursor: pointer;
`;

const CalHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;
`;

const CalNav = styled.button`
  width: 30px; height: 30px; border-radius: 50%;
  border: 1px solid ${COLOR.gray200}; background: #fff; cursor: pointer; font-size: 16px;
  &:hover { background: ${COLOR.gray100}; }
`;

const DayHeader = styled.div`display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 4px;`;

const DayLabel = styled.div`
  text-align: center; font-size: 12px; font-weight: 600; padding: 6px 0;
  color: ${({ $col }) => $col === 0 ? COLOR.red : $col === 6 ? COLOR.green : COLOR.gray400};
`;

const CalGrid = styled.div`
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px;
  animation: ${({ $dir }) =>
    $dir === 'left' ? css`${slideLeft} 280ms ease-out`
    : $dir === 'right' ? css`${slideRight} 280ms ease-out`
    : 'none'};
`;

const CalCell = styled.div`
  min-height: 72px; padding: 6px; border-radius: 6px;
  cursor: ${({ $hasEvent }) => ($hasEvent ? 'pointer' : 'default')};
  &:hover { background: ${({ $hasEvent }) => $hasEvent ? COLOR.greenLight : COLOR.cream}; }
`;

const CalDate = styled.div`
  font-size: 13px;
  font-weight: ${({ $today }) => ($today ? 700 : 400)};
  color: ${({ $col, $today }) => $today ? COLOR.green : $col === 0 ? COLOR.red : '#333'};
  margin-bottom: 3px;
`;

const CalEvent = styled.div`
  font-size: 10px; font-weight: 600; padding: 2px 5px; border-radius: 3px; margin-bottom: 2px;
  background: #EEF5EE; color: ${COLOR.green};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

const Legend = styled.div`display: flex; justify-content: center; gap: 20px; margin-top: 14px;`;

const LegendItem = styled.div`
  display: flex; align-items: center; gap: 5px; font-size: 12px; color: ${COLOR.gray600};
`;

const LegendDot = styled.div`
  width: 10px; height: 10px; border-radius: 2px; background: ${({ $color }) => $color};
`;

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function HostRsvnCalendarPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [view, setView] = useState('month');
  const [current, setCurrent] = useState(dayjs().startOf('month'));
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week'));
  const [slideDir, setSlideDir] = useState('none');

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

  // checkIn 날짜(일)를 키로 예약 이벤트 맵 생성
  const eventMap = {};
  list.forEach((item) => {
    if (!item.checkIn) return;
    const d = dayjs(item.checkIn);
    if (d.year() === current.year() && d.month() === current.month()) {
      const day = d.date();
      if (!eventMap[day]) eventMap[day] = [];
      eventMap[day].push({ title: `${item.guestName} · ${item.spaceName}`, no: item.no, rsvn: item });
    }
  });

  const thisMonthRsvns = list.filter((item) => {
    if (!item.checkIn) return false;
    const d = dayjs(item.checkIn);
    return d.year() === current.year() && d.month() === current.month();
  });
  const confirmedCount = thisMonthRsvns.filter((i) => {
    const s = typeof i.status === 'object' ? i.status?.name : i.status;
    return s === 'S';
  }).length;
  const doneCount = thisMonthRsvns.filter((i) => {
    const s = typeof i.status === 'object' ? i.status?.name : i.status;
    return s === 'E';
  }).length;

  // 가장 가까운 확정 예약
  const now = dayjs();
  const upcoming = list
    .filter((i) => {
      const s = typeof i.status === 'object' ? i.status?.name : i.status;
      return s === 'S' && i.checkIn && dayjs(i.checkIn).isAfter(now);
    })
    .sort((a, b) => dayjs(a.checkIn).diff(dayjs(b.checkIn)))[0];

  const goMonth = (dir) => {
    setSlideDir(dir > 0 ? 'left' : 'right');
    setTimeout(() => { setCurrent((c) => c.add(dir, 'month')); setSlideDir('none'); }, 50);
  };

  const goWeek = (dir) => {
    setSlideDir(dir > 0 ? 'left' : 'right');
    setTimeout(() => { setWeekStart((w) => w.add(dir * 7, 'day')); setSlideDir('none'); }, 50);
  };

  const firstDow = current.day();
  const daysInMonth = current.daysInMonth();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  return (
    <PageLayout
      title="예약 달력"
      description="내 공간의 예약 일정을 확인하세요"
      actions={
        <ViewToggle>
          <ToggleBtn $active={view === 'month'} onClick={() => setView('month')}>월</ToggleBtn>
          <ToggleBtn $active={view === 'week'} onClick={() => setView('week')}>주</ToggleBtn>
        </ViewToggle>
      }
      maxWidth={1200}
    >
      <StatCards>
        <StatCard><StatLabel>이번 달 예약</StatLabel><StatValue $color={COLOR.terra}>{thisMonthRsvns.length}건</StatValue></StatCard>
        <StatCard><StatLabel>확정</StatLabel><StatValue>{confirmedCount}건</StatValue></StatCard>
        <StatCard><StatLabel>완료</StatLabel><StatValue>{doneCount}건</StatValue></StatCard>
        <StatCard>
          <StatLabel>가장 가까운 일정</StatLabel>
          <StatValue $color={COLOR.green} style={{ fontSize: 16 }}>
            {upcoming ? dayjs(upcoming.checkIn).format('M/D') : '—'}
          </StatValue>
        </StatCard>
      </StatCards>

      <SectionBox>
        <CalHeader>
          <CalNav onClick={() => (view === 'month' ? goMonth(-1) : goWeek(-1))}>‹</CalNav>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {view === 'month'
              ? current.format('YYYY년 M월')
              : `${weekStart.format('M월 D일')} ~ ${weekStart.add(6, 'day').format('M월 D일')}`}
          </div>
          <CalNav onClick={() => (view === 'month' ? goMonth(1) : goWeek(1))}>›</CalNav>
        </CalHeader>

        {view === 'month' ? (
          <>
            <DayHeader>
              {DAYS.map((d, i) => <DayLabel key={d} $col={i}>{d}</DayLabel>)}
            </DayHeader>
            <CalGrid $dir={slideDir}>
              {cells.map((date, idx) => {
                const evs = date ? (eventMap[date] ?? []) : [];
                const isToday = date && current.date(date).isSame(dayjs(), 'day');
                return (
                  <CalCell key={idx} $hasEvent={evs.length > 0}
                    onClick={() => evs.length > 0 && navigate(`/host/reservation/list/${evs[0].no}`, { state: { rsvn: evs[0].rsvn } })}>
                    {date && (
                      <>
                        <CalDate $col={idx % 7} $today={isToday}>{date}</CalDate>
                        {evs.map((ev, i) => <CalEvent key={i}>{ev.title}</CalEvent>)}
                      </>
                    )}
                  </CalCell>
                );
              })}
            </CalGrid>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {weekDays.map((day, i) => (
              <div key={i} style={{ minHeight: 120, borderRadius: 8, border: `1px solid ${COLOR.gray200}`, overflow: 'hidden' }}>
                <div style={{ padding: 6, textAlign: 'center', fontSize: 12, fontWeight: 600, background: COLOR.gray100, color: i === 0 ? COLOR.red : COLOR.black, borderBottom: `1px solid ${COLOR.gray200}` }}>
                  {DAYS[day.day()]} {day.date()}
                </div>
              </div>
            ))}
          </div>
        )}

        <Legend>
          <LegendItem><LegendDot $color={COLOR.green} />확정</LegendItem>
          <LegendItem><LegendDot $color={COLOR.gray400} />완료</LegendItem>
        </Legend>
      </SectionBox>
    </PageLayout>
  );
}

export default HostRsvnCalendarPage;
