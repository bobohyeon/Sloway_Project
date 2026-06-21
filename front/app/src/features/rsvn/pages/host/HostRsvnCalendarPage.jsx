import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { findHostRsvns } from '../../api/rsvnApi';
import { findHostBlackouts } from '../../api/blackoutApi';
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

// 예약: 초록 / 블랙아웃: 주황
const CalEvent = styled.div`
  font-size: 10px; font-weight: 600; padding: 2px 5px; border-radius: 3px; margin-bottom: 2px;
  background: ${({ $type }) => $type === 'blackout' ? '#FFF3E0' : '#EEF5EE'};
  color: ${({ $type }) => $type === 'blackout' ? '#E65100' : COLOR.green};
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
`;

const MoreBtn = styled.div`
  font-size: 10px; padding: 2px 5px; border-radius: 3px; margin-top: 1px;
  background: ${COLOR.gray100}; color: ${COLOR.gray600};
  cursor: pointer; text-align: center;
  &:hover { background: ${COLOR.gray200}; }
`;

const Legend = styled.div`display: flex; justify-content: center; gap: 20px; margin-top: 14px;`;

const LegendItem = styled.div`
  display: flex; align-items: center; gap: 5px; font-size: 12px; color: ${COLOR.gray600};
`;

const LegendDot = styled.div`
  width: 10px; height: 10px; border-radius: 2px; background: ${({ $color }) => $color};
`;

// 모달
const ModalOverlay = styled.div`
  position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000;
  display: flex; align-items: center; justify-content: center;
`;

const ModalBox = styled.div`
  background: #fff; border-radius: 16px; padding: 24px;
  min-width: 280px; max-width: 360px; width: 90%;
  max-height: 70vh; overflow-y: auto;
`;

const ModalTitle = styled.div`
  font-size: 15px; font-weight: 700; margin-bottom: 16px; color: #333;
`;

const ModalItem = styled.div`
  padding: 10px 14px; margin-bottom: 8px; border-radius: 8px; font-size: 13px;
  background: ${({ $type }) => $type === 'blackout' ? '#FFF3E0' : '#EEF5EE'};
  color: ${({ $type }) => $type === 'blackout' ? '#E65100' : COLOR.green};
  cursor: ${({ $type }) => $type === 'rsvn' ? 'pointer' : 'default'};
  font-weight: 600;
  &:hover { opacity: ${({ $type }) => $type === 'rsvn' ? 0.75 : 1}; }
`;

const ModalClose = styled.button`
  display: block; width: 100%; margin-top: 12px;
  padding: 8px; border-radius: 8px; border: 1px solid ${COLOR.gray200};
  background: #fff; font-size: 13px; cursor: pointer;
  &:hover { background: ${COLOR.gray100}; }
`;

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const REASON_LABEL = { M: '정비·보수', C: '청소', P: '개인이용', E: '기타' };

function HostRsvnCalendarPage() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [blackouts, setBlackouts] = useState([]);
  const [view, setView] = useState('month');
  const [current, setCurrent] = useState(dayjs().startOf('month'));
  const [weekStart, setWeekStart] = useState(dayjs().startOf('week'));
  const [slideDir, setSlideDir] = useState('none');
  const [modalInfo, setModalInfo] = useState(null); // { dateLabel, evs }

  useEffect(() => {
    async function load() {
      try {
        const [rsvns, bos] = await Promise.all([findHostRsvns(), findHostBlackouts()]);
        setList(rsvns);
        setBlackouts(bos);
      } catch (e) {
        console.error(e);
        alert('일정을 불러오지 못했습니다.');
      }
    }
    load();
  }, []);

  // 예약 + 블랙아웃을 날짜별로 합쳐 이벤트 맵 생성
  const buildEventMap = () => {
    const map = {};

    list.forEach((item) => {
      if (!item.checkIn) return;
      const s = typeof item.status === 'object' ? item.status?.name : item.status;
      if (s !== 'S' && s !== 'E') return;
      const d = dayjs(item.checkIn);
      if (d.year() === current.year() && d.month() === current.month()) {
        const day = d.date();
        if (!map[day]) map[day] = [];
        map[day].push({ type: 'rsvn', title: `${item.guestName} · ${item.spaceName}`, no: item.no, data: item });
      }
    });

    // 블랙아웃은 startDate~endDate 범위의 모든 날에 표시
    blackouts.forEach((b) => {
      if (!b.startDate) return;
      let d = dayjs(b.startDate).startOf('day');
      const end = dayjs(b.endDate).startOf('day');
      while (!d.isAfter(end)) {
        if (d.year() === current.year() && d.month() === current.month()) {
          const day = d.date();
          if (!map[day]) map[day] = [];
          map[day].push({ type: 'blackout', title: `🚫 ${b.title} (${REASON_LABEL[b.reasonType] ?? b.reasonType})`, no: b.no, data: b });
        }
        d = d.add(1, 'day');
      }
    });

    return map;
  };

  const eventMap = buildEventMap();

  // 주별 뷰: 특정 날짜의 예약 + 블랙아웃 합쳐서 반환
  const getWeekEvents = (day) => {
    const rsvnEvs = list
      .filter((item) => {
        if (!item.checkIn) return false;
        const s = typeof item.status === 'object' ? item.status?.name : item.status;
        if (s !== 'S' && s !== 'E') return false;
        return dayjs(item.checkIn).isSame(day, 'day');
      })
      .map((item) => ({ type: 'rsvn', title: `${item.guestName} · ${item.spaceName}`, no: item.no, data: item }));

    const blackoutEvs = blackouts
      .filter((b) => {
        if (!b.startDate) return false;
        const start = dayjs(b.startDate).startOf('day');
        const end = dayjs(b.endDate).startOf('day');
        const d = day.startOf('day');
        return !d.isBefore(start) && !d.isAfter(end);
      })
      .map((b) => ({ type: 'blackout', title: `🚫 ${b.title}`, no: b.no, data: b }));

    return [...rsvnEvs, ...blackoutEvs];
  };

  const confirmedCount = list.filter((i) => {
    const s = typeof i.status === 'object' ? i.status?.name : i.status;
    return s === 'S';
  }).length;
  const doneCount = list.filter((i) => {
    const s = typeof i.status === 'object' ? i.status?.name : i.status;
    return s === 'E';
  }).length;

  const goMonth = (dir) => {
    setSlideDir(dir > 0 ? 'left' : 'right');
    setTimeout(() => { setCurrent((c) => c.add(dir, 'month')); setSlideDir('none'); }, 50);
  };

  const goWeek = (dir) => {
    setSlideDir(dir > 0 ? 'left' : 'right');
    setTimeout(() => { setWeekStart((w) => w.add(dir * 7, 'day')); setSlideDir('none'); }, 50);
  };

  const openModal = (e, dateLabel, evs) => {
    e.stopPropagation();
    setModalInfo({ dateLabel, evs });
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
        {/* 전체 예약 = 확정(S)+완료(E)만. 결제대기·취소·거절 제외 (어드민·목록 통계와 동일 기준) */}
        <StatCard><StatLabel>전체 예약</StatLabel><StatValue $color={COLOR.terra}>{confirmedCount + doneCount}건</StatValue></StatCard>
        <StatCard><StatLabel>확정</StatLabel><StatValue>{confirmedCount}건</StatValue></StatCard>
        <StatCard><StatLabel>완료</StatLabel><StatValue>{doneCount}건</StatValue></StatCard>
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
                const dateLabel = date ? current.date(date).format('M월 D일') : '';
                const visible = evs.slice(0, 4);
                const hiddenCount = evs.length - 4;
                return (
                  <CalCell key={idx} $hasEvent={evs.length > 0}
                    onClick={(e) => evs.length > 0 && openModal(e, dateLabel, evs)}>
                    {date && (
                      <>
                        <CalDate $col={idx % 7} $today={isToday}>{date}</CalDate>
                        {visible.map((ev, i) => (
                          <CalEvent key={i} $type={ev.type}>{ev.title}</CalEvent>
                        ))}
                        {hiddenCount > 0 && (
                          <MoreBtn onClick={(e) => openModal(e, dateLabel, evs)}>
                            +{hiddenCount} 더보기
                          </MoreBtn>
                        )}
                      </>
                    )}
                  </CalCell>
                );
              })}
            </CalGrid>
          </>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {weekDays.map((day, i) => {
              const evs = getWeekEvents(day);
              const isToday = day.isSame(dayjs(), 'day');
              const dateLabel = day.format('M월 D일');
              const visible = evs.slice(0, 4);
              const hiddenCount = evs.length - 4;
              return (
                <div key={i} style={{ minHeight: 120, borderRadius: 8, border: `1px solid ${isToday ? COLOR.green : COLOR.gray200}`, overflow: 'hidden' }}>
                  <div style={{ padding: 6, textAlign: 'center', fontSize: 12, fontWeight: 600, background: isToday ? COLOR.greenLight : COLOR.gray100, color: i === 0 ? COLOR.red : COLOR.black, borderBottom: `1px solid ${COLOR.gray200}` }}>
                    {DAYS[day.day()]} {day.date()}
                  </div>
                  <div style={{ padding: 4 }}>
                    {visible.map((ev, j) => (
                      <CalEvent key={j} $type={ev.type} style={{ cursor: ev.type === 'rsvn' ? 'pointer' : 'default' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          ev.type === 'rsvn'
                            ? navigate(`/host/reservation/list/${ev.no}`, { state: { rsvn: ev.data } })
                            : openModal(e, dateLabel, evs);
                        }}>
                        {ev.title}
                      </CalEvent>
                    ))}
                    {hiddenCount > 0 && (
                      <MoreBtn onClick={(e) => openModal(e, dateLabel, evs)}>
                        +{hiddenCount} 더보기
                      </MoreBtn>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Legend>
          <LegendItem><LegendDot $color={COLOR.green} />예약</LegendItem>
          <LegendItem><LegendDot $color="#E65100" />이용불가</LegendItem>
        </Legend>
      </SectionBox>

      {/* 날짜별 상세 모달 */}
      {modalInfo && (
        <ModalOverlay onClick={() => setModalInfo(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>📅 {modalInfo.dateLabel}</ModalTitle>
            {modalInfo.evs.map((ev, i) => (
              <ModalItem key={i} $type={ev.type}
                onClick={() => {
                  if (ev.type === 'rsvn') {
                    navigate(`/host/reservation/list/${ev.no}`, { state: { rsvn: ev.data } });
                    setModalInfo(null);
                  }
                }}>
                {ev.type === 'rsvn' ? '📋 ' : ''}{ev.title}
                {ev.type === 'rsvn' && <span style={{ fontWeight: 400, marginLeft: 6, fontSize: 11 }}>→ 상세보기</span>}
              </ModalItem>
            ))}
            <ModalClose onClick={() => setModalInfo(null)}>닫기</ModalClose>
          </ModalBox>
        </ModalOverlay>
      )}
    </PageLayout>
  );
}

export default HostRsvnCalendarPage;
