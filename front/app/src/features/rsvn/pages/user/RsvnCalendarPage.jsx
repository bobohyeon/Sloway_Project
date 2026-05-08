import { useState } from 'react';
import styled from 'styled-components';
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

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const EVENTS = {
  8: [{ title: '청평 숲속 파인뷰', type: 'confirmed' }],
  9: [{ title: '청평 숲속 파인뷰', type: 'confirmed' }],
  10: [{ title: '청평 숲속 파인뷰', type: 'confirmed' }],
  15: [{ title: '성수 브릭라운지', type: 'pending' }],
  22: [{ title: '강릉 바다향', type: 'confirmed' }],
  28: [{ title: '제주 돌담집', type: 'confirmed' }],
  29: [{ title: '제주 돌담집', type: 'confirmed' }],
};
const EVENT_COLOR = { confirmed: '#2D6A4F', pending: '#E65100' };

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
`;

const CalMonth = styled.div`
  font-size: 18px;
  font-weight: 700;
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
`;

const CalCell = styled.div`
  min-height: 72px;
  padding: 6px;
  border-radius: 6px;
  &:hover {
    background: ${COLOR.cream};
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

// 2026년 5월 기준: 1일 = 금요일(5번째)
const FIRST_DAY = 5;
const TOTAL_DAYS = 31;
const cells = [
  ...Array(FIRST_DAY).fill(null),
  ...Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1),
];

function RsvnCalendarPage() {
  const [view, setView] = useState('month');

  return (
    <div>
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
          <CalNav>‹</CalNav>
          <CalMonth>
            {view === 'month' ? '2026년 5월' : '2026년 5월 4일 ~ 10일'}
          </CalMonth>
          <CalNav>›</CalNav>
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
            <CalGrid>
              {cells.map((date, idx) => (
                <CalCell key={idx}>
                  {date && (
                    <>
                      <CalDate $today={date === 8} $sun={idx % 7 === 0}>
                        {date}
                      </CalDate>
                      {EVENTS[date]?.map((ev, i) => (
                        <CalEvent key={i} $type={ev.type}>
                          {ev.title}
                        </CalEvent>
                      ))}
                    </>
                  )}
                </CalCell>
              ))}
            </CalGrid>
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: COLOR.gray400,
              fontSize: 13,
            }}
          >
            주 뷰 — 백엔드 연결 후 구현 예정
          </div>
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
    </div>
  );
}

export default RsvnCalendarPage;
