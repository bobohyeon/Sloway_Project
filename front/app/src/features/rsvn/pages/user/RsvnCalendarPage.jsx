import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  PageTitle,
  PageSub,
  SectionBox,
  StatCards,
  StatCard,
  StatLabel,
  StatValue,
  COLOR,
} from '../../components/user/RsvnStyled';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// 달력 슬라이드 애니메이션
const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideRight = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  animation: ${fadeInUp} 480ms ease-out both;
`;

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const EVENTS = {
  8: [{ title: '청평 숲속 파인뷰', type: 'confirmed', id: 1 }],
  9: [{ title: '청평 숲속 파인뷰', type: 'confirmed', id: 1 }],
  10: [{ title: '청평 숲속 파인뷰', type: 'confirmed', id: 1 }],
  15: [{ title: '성수 브릭라운지', type: 'pending', id: 2 }],
  22: [{ title: '강릉 바다향', type: 'confirmed', id: 3 }],
  28: [{ title: '제주 돌담집', type: 'confirmed', id: 4 }],
  29: [{ title: '제주 돌담집', type: 'confirmed', id: 4 }],
};
const EVENT_COLOR = { confirmed: '#2D6A4F', pending: '#E65100' };

// 2026.05 기준 — 백엔드 연결 시 dayjs로 교체
const MONTHS = [
  { label: '2026년 4월', firstDay: 3, totalDays: 30 },
  { label: '2026년 5월', firstDay: 5, totalDays: 31 },
  { label: '2026년 6월', firstDay: 1, totalDays: 30 },
];

const WEEK_DAYS = [
  { label: '일 4', sun: true, events: [] },
  { label: '월 5', sun: false, events: [] },
  { label: '화 6', sun: false, events: [] },
  { label: '수 7', sun: false, events: [] },
  {
    label: '목 8',
    sun: false,
    events: [{ id: 1, title: '청평 파인뷰', type: 'confirmed' }],
  },
  {
    label: '금 9',
    sun: false,
    events: [{ id: 1, title: '청평 파인뷰', type: 'confirmed' }],
  },
  {
    label: '토 10',
    sat: true,
    events: [{ id: 1, title: '청평 파인뷰', type: 'confirmed' }],
  },
];

const WEEKS = [
  { range: '5월 4일 ~ 10일', days: WEEK_DAYS },
  {
    range: '5월 11일 ~ 17일',
    days: WEEK_DAYS.map((d) => ({ ...d, events: [] })),
  },
  {
    range: '5월 18일 ~ 24일',
    days: WEEK_DAYS.map((d) => ({ ...d, events: [] })),
  },
];

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 4px;
`;

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
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid ${COLOR.gray200};
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.15s;
  &:hover {
    background: ${COLOR.gray100};
  }
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
  color: ${({ $sun }) =>
    $sun === true ? COLOR.red : $sun === false ? COLOR.green : COLOR.gray400};
  padding: 6px 0;
`;

const CalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  animation: ${({ $dir }) =>
    $dir === 'left'
      ? css`
          ${slideLeft} 280ms ease-out
        `
      : $dir === 'right'
        ? css`
            ${slideRight} 280ms ease-out
          `
        : 'none'};
`;

const CalCell = styled.div`
  min-height: 72px;
  padding: 6px;
  border-radius: 6px;
  cursor: ${({ $hasEvent }) => ($hasEvent ? 'pointer' : 'default')};
  &:hover {
    background: ${({ $hasEvent }) =>
      $hasEvent ? COLOR.greenLight : COLOR.cream};
  }
`;

const CalDate = styled.div`
  font-size: 13px;
  font-weight: ${({ $today }) => ($today ? 700 : 400)};
  color: ${({ $sun, $today }) =>
    $today ? COLOR.green : $sun ? COLOR.red : '#333'};
  margin-bottom: 3px;
`;

const CalEvent = styled.div`
  font-size: 10px;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 3px;
  margin-bottom: 2px;
  background: ${({ $type }) => EVENT_COLOR[$type] + '22'};
  color: ${({ $type }) => EVENT_COLOR[$type]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 주 뷰
const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  animation: ${({ $dir }) =>
    $dir === 'left'
      ? css`
          ${slideLeft} 280ms ease-out
        `
      : $dir === 'right'
        ? css`
            ${slideRight} 280ms ease-out
          `
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
  color: ${({ $sun }) => ($sun ? COLOR.red : COLOR.black)};
  border-bottom: 1px solid ${COLOR.gray200};
`;

const WeekBody = styled.div`
  padding: 6px;
`;

const WeekEvent = styled.div`
  font-size: 10px;
  font-weight: 600;
  padding: 3px 5px;
  border-radius: 4px;
  margin-bottom: 3px;
  background: ${({ $type }) => EVENT_COLOR[$type] + '22'};
  color: ${({ $type }) => EVENT_COLOR[$type]};
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
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
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;

function RsvnCalendarPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('month');
  const [monthIdx, setMonthIdx] = useState(1); // 2026년 5월 기본
  const [weekIdx, setWeekIdx] = useState(0);
  const [slideDir, setSlideDir] = useState('none');

  const month = MONTHS[monthIdx];
  const cells = [
    ...Array(month.firstDay).fill(null),
    ...Array.from({ length: month.totalDays }, (_, i) => i + 1),
  ];

  const goMonth = (dir) => {
    const next = monthIdx + dir;
    if (next < 0 || next >= MONTHS.length) return;
    setSlideDir(dir > 0 ? 'left' : 'right');
    setTimeout(() => {
      setMonthIdx(next);
      setSlideDir('none');
    }, 50);
  };

  const goWeek = (dir) => {
    const next = weekIdx + dir;
    if (next < 0 || next >= WEEKS.length) return;
    setSlideDir(dir > 0 ? 'left' : 'right');
    setTimeout(() => {
      setWeekIdx(next);
      setSlideDir('none');
    }, 50);
  };

  const week = WEEKS[weekIdx];

  return (
    <Page>
      <HeaderRow>
        <div>
          <PageTitle>예약 달력</PageTitle>
          <PageSub style={{ margin: 0 }}>
            내 예약 일정을 달력으로 확인하세요
          </PageSub>
        </div>
        <ViewToggle>
          <ToggleBtn
            $active={view === 'month'}
            onClick={() => setView('month')}
          >
            월
          </ToggleBtn>
          <ToggleBtn $active={view === 'week'} onClick={() => setView('week')}>
            주
          </ToggleBtn>
        </ViewToggle>
      </HeaderRow>

      <StatCards>
        <StatCard>
          <StatLabel>이번 달 예약</StatLabel>
          <StatValue $color={COLOR.terra}>4</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>확정</StatLabel>
          <StatValue>3</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>대기</StatLabel>
          <StatValue>1</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>가장 가까운 일정</StatLabel>
          <StatValue $color={COLOR.green} style={{ fontSize: 16 }}>
            ★ 5/8
          </StatValue>
        </StatCard>
      </StatCards>
      <SectionBox>
        <CalHeader>
          <CalNav onClick={() => (view === 'month' ? goMonth(-1) : goWeek(-1))}>
            ‹
          </CalNav>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {view === 'month' ? month.label : `2026년 ${week.range}`}
          </div>
          <CalNav onClick={() => (view === 'month' ? goMonth(1) : goWeek(1))}>
            ›
          </CalNav>
        </CalHeader>

        {view === 'month' ? (
          <>
            <DayHeader>
              {DAYS.map((d, i) => (
                <DayLabel
                  key={d}
                  $sun={i === 0 ? true : i === 6 ? false : undefined}
                >
                  {d}
                </DayLabel>
              ))}
            </DayHeader>
            <CalGrid $dir={slideDir}>
              {cells.map((date, idx) => {
                const evs = date ? EVENTS[date] || [] : [];
                return (
                  <CalCell
                    key={idx}
                    $hasEvent={evs.length > 0}
                    onClick={() =>
                      evs.length > 0 &&
                      navigate(`/user/reservation/${evs[0].id}`)
                    }
                  >
                    {date && (
                      <>
                        <CalDate $today={date === 8} $sun={idx % 7 === 0}>
                          {date}
                        </CalDate>
                        {evs.map((ev, i) => (
                          <CalEvent key={i} $type={ev.type}>
                            {ev.title}
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
          <WeekGrid $dir={slideDir}>
            {week.days.map((d, i) => (
              <WeekCol key={i}>
                <WeekHead $sun={d.sun}>{d.label}</WeekHead>
                <WeekBody>
                  {d.events.map((ev, j) => (
                    <WeekEvent
                      key={j}
                      $type={ev.type}
                      onClick={() => navigate(`/user/reservation/${ev.id}`)}
                    >
                      {ev.title}
                    </WeekEvent>
                  ))}
                </WeekBody>
              </WeekCol>
            ))}
          </WeekGrid>
        )}

        <Legend>
          <LegendItem>
            <LegendDot $color={COLOR.green} />
            확정
          </LegendItem>
          <LegendItem>
            <LegendDot $color={COLOR.orange} />
            대기
          </LegendItem>
          <LegendItem>
            <LegendDot $color={COLOR.red} />
            취소됨
          </LegendItem>
        </Legend>
      </SectionBox>
    </Page>
  );
}

export default RsvnCalendarPage;
