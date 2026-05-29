import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import styled, { css, keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useNavigate } from 'react-router-dom';
import {
  SectionBox,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  COLOR,
} from '../../components/user/RsvnStyled';
import { findMyRsvns } from '../../api/rsvnApi';


const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateX(0); }
`;
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
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? COLOR.green : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.green : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#555')};
  cursor: pointer;
`;

const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const CalNav = styled.button`
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  &:hover { background: ${COLOR.gray100}; }
`;

const DayHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 4px;
`;

const DayLabel = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ $col }) => $col === 0 ? COLOR.red : $col === 6 ? COLOR.green : COLOR.gray400};
  padding: 6px 0;
`;

const CalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  animation: ${({ $dir }) =>
    $dir === 'left' ? css`${slideLeft} 280ms ease-out`
    : $dir === 'right' ? css`${slideRight} 280ms ease-out`
    : 'none'};
`;

const CalCell = styled.div`
  min-height: 72px;
  padding: 6px;
  border-radius: 6px;
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
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 3px;
  margin-bottom: 2px;
  background: ${({ $status }) => STATUS_COLOR[$status] + '22'};
  color: ${({ $status }) => STATUS_COLOR[$status]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  animation: ${({ $dir }) =>
    $dir === 'left' ? css`${slideLeft} 280ms ease-out`
    : $dir === 'right' ? css`${slideRight} 280ms ease-out`
    : 'none'};
`;

const WeekCol = styled.div`
  min-height: 120px;
  border-radius: 8px;
  border: 1px solid ${COLOR.gray200};
  overflow: hidden;
`;

const WeekHead = styled.div`
  padding: 6px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  background: ${COLOR.gray100};
  color: ${({ $col }) => $col === 0 ? COLOR.red : COLOR.black};
  border-bottom: 1px solid ${COLOR.gray200};
`;

const WeekBody = styled.div`padding: 6px;`;

const WeekEvent = styled.div`
  font-size: 10px;
  font-weight: 600;
  padding: 3px 5px;
  border-radius: 4px;
  margin-bottom: 3px;
  background: ${({ $status }) => STATUS_COLOR[$status] + '22'};
  color: ${({ $status }) => STATUS_COLOR[$status]};
  cursor: pointer;
  &:hover { opacity: 0.8; }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 14px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${COLOR.gray600};
`;

const LegendDot = styled.div`
  width: 10px; height: 10px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;

const STATUS_COLOR = { S: '#2D6A4F', E: '#888', C: '#C0392B', R: '#C0392B' };
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function RsvnCalendarPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('month');
  const [current, setCurrent] = useState(dayjs().startOf('month'));
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week'));
  const [slideDir, setSlideDir] = useState('none');
  const [rsvns, setRsvns] = useState([]);

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

  // 해당 날짜에 걸쳐있는 예약 목록 반환
  const getEventsForDate = (date) =>
    rsvns.filter((r) => {
      const ci = dayjs(r.checkIn).startOf('day');
      const co = dayjs(r.checkOut).startOf('day');
      return !date.isBefore(ci) && !date.isAfter(co);
    });

  const goMonth = (dir) => {
    setSlideDir(dir > 0 ? 'left' : 'right');
    setTimeout(() => { setCurrent((c) => c.add(dir, 'month')); setSlideDir('none'); }, 50);
  };

  const goWeek = (dir) => {
    setSlideDir(dir > 0 ? 'left' : 'right');
    setTimeout(() => { setWeekStart((w) => w.add(dir * 7, 'day')); setSlideDir('none'); }, 50);
  };

  // 월 달력 셀 계산
  const firstDow = current.day(); // 첫째날 요일(0=일)
  const daysInMonth = current.daysInMonth();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  // 주 달력 7일 계산
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart.add(i, 'day'));

  // 이번 달 예약 통계
  const thisMonthRsvns = rsvns.filter((r) => dayjs(r.checkIn).isSame(current, 'month'));
  const nearestRsvn = rsvns
    .filter((r) => r.status === 'S' && dayjs(r.checkIn).isAfter(dayjs()))
    .sort((a, b) => dayjs(a.checkIn).valueOf() - dayjs(b.checkIn).valueOf())[0];

  return (
    <PageLayout
      title="예약 달력"
      description="내 예약 일정을 달력으로 확인하세요"
      actions={
        <ViewToggle>
          <ToggleBtn $active={view === 'month'} onClick={() => setView('month')}>월</ToggleBtn>
          <ToggleBtn $active={view === 'week'} onClick={() => setView('week')}>주</ToggleBtn>
        </ViewToggle>
      }
      maxWidth={1200}
    >
      <StatCards>
        <StatCard>
          <StatLabel>이번 달 예약</StatLabel>
          <StatValue $color={COLOR.terra}>{thisMonthRsvns.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>확정</StatLabel>
          <StatValue>{thisMonthRsvns.filter((r) => r.status === 'S').length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>이용완료</StatLabel>
          <StatValue>{thisMonthRsvns.filter((r) => r.status === 'E').length}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>가장 가까운 일정</StatLabel>
          <StatValue $color={COLOR.green} style={{ fontSize: 16 }}>
            {nearestRsvn ? `★ ${dayjs(nearestRsvn.checkIn).format('M/D')}` : '-'}
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
                const cellDate = date ? current.date(date) : null;
                const evs = cellDate ? getEventsForDate(cellDate) : [];
                const isToday = cellDate?.isSame(dayjs(), 'day');
                return (
                  <CalCell
                    key={idx}
                    $hasEvent={evs.length > 0}
                    onClick={() => evs.length > 0 && navigate(`/user/reservation/${evs[0].no}`)}
                  >
                    {date && (
                      <>
                        <CalDate $col={idx % 7} $today={isToday}>{date}</CalDate>
                        {evs.map((ev) => (
                          <CalEvent key={ev.no} $status={ev.status}>
                            {ev.spaceName ?? `예약${ev.no}`}
                          </CalEvent>
                        ))}
                      </>
                    )}
                  </CalCell>
                );
              })}
            </CalGrid>
          </>
        ) : (
          <>
            <WeekGrid $dir={slideDir}>
              {weekDays.map((day, i) => {
                const evs = getEventsForDate(day);
                return (
                  <WeekCol key={i}>
                    <WeekHead $col={i}>
                      {DAYS[day.day()]} {day.date()}
                    </WeekHead>
                    <WeekBody>
                      {evs.map((ev) => (
                        <WeekEvent
                          key={ev.no}
                          $status={ev.status}
                          onClick={() => navigate(`/user/reservation/${ev.no}`)}
                        >
                          {ev.spaceName ?? `예약${ev.no}`}
                        </WeekEvent>
                      ))}
                    </WeekBody>
                  </WeekCol>
                );
              })}
            </WeekGrid>
          </>
        )}

        <Legend>
          <LegendItem><LegendDot $color={COLOR.green} />확정</LegendItem>
          <LegendItem><LegendDot $color={COLOR.gray400} />이용완료</LegendItem>
          <LegendItem><LegendDot $color={COLOR.red} />취소/거절</LegendItem>
        </Legend>
      </SectionBox>
    </PageLayout>
  );
}

export default RsvnCalendarPage;
