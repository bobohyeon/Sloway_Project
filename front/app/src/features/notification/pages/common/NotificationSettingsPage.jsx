import { useState } from 'react';
import styled, { css } from 'styled-components';

// ─── 알림 채널 타입 ───────────────────────────────────────────────────────────
// 백엔드 연동 시 PUT /api/notifications/settings 바디 스펙과 키 이름 맞출 것
/**
 * @typedef {{ push: boolean, email: boolean, sms: boolean }} ChannelState
 * @typedef {{ [itemKey: string]: ChannelState }} SettingMap
 */

// ─── 설정 그룹 정의 ──────────────────────────────────────────────────────────
// label: UI 표시명 | key: API 전송 키 | description: 부가 설명
const SETTING_GROUPS = [
  {
    groupKey: 'reservation',
    groupLabel: '예산·결제',
    groupDesc: '예약 상태 변경 및 결제 관련 알림',
    groupIcon: '📅',
    items: [
      {
        key: 'reservationConfirm',
        label: '예약 확정',
        description: '결제 완료 후 예약 확정 안내',
      },
      {
        key: 'checkinReminder',
        label: '체크인 D-1',
        description: '이용일 하루 전 사전 안내 알림',
      },
      {
        key: 'paymentComplete',
        label: '결제 완료',
        description: '결제가 정상 처리됐을 때',
      },
      {
        key: 'refundNotice',
        label: '환불 처리 안내',
        description: '환불 처리가 진행됐을 때',
      },
    ],
  },
  {
    groupKey: 'communication',
    groupLabel: '리뷰·소통',
    groupDesc: '리뷰 작성 및 메시지 알림',
    groupIcon: '💬',
    items: [
      {
        key: 'reviewRequest',
        label: '리뷰 작성 가능',
        description: '이용 완료 후 리뷰 작성 가능 안내',
      },
      {
        key: 'reviewReply',
        label: '리뷰 답글',
        description: '호스트가 내 리뷰에 답글 작성 시',
      },
      {
        key: 'chatMessage',
        label: '채팅 메시지',
        description: '호스트에게 채팅 메시지를 받을 때',
      },
      {
        key: 'inquiryReply',
        label: '문의 답변',
        description: '내 문의에 답변이 등록됐을 때',
      },
    ],
  },
  {
    groupKey: 'benefit',
    groupLabel: '혜택·소식',
    groupDesc: '이벤트, 쿠폰 관련 관련 알림',
    groupIcon: '🎁',
    items: [
      {
        key: 'pointSaved',
        label: '포인트 적립',
        description: '포인트가 적립되거나 만료 전 안내될 때',
      },
      {
        key: 'newCoupon',
        label: '새 쿠폰 도착',
        description: '이벤트 혜택으로 쿠폰이 발급됐을 때',
      },
      {
        key: 'couponExpiry',
        label: '쿠폰 만료 알림',
        description: '보유 쿠폰이 곧 만료될 시 안내',
      },
      {
        key: 'eventNews',
        label: '이벤트 소식',
        description: '프로모션, 할인 이벤트 안내',
        // 마케팅성 알림 — 법적 수신 동의 필요
        isMarketing: true,
      },
    ],
  },
  {
    groupKey: 'notice',
    groupLabel: '공지·사항',
    groupDesc: '서비스 운영 관련 공지',
    groupIcon: '📢',
    items: [
      {
        key: 'serviceNotice',
        label: '서비스 공지',
        description: '서비스 약관 변경 또는 중요 알림',
        // 필수 알림 — 채널 일부 비활성화 불가 처리 예시
        isMandatory: true,
      },
      {
        key: 'checkInGuide',
        label: '점검 안내',
        description: '서비스 점검 일정 안내',
      },
      {
        key: 'newsletter',
        label: '뉴스레터',
        description: '월간 Sloway 소식 (마케팅)',
        isMarketing: true,
      },
    ],
  },
];

// ─── 초기 설정값 생성 ─────────────────────────────────────────────────────────
// 백엔드 연동 시 GET /api/notifications/settings 응답값으로 초기화
const buildInitialSettings = () => {
  const map = {};
  SETTING_GROUPS.forEach(({ items }) => {
    items.forEach(({ key, isMandatory }) => {
      map[key] = {
        push: true,
        email: isMandatory ? true : true, // 필수 항목은 강제 true
        sms: false,
      };
    });
  });
  return map;
};

const CHANNEL_LABELS = {
  push: '앱 푸시',
  email: '이메일',
  sms: 'SMS',
};

export default function NotificationSettingsPage() {
  // 방해금지 시간대 — 백엔드 연동 시 별도 API 필드로 분리
  const [dndEnabled, setDndEnabled] = useState(true);
  const [dndStart, setDndStart] = useState('22:00');
  const [dndEnd, setDndEnd] = useState('08:00');

  // 알림 설정 맵 — key: itemKey, value: { push, email, sms }
  const [settings, setSettings] = useState(buildInitialSettings);

  // 채널 토글 핸들러
  // isMandatory 항목은 push 채널 비활성화 방지
  const handleToggle = (itemKey, channel, isMandatory) => {
    if (isMandatory && channel === 'push') return; // 필수 알림 push는 끄기 불가
    setSettings((prev) => ({
      ...prev,
      [itemKey]: {
        ...prev[itemKey],
        [channel]: !prev[itemKey][channel],
      },
    }));
  };

  // 저장 — 백엔드 연동 시 PUT /api/notifications/settings 로 교체
  const handleSave = () => {
    const payload = {
      dnd: { enabled: dndEnabled, start: dndStart, end: dndEnd },
      settings,
    };
    console.log('[저장 payload]', payload);
    // TODO: await api.put('/notifications/settings', payload)
    alert('설정이 저장됐습니다.');
  };

  const handleCancel = () => {
    // TODO: router.back() 또는 navigate(-1)
  };

  return (
    <Wrap>
      <PageHeader>
        <PageTitle>알림 설정</PageTitle>
        <PageDesc>받고 싶은 알림만 선택하실 수 있어요</PageDesc>
      </PageHeader>

      {/* 방해금지 시간대 */}
      <SectionCard>
        <DndHeader>
          <DndInfo>
            <DndTitle>🌙 방해금지 시간대</DndTitle>
            <DndDesc>
              설정한 시간에는 모든 알림을 제외하고 소리·진동이 자동적으로
              일시중지
            </DndDesc>
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
              <TimeLabel htmlFor="dnd-start">시작</TimeLabel>
              <TimeInput
                id="dnd-start"
                type="time"
                value={dndStart}
                onChange={(e) => setDndStart(e.target.value)}
                aria-label="방해금지 시작 시간"
              />
            </TimeField>
            <TimeSeparator aria-hidden="true">~</TimeSeparator>
            <TimeField>
              <TimeLabel htmlFor="dnd-end">종료</TimeLabel>
              <TimeInput
                id="dnd-end"
                type="time"
                value={dndEnd}
                onChange={(e) => setDndEnd(e.target.value)}
                aria-label="방해금지 종료 시간"
              />
            </TimeField>
          </DndTimeRow>
        )}
      </SectionCard>

      {/* 채널 헤더 범례 */}
      <ChannelLegend aria-hidden="true">
        <LegendSpacer />
        {['push', 'email', 'sms'].map((ch) => (
          <LegendLabel key={ch}>{CHANNEL_LABELS[ch]}</LegendLabel>
        ))}
      </ChannelLegend>

      {/* 그룹별 설정 */}
      {SETTING_GROUPS.map((group) => (
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
                      {item.isMarketing && (
                        <MarketingBadge aria-label="마케팅 알림">
                          마케팅
                        </MarketingBadge>
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

      {/* 마케팅 수신 동의 안내 */}
      <MarketingNotice>
        📌 광고·마케팅 관련 알림은 별도 마케팅 수신 동의 시 서비스 이용약관에
        따라 발송됩니다.
      </MarketingNotice>

      {/* 저장 버튼 */}
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
  max-width: 640px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`;

const PageHeader = styled.div`
  margin-bottom: var(--space-5);
`;

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
  justify-content: flex-end;
  gap: 0;
  padding: 0 20px;
  margin-bottom: 4px;
`;

const LegendSpacer = styled.div`
  flex: 1;
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

const MarketingBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--sage);
  background: rgba(168, 184, 159, 0.15);
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
  gap: 0;
`;

// ─── Toggle 스타일 ────────────────────────────────────────────────────────────
// width: 56px은 LegendLabel과 동일하게 맞춰 열 정렬 유지
const ToggleWrap = styled.div`
  width: 56px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${(p) => (p.$checked ? 'var(--sage)' : 'var(--gray-200)')};
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.$disabled ? 0.5 : 1)};
  transition: background 180ms ease;
  flex-shrink: 0;
  margin: 0 8px;

  &:focus-visible {
    outline: 2px solid var(--sage);
    outline-offset: 2px;
  }
`;

const ToggleThumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${(p) => (p.$checked ? 'calc(100% - 19px)' : '3px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--white);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: left 180ms ease;
`;

// ─── 하단 ─────────────────────────────────────────────────────────────────────

const MarketingNotice = styled.p`
  font-size: 0.78rem;
  color: var(--gray-400);
  line-height: 1.6;
  padding: 12px 16px;
  background: var(--gray-50, #fafaf9);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-5);
`;

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
