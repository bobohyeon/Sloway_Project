import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { BtnPrimary, COLOR } from '../../components/user/RsvnStyled';
import { findBlackouts, deleteBlackout } from '../../api/blackoutApi';
import { findHostSpaces } from '../../api/rsvnApi';

const FilterRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 14px;
  gap: 10px;
`;

const SpaceSelect = styled.select`
  padding: 7px 12px;
  border: 1px solid ${COLOR.gray200};
  border-radius: 8px;
  font-size: 13px;
  background: #fff;
  outline: none;
  min-width: 200px;
  cursor: pointer;
  &:focus { border-color: ${COLOR.sage}; }
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
  width: 48px; height: 48px;
  background: ${COLOR.gray100};
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
`;

const ReasonTag = styled.span`
  font-size: 11px; font-weight: 600;
  padding: 2px 7px; border-radius: 4px;
  background: #fff3e0; color: ${COLOR.orange};
`;

const EditBtn = styled.button`
  font-size: 12px; padding: 5px 12px; border-radius: 6px;
  border: 1px solid ${COLOR.gray200}; background: #fff; cursor: pointer;
  &:hover { border-color: ${COLOR.sage}; }
`;

const DelBtn = styled.button`
  font-size: 12px; padding: 5px 12px; border-radius: 6px;
  border: 1px solid #fcc; color: ${COLOR.red}; background: #fff; cursor: pointer;
  &:hover { background: #fff0f0; }
`;

const EmptyBox = styled.div`
  text-align: center; padding: 60px 0; color: ${COLOR.gray400}; font-size: 14px;
`;

const REASON_LABEL = { M: '정비/보수', C: '청소', P: '개인이용', E: '기타' };
const REASON_ICON  = { M: '🔧', C: '🧹', P: '🏠', E: '📋' };
const SPACE_TYPE_LABEL = { OFFICE: '오피스', WORK_STAY: '워크앤스테이', STATION: '숙소' };

const formatDt = (dt) => dt?.slice(0, 10).replaceAll('-', '.') ?? '';

function BlackoutPage() {
  const navigate = useNavigate();
  const [spaces, setSpaces] = useState([]);
  const [selectedPlaceNo, setSelectedPlaceNo] = useState(null); // 1단계: 상위 공간
  const [selectedSpace, setSelectedSpace] = useState(null);     // 2단계: 하위 공간
  const [items, setItems] = useState([]);

  // placeNo 기준으로 그룹핑
  const placeGroups = useMemo(() => {
    const map = new Map();
    spaces.forEach((s) => {
      if (!map.has(s.placeNo)) {
        map.set(s.placeNo, { placeNo: s.placeNo, placeTitle: s.placeTitle ?? s.spaceName, items: [] });
      }
      map.get(s.placeNo).items.push(s);
    });
    return [...map.values()];
  }, [spaces]);

  const subSpaces = useMemo(
    () => placeGroups.find((g) => g.placeNo === selectedPlaceNo)?.items ?? [],
    [placeGroups, selectedPlaceNo]
  );

  // 호스트 공간 목록 로드 → 첫 번째 상위/하위 자동 선택
  useEffect(() => {
    async function loadSpaces() {
      try {
        const data = await findHostSpaces();
        setSpaces(data);
        if (data.length > 0) {
          setSelectedPlaceNo(data[0].placeNo);
          setSelectedSpace(data[0]);
          const blackouts = await findBlackouts(data[0].entityNo);
          setItems(blackouts);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadSpaces();
  }, []);

  // 1단계 공간 변경
  const handlePlaceChange = async (e) => {
    const placeNo = Number(e.target.value);
    setSelectedPlaceNo(placeNo);
    const group = placeGroups.find((g) => g.placeNo === placeNo);
    const first = group?.items[0] ?? null;
    setSelectedSpace(first);
    if (first) {
      try {
        const data = await findBlackouts(first.entityNo);
        setItems(data);
      } catch {
        setItems([]);
      }
    }
  };

  // 2단계 하위 공간 변경
  const handleSpaceChange = async (e) => {
    const entityNo = Number(e.target.value);
    const space = subSpaces.find((s) => s.entityNo === entityNo);
    setSelectedSpace(space);
    try {
      const data = await findBlackouts(entityNo);
      setItems(data);
    } catch {
      alert('이용 불가 목록을 불러오지 못했어요');
      setItems([]);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('이용 불가 설정을 삭제하시겠어요?');
    if (!ok) return;
    try {
      await deleteBlackout(id);
      setItems((prev) => prev.filter((i) => i.no !== id));
    } catch {
      alert('삭제에 실패했어요');
    }
  };

  return (
    <PageLayout
      title="이용 불가 설정"
      description="예약을 받지 않을 날짜·시간을 관리하세요"
      actions={
        <BtnPrimary
          onClick={() => navigate('/host/reservation/block/add', { state: { entityNo: selectedSpace?.entityNo } })}
          disabled={!selectedSpace}
        >
          + 이용 불가 추가
        </BtnPrimary>
      }
      maxWidth={1200}
    >
      <InfoBanner>
        <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
        <div>
          <div style={{ fontWeight: 700, marginBottom: 3 }}>이용 불가 설정이란?</div>
          정비·청소·개인 사정 등으로 예약을 받을 수 없는 날짜를 설정하면 해당 기간에 자동으로 예약이 차단됩니다.
        </div>
      </InfoBanner>

      <FilterRow>
        {/* 1단계: 상위 공간명 */}
        <SpaceSelect
          value={selectedPlaceNo ?? ''}
          onChange={handlePlaceChange}
          disabled={placeGroups.length === 0}
        >
          {placeGroups.length === 0
            ? <option>등록된 공간이 없어요</option>
            : placeGroups.map((g) => (
                <option key={g.placeNo} value={g.placeNo}>{g.placeTitle}</option>
              ))
          }
        </SpaceSelect>
        {/* 2단계: 하위 공간명 */}
        <SpaceSelect
          value={selectedSpace?.entityNo ?? ''}
          onChange={handleSpaceChange}
          disabled={subSpaces.length === 0}
        >
          {(() => {
            const nameSet = new Set(subSpaces.map((s) => s.spaceName));
            const hasDup = nameSet.size < subSpaces.length;
            return subSpaces.map((s) => (
              <option key={s.entityNo} value={s.entityNo}>
                {hasDup
                  ? `${s.spaceName} · ${SPACE_TYPE_LABEL[s.spaceType] ?? s.spaceType}`
                  : s.spaceName}
              </option>
            ));
          })()}
        </SpaceSelect>
      </FilterRow>

      {!selectedSpace ? (
        <EmptyBox>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          <div>공간을 선택해주세요</div>
        </EmptyBox>
      ) : items.length === 0 ? (
        <EmptyBox>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🚫</div>
          <div>이용 불가 설정이 없어요</div>
        </EmptyBox>
      ) : (
        items.map((item) => (
          <BlackoutCard key={item.no}>
            <CardIcon>{REASON_ICON[item.reasonType] ?? '📋'}</CardIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                <ReasonTag>{REASON_LABEL[item.reasonType] ?? item.reasonType}</ReasonTag>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{item.title}</div>
              <div style={{ fontSize: 12, color: COLOR.gray400 }}>
                📅 {formatDt(item.startDate)} ~ {formatDt(item.endDate)}
                {item.startTime && <span> · ⏰ {item.startTime?.slice(11, 16)} ~ {item.endTime?.slice(11, 16)}</span>}
              </div>
              {item.memo && <div style={{ fontSize: 12, color: COLOR.gray400, marginTop: 2 }}>{item.memo}</div>}
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <EditBtn onClick={() => navigate(`/host/reservation/block/edit/${item.no}`, { state: { blackout: item } })}>
                ✏️ 수정
              </EditBtn>
              <DelBtn onClick={() => handleDelete(item.no)}>🗑️ 삭제</DelBtn>
            </div>
          </BlackoutCard>
        ))
      )}
    </PageLayout>
  );
}

export default BlackoutPage;
