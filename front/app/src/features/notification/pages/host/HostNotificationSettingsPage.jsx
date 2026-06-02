import { useState } from 'react';
import styled, { css } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useNavigate } from 'react-router-dom';

// ─── 타입 정의 ────────────────────────────────────────────────────────────────
// 백엔드 연동 시 PUT /api/host/notifications/settings 바디 스펙과 키 이름 맞출 것
/**
 * @typedef {{ push: boolean }} ChannelState
 * @typedef {{ [itemKey: string]: ChannelState }} HostSettingMap
 */

// ─── 설정 그룹 정의 ───────────────────────────────────────────────────────────
const HOST_SETTING_GROUPS = [
  {
    groupKey: 'settlement',
    groupLabel: '정산·매출',
    groupDesc: '정산 및 수수료 관련 알림',
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
      map[key] = { push: true };
    });
  });
  return map;
};

const CHANNEL_LABELS = {
  push: '앱 푸시',
};

export default function HostNotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(buildInitialSettings);

  const handleToggle = (itemKey, channel) => {
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
      settings,
    };
    console.log('[호스트 알림 설정 저장 payload]', payload);
    // TODO: await api.put('/host/notifications/settings', payload)
    alert('설정이 저장됐습니다.');
    navigate(`/host/notification`);
  };

  const handleCancel = () => {
    // TODO: navigate(-1)
    navigate(-1);
  };

  return (
    <PageLayout
      title="알림 설정"
      description="받고 싶은 알림만 선택하실 수 있어요"
      maxWidth={800}
    >
      {/* 채널 헤더 범례 — 유저와 동일한 구조 */}
      <ChannelLegend aria-hidden="true">
        <LegendSpacer />
        {['push'].map((ch) => (
          <LegendLabel key={ch}>{CHANNEL_LABELS[ch]}</LegendLabel>
        ))}
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
                      {item.isWarning && (
                        <WarningBadge aria-label="주의 알림">주의</WarningBadge>
                      )}
                    </ItemLabel>
                    <ItemDesc>{item.description}</ItemDesc>
                  </ItemInfo>

                  <ChannelToggles>
                    {['push'].map((ch) => (
                      <Toggle
                        key={ch}
                        checked={itemSetting[ch]}
                        onChange={() => handleToggle(item.key, ch)}
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
    </PageLayout>
  );
}

// ─── Toggle 컴포넌트 (재사용 가능하도록 분리) ────────────────────────────────
// 실무에서는 components/common/Toggle.jsx 로 추출 권장
function Toggle({ checked, onChange, 'aria-label': ariaLabel }) {
  return (
    <ToggleWrap
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => e.key === 'Enter' && onChange()}
      $checked={checked}
    >
      <ToggleThumb $checked={checked} />
    </ToggleWrap>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────
const SectionCard = styled.div`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: var(--space-3);
`;

// ─── 채널 범례 — 유저와 동일한 구조 ─────────────────────────────────────────

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

// 호스트 특화: 낮은 평점 등 주의 알림
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
  gap: 0;
`;

// ─── Toggle 스타일 ────────────────────────────────────────────────────────────
// width: 56px은 LegendLabel과 동일하게 맞춰 열 정렬 유지
const ToggleWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 999px;
  background: ${(p) => (p.$checked ? '#c07040' : 'var(--gray-200)')};
  cursor: pointer;
  opacity: 1;
  transition: background 180ms ease;
  flex-shrink: 0;
  margin: 0 8px;

  &:focus-visible {
    outline: 2px solid #c07040;
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
  background: #c07040;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: filter 150ms ease;

  &:hover {
    filter: brightness(0.92);
  }
`;
