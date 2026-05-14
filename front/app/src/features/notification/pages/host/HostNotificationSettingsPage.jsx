import { useState } from 'react';
import styled, { css } from 'styled-components';

// ─── 타입 정의 ────────────────────────────────────────────────────────────────
// 백엔드 연동 시 PUT /api/host/notifications/settings 바디 스펙과 키 이름 맞출 것
/**
 * @typedef {{ push: boolean, email: boolean, sms: boolean }} ChannelState
 * @typedef {{ [itemKey: string]: ChannelState }} HostSettingMap
 *
 * 게스트 설정과 차이점:
 * - 그룹: 예약·운영 / 정산·매출 / 게스트 소통 (호스트 업무 중심 분류)
 * - 채널: 앱 푸시 / 이메일 / SMS
 * - 방해금지 시간대는 공유하되 "신규 예약"은 항상 발송 (이미지 안내 문구 반영)
 */

// ─── 설정 그룹 정의 ───────────────────────────────────────────────────────────
// 이미지의 그룹: 예약·운영 / 정산·매출 / 게스트 소통 순서 반영
const HOST_SETTING_GROUPS = [
  {
    groupKey: 'reservation',
    groupLabel: '예약·운영',
    groupDesc: '신규 예약 및 체크인 관련 알림',
    groupIcon: '📋',
    items: [
      {
        key: 'newReservation',
        label: '새 예약 신청',
        description: '게스트가 예약을 요청했을 때',
        // 신규 예약은 호스트 핵심 알림 — push 필수
        isMandatory: true,
      },
      {
        key: 'reservationConfirmed',
        label: '예약 확정',
        description: '게스트가 결제를 완료했을 때',
      },
      {
        key: 'reservationCancelled',
        label: '예약 취소',
        description: '게스트가 예약을 취소했을 때',
      },
      {
        key: 'tomorrowCheckin',
        label: '내일 체크인 알림',
        description: '체크인 하루 전 안내',
      },
    ],
  },
  {
    groupKey: 'settlement',
    groupLabel: '정산·매출',
    groupDesc: '정산 및 수수료 관련 알림 (김우영 담당)',
    groupIcon: '💰',
    items: [
      {
        key: 'settlementSchedule',
        label: '정산 예정 안내',
        description: '정산 지급 3일 전 안내',
      },
      {
        key: 'settlementComplete',
        label: '정산 입금 완료',
        description: '정산금이 입금됐을 때',
      },
      {
        key: 'taxInvoice',
        label: '세금계산서 발행',
        description: '매월 세금계산서 자동 발행 안내',
      },
      {
        key: 'feePolicy',
        label: '수수료 정책 개편',
        description: '플랫폼 수수료 정책 변경 안내 (중요)',
        // 수수료 정책은 중요 공지 — 필수 알림 처리
        isMandatory: true,
      },
    ],
  },
  {
    groupKey: 'guestCommunication',
    groupLabel: '게스트 소통',
    groupDesc: '채팅·리뷰·문의 관련 알림',
    groupIcon: '💬',
    items: [
      {
        key: 'chatMessage',
        label: '채팅 메시지',
        description: '게스트가 메시지를 보냈을 때',
      },
      {
        key: 'newReview',
        label: '새 리뷰',
        description: '게스트가 리뷰를 작성했을 때',
      },
      {
        key: 'lowRatingAlert',
        label: '낮은 평점',
        description: '3점 미만 리뷰가 달렸을 때 빠른 응대 권고',
        // 낮은 평점 알림은 호스트 평점 관리에 중요
        isWarning: true,
      },
    ],
  },
];

// ─── 초기 설정값 생성 ─────────────────────────────────────────────────────────
// 백엔드 연동 시 GET /api/host/notifications/settings 응답값으로 초기화
const buildInitialSettings = () => {
  const map = {};
  HOST_SETTING_GROUPS.forEach(({ items }) => {
    items.forEach(({ key }) => {
      map[key] = { push: true, email: true, sms: false };
    });
  });
  return map;
};

const CHANNEL_LABELS = {
  push: '앱',
  email: '이메일',
  sms: 'SMS',
};

export default function HostNotificationSettingsPage() {
  // 방해금지 시간대
  // 주의: 호스트의 "신규 예약"은 방해금지 중에도 항상 발송됨 (이미지 안내 문구 반영)
  const [dndEnabled, setDndEnabled] = useState(true);
  const [dndStart, setDndStart] = useState('23:00');
  const [dndEnd, setDndEnd] = useState('08:00');

  // 알림 설정 맵 — key: itemKey, value: { push, email, sms }
  const [settings, setSettings] = useState(buildInitialSettings);

  // 채널 토글 핸들러
  // isMandatory 항목의 push 채널은 비활성화 불가 (핵심 호스트 알림)
  const handleToggle = (itemKey, channel, isMandatory) => {
    if (isMandatory && channel === 'push') return;
    setSettings((prev) => ({
      ...prev,
      [itemKey]: {
        ...prev[itemKey],
        [channel]: !prev[itemKey][channel],
      },
    }));
  };

  // 저장 — 백엔드 연동 시 PUT /api/host/notifications/settings 로 교체
  const handleSave = () => {
    const payload = {
      dnd: { enabled: dndEnabled, start: dndStart, end: dndEnd },
      settings,
    };
    console.log('[호스트 알림 설정 저장 payload]', payload);
    // TODO: await api.put('/host/notifications/settings', payload)
    alert('설정이 저장됐습니다.');
  };

  const handleCancel = () => {
    // TODO: router.back() 또는 navigate(-1)
  };

  return (
    <Wrap>
      <PageHeader>
        <HeaderLeft>
          <PageTitle>알림 설정</PageTitle>
          <PageDesc>받고 싶은 알림만 선택하실 수 있어요</PageDesc>
        </HeaderLeft>
        <SaveBtn type="button" onClick={handleSave}>
          설정 저장
        </SaveBtn>
      </PageHeader>

      {/* 방해금지 시간대 */}
      <SectionCard>
        <DndHeader>
          <DndInfo>
            <DndTitle>🌙 방해금지 시간대</DndTitle>
            <DndDesc>
              설정한 시간에는 건금 알림(신규 예약 등)을 제외한 알림이 울리지 않아요.
            </DndDesc>
            {/* 호스트 특화 안내: 신규 예약은 방해금지 무관 항상 발송 */}
            <DndWarning>
              ⚠ 신규 예약 알림은 호스트 공급을 관리를 위해 항상 발송됩니다
            </DndWarning>
          </DndInfo>
          <Toggle
            checked={dndEnabled}
            onChange={() => setDndEnabled((v) => !v)}
            aria-label="방해금지 시간대 켜기/끄기"
          />
        </DndHeader>

        {dndEnabled && (
          <DndTimeRow>
            <TimeField>
              <TimeLabel htmlFor="host-dnd-start">시작</TimeLabel>
              <TimeInput
                id="host-dnd-start"
                type="time"
                value={dndStart}
                onChange={(e) => setDndStart(e.target.value)}
                aria-label="방해금지 시작 시간"
              />
            </TimeField>
            <TimeSeparator aria-hidden="true">~</TimeSeparator>
            <TimeField>
              <TimeLabel htmlFor="host-dnd-end">종료</TimeLabel>
              <TimeInput
                id="host-dnd-end"
                type="time"
                value={dndEnd}
                onChange={(e) => setDndEnd(e.target.value)}
                aria-label="방해금지 종료 시간"
              />
            </TimeField>
          </DndTimeRow>
        )}
      </SectionCard>

      {/* 알림 유형 채널 범례 */}
      <ChannelLegend>
        <LegendTitle>알림 유형</LegendTitle>
        <LegendChannels aria-hidden="true">
          {['push', 'email', 'sms'].map((ch) => (
            <LegendLabel key={ch}>{CHANNEL_LABELS[ch]}</LegendLabel>
          ))}
        </LegendChannels>
      </ChannelLegend>

      {/* 그룹별 설정 */}
      {HOST_SETTING_GROUPS.map((group) => (
        <SectionCard key={group.groupKey}>
          <GroupHeader>
            <GroupIcon aria-hidden="true">{group.groupIcon}</GroupIcon>
            <GroupInfo>
              <GroupLabel>{group.groupLabel}</GroupLabel>
              <GroupDesc>{group.groupDesc}</GroupDesc>
            </GroupInfo>
          </GroupHeader>

          <ItemList>
            {group.items.map((item, idx) => {
              const itemSetting = settings[item.key];
              return (
                <SettingItem
                  key={item.key}
                  $last={idx === group.items.length - 1}
                >
                  <ItemInfo>
                    <ItemLabel>
                      {item.label}
                      {item.isMandatory && (
                        <MandatoryBadge aria-label="필수 알림">
                          필수
                        </MandatoryBadge>
                      )}
                      {item.isWarning && (
                        <WarningBadge aria-label="주의 알림">
                          주의
                        </WarningBadge>
                      )}
                    </ItemLabel>
                    <ItemDesc>{item.description}</ItemDesc>
                  </ItemInfo>

                  <ChannelToggles>
                    {['push', 'email', 'sms'].map((ch) => (
                      <Toggle
                        key={ch}
                        checked={itemSetting[ch]}
                        onChange={() =>
                          handleToggle(item.key, ch, item.isMandatory)
                        }
                        disabled={item.isMandatory && ch === 'push'}
                        aria-label={`${item.label} ${CHANNEL_LABELS[ch]} 알림`}
                      />
                    ))}
                  </ChannelToggles>
                </SettingItem>
              );
            })}
          </ItemList>
        </SectionCard>
      ))}

      {/* 하단 액션 */}
      <FooterActions>
        <CancelBtn type="button" onClick={handleCancel}>
          취소
        </CancelBtn>
        <SaveBtn type="button" onClick={handleSave}>
          설정 저장
        </SaveBtn>
      </FooterActions>
    </Wrap>
  );
}

// ─── Toggle 컴포넌트 (재사용 가능하도록 분리) ────────────────────────────────
// 게스트 NotificationSettingsPage의 Toggle과 동일한 구조
// 실무에서는 공통 컴포넌트로 분리 권장: components/common/Toggle.jsx
function Toggle({ checked, onChange, disabled, 'aria-label': ariaLabel }) {
  return (
    <ToggleWrap
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onChange}
      onKeyDown={(e) => !disabled && e.key === 'Enter' && onChange()}
      $checked={checked}
      $disabled={disabled}
    >
      <ToggleThumb $checked={checked} />
    </ToggleWrap>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrap = styled.div`
  padding: var(--space-6);
  max-width: 760px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`;

const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-5);
`;

const HeaderLeft = styled.div``;

const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`;

const PageDesc = styled.p`
  font-size: 0.88rem;
  color: var(--gray-400);
`;

const SectionCard = styled.div`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: var(--space-3);
`;

// ─── 방해금지 섹션 ────────────────────────────────────────────────────────────

const DndHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
`;

const DndInfo = styled.div``;

const DndTitle = styled.p`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
`;

const DndDesc = styled.p`
  font-size: 0.78rem;
  color: var(--gray-400);
  line-height: 1.5;
`;

// 호스트 특화: 방해금지 예외 안내 (신규 예약은 항상 알림)
const DndWarning = styled.p`
  font-size: 0.75rem;
  color: #b7770d;
  background: rgba(183, 119, 13, 0.08);
  padding: 4px 10px;
  border-radius: var(--radius-md);
  margin-top: 6px;
  line-height: 1.5;
`;

const DndTimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--gray-100);
`;

const TimeField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeLabel = styled.label`
  font-size: 0.75rem;
  color: var(--gray-400);
  font-weight: 500;
`;

const TimeInput = styled.input`
  height: 38px;
  padding: 0 12px;
  font-size: 0.88rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  color: var(--gray-800);
  font-family: inherit;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: var(--sage);
  }
`;

const TimeSeparator = styled.span`
  color: var(--gray-400);
  margin-top: 18px;
`;

// ─── 채널 범례 ────────────────────────────────────────────────────────────────

const ChannelLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 4px;
`;

const LegendTitle = styled.span`
  font-size: 0.75rem;
  color: var(--gray-400);
  font-weight: 500;
`;

const LegendChannels = styled.div`
  display: flex;
  align-items: center;
`;

const LegendLabel = styled.span`
  width: 56px;
  text-align: center;
  font-size: 0.72rem;
  color: var(--gray-400);
  font-weight: 500;
`;

// ─── 그룹 헤더 ────────────────────────────────────────────────────────────────

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--gray-100);
`;

const GroupIcon = styled.span`
  font-size: 1.1rem;
`;

const GroupInfo = styled.div``;

const GroupLabel = styled.p`
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--gray-800);
`;

const GroupDesc = styled.p`
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-top: 1px;
`;

// ─── 설정 아이템 ──────────────────────────────────────────────────────────────

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: 12px 0;

  ${(p) =>
    !p.$last &&
    css`
      border-bottom: 1px solid var(--gray-100);
    `}
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemLabel = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`;

const MandatoryBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  color: #c0392b;
  background: rgba(192, 57, 43, 0.1);
  padding: 1px 6px;
  border-radius: var(--radius-full);
`;

// 호스트 특화: 낮은 평점 등 주의가 필요한 알림
const WarningBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  color: #b7770d;
  background: rgba(183, 119, 13, 0.1);
  padding: 1px 6px;
  border-radius: var(--radius-full);
`;

const ItemDesc = styled.p`
  font-size: 0.78rem;
  color: var(--gray-400);
`;

const ChannelToggles = styled.div`
  display: flex;
  align-items: center;
`;

// ─── Toggle 스타일 ────────────────────────────────────────────────────────────
// width: 56px은 LegendLabel과 동일하게 맞춰 열 정렬 유지
const ToggleWrap = styled.div`
  width: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 22px;
  border-radius: 999px;
  background: ${(p) => (p.$checked ? 'var(--sage)' : 'var(--gray-200)')};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  transition: background 180ms ease;
  flex-shrink: 0;

  /* 실제 토글 트랙 크기 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    width: 40px;
    height: 22px;
    border-radius: 999px;
    margin: 0 auto;
  }

  &:focus-visible {
    outline: 2px solid var(--sage);
    outline-offset: 2px;
  }
`;

const ToggleThumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${(p) => (p.$checked ? 'calc(50% + 1px)' : 'calc(50% - 17px)')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 180ms ease;
`;

// ─── 하단 액션 ────────────────────────────────────────────────────────────────

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-bottom: var(--space-6);
`;

const CancelBtn = styled.button`
  padding: 10px 20px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--gray-600);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: var(--gray-400);
  }
`;

const SaveBtn = styled.button`
  padding: 10px 24px;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--white);
  background: var(--sage);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: filter 150ms ease;

  &:hover {
    filter: brightness(0.92);
  }
`;
