import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
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

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
`;

const RightRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
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

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

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
  min-height: 80px;
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
  background: ${({ $type }) =>
    ({ confirmed: '#2D6A4F22', pending: '#E6510022', blocked: '#C0392B22' })[
      $type
    ]};
  color: ${({ $type }) =>
    ({ confirmed: '#2D6A4F', pending: '#E65100', blocked: '#C0392B' })[$type]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MoreBadge = styled.div`
  font-size: 10px;
  color: ${COLOR.gray400};
  padding: 1px 4px;
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

const WeekEvent = styled.div`
  font-size: 10px;
  font-weight: 600;
  padding: 3px 5px;
  border-radius: 4px;
  margin: 4px;
  background: ${({ $type }) =>
    ({ confirmed: '#2D6A4F22', pending: '#E6510022' })[$type]};
  color: ${({ $type }) =>
    ({ confirmed: '#2D6A4F', pending: '#E65100' })[$type]};
  cursor: pointer;
  &:hover {
    opacity: 0.75;
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

// ── 모달 ──────────────────────────────────────────────────
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

const Modal = styled.div`
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  width: 380px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 18px;
  color: ${COLOR.gray400};
  cursor: pointer;
  &:hover {
    color: ${COLOR.black};
  }
`;

const ModalItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${COLOR.gray200};
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.15s;
  &:hover {
    background: ${COLOR.greenLight};
    border-color: ${COLOR.sage};
  }
`;

// ── 더미 데이터 ───────────────────────────────────────────
const MONTHS = [
  { label: '2026년 4월', firstDay: 3, totalDays: 30 },
  { label: '2026년 5월', firstDay: 5, totalDays: 31 },
  { label: '2026년 6월', firstDay: 1, totalDays: 30 },
];

// 날짜별 예약 목록 { date: [{ id, name, title, type }] }
const EVENTS = {
  8: [{ id: 1, name: '홍길동', title: '청평 숲속 파인뷰', type: 'confirmed' }],
  9: [{ id: 1, name: '홍길동', title: '청평 숲속 파인뷰', type: 'confirmed' }],
  10: [
    { id: 1, name: '홍길동', title: '청평 숲속 파인뷰', type: 'confirmed' },
    { id: 2, name: '이지은', title: '성수 브릭라운지', type: 'confirmed' },
  ],
  15: [{ id: 3, name: '박민수', title: '청평 숲속 파인뷰', type: 'pending' }],
  17: [{ id: 4, name: '정유진', title: '청평 숲속 파인뷰', type: 'confirmed' }],
  18: [{ id: 4, name: '정유진', title: '청평 숲속 파인뷰', type: 'confirmed' }],
  22: [{ id: 5, name: '김민준', title: '성수 브릭라운지', type: 'confirmed' }],
  28: [{ id: 6, name: '이지은', title: '청평 숲속 파인뷰', type: 'confirmed' }],
  29: [{ id: 6, name: '이지은', title: '청평 숲속 파인뷰', type: 'confirmed' }],
};

const WEEKS = [
  { range: '5월 4일 ~ 10일' },
  { range: '5월 11일 ~ 17일' },
  { range: '5월 18일 ~ 24일' },
];

const WEEK_EVENTS = {
  0: {
    // 4~10일
    4: [],
    5: [],
    6: [],
    7: [],
    8: [{ id: 1, name: '홍길동', title: '청평 파인뷰', type: 'confirmed' }],
    9: [{ id: 1, name: '홍길동', title: '청평 파인뷰', type: 'confirmed' }],
    10: [
      { id: 1, name: '홍길동', title: '청평 파인뷰', type: 'confirmed' },
      { id: 2, name: '이지은', title: '성수 브릭', type: 'confirmed' },
    ],
  },
};

function HostRsvnCalendarPage() {
  const navigate = useNavigate();
  const [view, setView] = useState('month');
  const [monthIdx, setMonthIdx] = useState(1);
  const [weekIdx, setWeekIdx] = useState(0);
  const [slideDir, setSlideDir] = useState('none');
  const [modal, setModal] = useState(null); // { date, events }

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

  const handleCellClick = (date, evs) => {
    if (!evs || evs.length === 0) return;
    if (evs.length === 1) {
      navigate(`/host/reservation/list/${evs[0].id}`);
    } else {
      setModal({ date, events: evs });
    }
  };

  const week = WEEKS[weekIdx];
  const weekEvMap = WEEK_EVENTS[weekIdx] || {};
  const weekDays = [
    { label: `일 ${4 + weekIdx * 7}`, sun: true, dayKey: 4 + weekIdx * 7 },
    { label: `월 ${5 + weekIdx * 7}`, sun: false, dayKey: 5 + weekIdx * 7 },
    { label: `화 ${6 + weekIdx * 7}`, sun: false, dayKey: 6 + weekIdx * 7 },
    { label: `수 ${7 + weekIdx * 7}`, sun: false, dayKey: 7 + weekIdx * 7 },
    { label: `목 ${8 + weekIdx * 7}`, sun: false, dayKey: 8 + weekIdx * 7 },
    { label: `금 ${9 + weekIdx * 7}`, sun: false, dayKey: 9 + weekIdx * 7 },
    { label: `토 ${10 + weekIdx * 7}`, sat: true, dayKey: 10 + weekIdx * 7 },
  ];

  return (
    <PageLayout
      title="예약 달력"
      description="내 공간의 예약 현황을 달력으로 확인하세요"
      actions={
        <RightRow>
          <Select>
            <option>전체 공간</option>
            <option>청평 숲속 파인뷰</option>
          </Select>
          <ViewToggle>
            <ToggleBtn
              $active={view === 'month'}
              onClick={() => setView('month')}
            >
              월
            </ToggleBtn>
            <ToggleBtn
              $active={view === 'week'}
              onClick={() => setView('week')}
            >
              주
            </ToggleBtn>
          </ViewToggle>
        </RightRow>
      }
      maxWidth={1200}
    >

      <StatCards>
        <StatCard>
          <StatLabel>이번 달 예약</StatLabel>
          <StatValue $color={COLOR.terra}>14</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>가동률</StatLabel>
          <StatValue>52%</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>확정</StatLabel>
          <StatValue>11</StatValue>
        </StatCard>
        <StatCard $accent={COLOR.orange}>
          <StatLabel>대기</StatLabel>
          <StatValue $color={COLOR.orange}>3</StatValue>
        </StatCard>
      </StatCards>

      <SectionBox>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <CalNav onClick={() => (view === 'month' ? goMonth(-1) : goWeek(-1))}>
            ‹
          </CalNav>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {view === 'month' ? month.label : `2026년 ${week.range}`}
          </div>
          <CalNav onClick={() => (view === 'month' ? goMonth(1) : goWeek(1))}>
            ›
          </CalNav>
        </div>

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
                const shown = evs.slice(0, 2);
                const more = evs.length - shown.length;
                return (
                  <CalCell
                    key={idx}
                    $hasEvent={evs.length > 0}
                    onClick={() => handleCellClick(date, evs)}
                  >
                    {date && (
                      <>
                        <CalDate $today={date === 8} $sun={idx % 7 === 0}>
                          {date}
                        </CalDate>
                        {shown.map((ev, i) => (
                          <CalEvent key={i} $type={ev.type}>
                            {ev.name}
                          </CalEvent>
                        ))}
                        {more > 0 && <MoreBadge>+{more}명 더보기</MoreBadge>}
                      </>
                    )}
                  </CalCell>
                );
              })}
            </CalGrid>
          </>
        ) : (
          <WeekGrid $dir={slideDir}>
            {weekDays.map((d, i) => {
              const evs = weekEvMap[d.dayKey] || [];
              return (
                <WeekCol key={i}>
                  <WeekHead $sun={d.sun}>{d.label}</WeekHead>
                  <div style={{ padding: 4 }}>
                    {evs.map((ev, j) => (
                      <WeekEvent
                        key={j}
                        $type={ev.type}
                        onClick={() =>
                          evs.length === 1
                            ? navigate(`/host/reservation/list/${ev.id}`)
                            : setModal({ date: d.label, events: evs })
                        }
                      >
                        {ev.name}
                      </WeekEvent>
                    ))}
                  </div>
                </WeekCol>
              );
            })}
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
            이용 불가
          </LegendItem>
        </Legend>
      </SectionBox>

      {/* 예약자 목록 모달 */}
      {modal && (
        <Overlay onClick={() => setModal(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              <span>
                📅 {modal.date}일 예약 ({modal.events.length}건)
              </span>
              <CloseBtn onClick={() => setModal(null)}>✕</CloseBtn>
            </ModalTitle>
            {modal.events.map((ev, i) => (
              <ModalItem
                key={i}
                onClick={() => {
                  setModal(null);
                  navigate(`/host/reservation/list/${ev.id}`);
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: COLOR.sage,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {ev.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{ev.name}</div>
                  <div style={{ fontSize: 12, color: COLOR.gray400 }}>
                    {ev.title}
                  </div>
                </div>
                <span style={{ fontSize: 12, color: COLOR.green }}>
                  상세 보기 →
                </span>
              </ModalItem>
            ))}
          </Modal>
        </Overlay>
      )}
    </PageLayout>
  );
}

export default HostRsvnCalendarPage;
