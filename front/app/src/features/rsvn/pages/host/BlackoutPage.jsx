import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import {
  BtnPrimary,
  COLOR,
} from '../../components/user/RsvnStyled';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  animation: ${fadeInUp} 480ms ease-out both;
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const InfoBanner = styled.div`
  background: #fffbf0;
  border: 1px solid #ffe4a0;
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  font-size: 12px;
  color: #666;
  line-height: 1.7;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 10px;
`;

const FilterLeft = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => ($active ? COLOR.black : COLOR.gray200)};
  background: ${({ $active }) => ($active ? COLOR.black : '#fff')};
  color: ${({ $active }) => ($active ? '#fff' : '#555')};
  cursor: pointer;
`;

const Select = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
`;

const BlackoutCard = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CardIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${COLOR.gray100};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const ReasonTag = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
  background: #fff3e0;
  color: ${COLOR.orange};
`;

const EditBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
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

const DelBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #fcc;
  color: ${COLOR.red};
  background: #fff;
  cursor: pointer;
  &:hover {
    background: #fff0f0;
  }
`;

const EmptyBox = styled.div`
  text-align: center;
  padding: 60px 0;
  color: ${COLOR.gray400};
  font-size: 14px;
`;

const DUMMY = [
  {
    id: 1,
    reason: '정비·보수',
    space: '청평 숲속 파인뷰',
    title: '내부 정비',
    date: '2026.05.13 ~ 2026.05.15',
    time: null,
    icon: '🔧',
  },
  {
    id: 2,
    reason: '청소',
    space: '성수 브릭라운지',
    title: '정기 청소',
    date: '2026.05.25',
    time: '10:00 ~ 14:00',
    icon: '🧹',
  },
  {
    id: 3,
    reason: '정비·보수',
    space: '제주 돌담집 리트릿',
    title: '장기 점검 · 에어컨 교체',
    date: '2026.06.01 ~ 2026.06.10',
    time: null,
    icon: '🔧',
  },
  {
    id: 4,
    reason: '개인 이용',
    space: '청평 숲속 파인뷰',
    title: '호스트 개인 이용',
    date: '2026.05.30 ~ 2026.06.02',
    time: null,
    icon: '🏠',
  },
];

const FILTERS = ['공간 전체', '다가오는 일정'];

function BlackoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(DUMMY);
  const [activeFilter, setActiveFilter] = useState(0);
  const [spaceFilter, setSpaceFilter] = useState('전체 공간');

  const filtered = items.filter(
    (item) => spaceFilter === '전체 공간' || item.space === spaceFilter
  );

  const handleDelete = (id) => {
    const ok = window.confirm(
      '이용 불가 설정을 삭제하시겠어요?\n삭제하면 해당 기간에 예약이 다시 가능해집니다.'
    );
    if (ok) setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <PageLayout
      title="이용 불가 설정"
      description="예약을 받지 않을 날짜·시간을 관리하세요"
      actions={
        <BtnPrimary onClick={() => navigate('/host/reservation/block/add')}>
          + 이용 불가 추가
        </BtnPrimary>
      }
      maxWidth={1200}
    >

      <InfoBanner>
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 3 }}>
            이용 불가 설정이란?
          </div>
          정비·청소·개인 사정 등으로 예약을 받을 수 없는 날짜·시간을 미리
          설정해두시면 해당 기간에는 자동으로 예약이 차단됩니다. 기존 예약은
          영향받지 않아요.
        </div>
      </InfoBanner>

      <FilterRow>
        <FilterLeft>
          {FILTERS.map((t, i) => (
            <FilterTab
              key={i}
              $active={activeFilter === i}
              onClick={() => setActiveFilter(i)}
            >
              {t}
            </FilterTab>
          ))}
        </FilterLeft>
        <Select
          value={spaceFilter}
          onChange={(e) => setSpaceFilter(e.target.value)}
        >
          <option>전체 공간</option>
          <option>청평 숲속 파인뷰</option>
          <option>성수 브릭라운지</option>
          <option>제주 돌담집 리트릿</option>
        </Select>
      </FilterRow>

      {filtered.length === 0 ? (
        <EmptyBox>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚫</div>
          <div>이용 불가 설정이 없어요</div>
        </EmptyBox>
      ) : (
        filtered.map((item) => (
          <BlackoutCard key={item.id}>
            <CardIcon>{item.icon}</CardIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                <ReasonTag>{item.reason}</ReasonTag>
                <span style={{ fontSize: 12, color: COLOR.gray400 }}>
                  📍 {item.space}
                </span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: COLOR.gray400 }}>
                📅 {item.date}
                {item.time && <span> · ⏰ {item.time}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <EditBtn
                onClick={() =>
                  navigate(`/host/reservation/block/edit/${item.id}`)
                }
              >
                ✏️ 수정
              </EditBtn>
              <DelBtn onClick={() => handleDelete(item.id)}>🗑️ 삭제</DelBtn>
            </div>
          </BlackoutCard>
        ))
      )}
    </PageLayout>
  );
}

export default BlackoutPage;
