import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useNavigate } from 'react-router-dom';
import api from '../../../../app/api/axiosApi';

const SETTING_GROUPS = [
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
        isMarketing: true,
      },
    ],
  },
];

const buildInitialSettings = () => {
  const map = {};
  SETTING_GROUPS.forEach(({ items }) => {
    items.forEach(({ key }) => {
      map[key] = { push: true };
    });
  });
  return map;
};

const CHANNEL_LABELS = { push: '앱 푸시' };

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(buildInitialSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/notifications/settings');
        setSettings(data.settings);
      } catch {
        // 기본값 유지
      }
    };
    fetch();
  }, []);

  const handleToggle = (itemKey, channel, isMandatory) => {
    if (isMandatory && channel === 'push') return;
    setSettings((prev) => ({
      ...prev,
      [itemKey]: { ...prev[itemKey], [channel]: !prev[itemKey][channel] },
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/notifications/settings', { settings });
      navigate('/user/notification');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PageLayout
      title="알림 설정"
      description="받고 싶은 알림만 선택하실 수 있어요"
      maxWidth={800}
    >
      <ChannelLegend aria-hidden="true">
        <LegendSpacer />
        {['push'].map((ch) => (
          <LegendLabel key={ch}>{CHANNEL_LABELS[ch]}</LegendLabel>
        ))}
      </ChannelLegend>

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
              const itemSetting = settings[item.key] ?? { push: true };
              return (
                <SettingItem key={item.key} $last={idx === group.items.length - 1}>
                  <ItemInfo>
                    <ItemLabel>
                      {item.label}
                      {item.isMandatory && (
                        <MandatoryBadge aria-label="필수 알림">필수</MandatoryBadge>
                      )}
                      {item.isMarketing && (
                        <MarketingBadge aria-label="마케팅 알림">마케팅</MarketingBadge>
                      )}
                    </ItemLabel>
                    <ItemDesc>{item.description}</ItemDesc>
                  </ItemInfo>

                  <ChannelToggles>
                    {['push'].map((ch) => (
                      <Toggle
                        key={ch}
                        checked={itemSetting[ch]}
                        onChange={() => handleToggle(item.key, ch, item.isMandatory)}
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

      <MarketingNotice>
        📌 정산, 세금계산서 등 금융 관련 알림, 예약 관련 알림, 결제 관련 알림은
        필수 발송되며 수신 거부가 불가합니다.
      </MarketingNotice>

      <FooterActions>
        <CancelBtn type="button" onClick={() => navigate(-1)}>
          취소
        </CancelBtn>
        <SaveBtn type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? '저장 중...' : '설정 저장'}
        </SaveBtn>
      </FooterActions>
    </PageLayout>
  );
}

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
const SectionCard = styled.div`
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 20px;
  margin-bottom: var(--space-3);
`;

const ChannelLegend = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0;
  padding: 0 20px;
  margin-bottom: 4px;
`;

const LegendSpacer = styled.div`flex: 1;`;

const LegendLabel = styled.span`
  width: 56px;
  text-align: center;
  font-size: 0.72rem;
  color: var(--gray-400);
  font-weight: 500;
`;

const GroupHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--gray-100);
`;

const GroupIcon = styled.span`font-size: 1.1rem;`;
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
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};
  transition: filter 150ms ease;

  &:hover:not(:disabled) {
    filter: brightness(0.92);
  }
`;
