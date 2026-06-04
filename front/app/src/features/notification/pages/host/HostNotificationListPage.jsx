import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import { useNavigate } from 'react-router-dom';
import api from '../../../../app/api/axiosApi';

const TAB_OPTIONS = [
  { label: '전체', key: 'ALL' },
  { label: '안 읽음', key: 'UNREAD' },
  { label: '예약', key: 'RESERVATION' },
  { label: '정산', key: 'SETTLEMENT' },
];

const TYPE_ICON = {
  reservation: '📋',
  payment: '💳',
  settlement: '💰',
  chat: '💬',
  review: '⭐',
  policy: '📄',
  checkin: '🏠',
  notice: '📢',
};

const TYPE_BG = {
  reservation: 'rgba(220, 100, 80, 0.1)',
  payment: 'rgba(200, 160, 80, 0.1)',
  settlement: 'rgba(200, 160, 80, 0.12)',
  chat: 'rgba(168, 184, 159, 0.15)',
  review: 'rgba(240, 180, 60, 0.12)',
  policy: 'rgba(100, 130, 200, 0.1)',
  checkin: 'rgba(168, 184, 159, 0.12)',
  notice: 'rgba(200, 100, 140, 0.1)',
};

const PAGE_SIZE = 8;

export default function HostNotificationListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');
  const [notifications, setNotifications] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [readIds, setReadIds] = useState(new Set());

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await api.get('/host/notifications', {
        params: { tab: activeTab, page: currentPage - 1, size: PAGE_SIZE },
      });
      setNotifications(data.content);
      setTotalPages(data.totalPages);
      setUnreadCount(data.unreadCount);
    } catch {
      // 인증 오류 등 — 빈 상태 유지
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  const handleRead = async (id) => {
    setReadIds((prev) => new Set([...prev, id]));
    try {
      await api.patch(`/host/notifications/${id}/read`);
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      setReadIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleReadAll = async () => {
    const prevUnread = unreadCount;
    setReadIds(new Set(notifications.map((n) => n.id)));
    setUnreadCount(0);
    try {
      await api.patch('/host/notifications/read-all');
      fetchNotifications();
    } catch {
      setUnreadCount(prevUnread);
    }
  };

  const isRead = (n) => n.isRead || readIds.has(n.id);

  return (
    <PageLayout
      title="알림 내역"
      description="호스트 활동에 대한 알림을 확인하세요"
      maxWidth={1200}
    >
      <Divider />

      <TabRow>
        <TabList role="tablist" aria-label="알림 카테고리">
          {TAB_OPTIONS.map(({ label, key }) => (
            <TabBtn
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              $active={activeTab === key}
              onClick={() => handleTabChange(key)}
              type="button"
            >
              {label}
              {key === 'UNREAD' && unreadCount > 0 && (
                <TabBadge>{unreadCount}</TabBadge>
              )}
            </TabBtn>
          ))}
        </TabList>

        <ActionArea>
          <GhostBtn
            type="button"
            onClick={() => navigate('/host/notification/setting')}
            aria-label="알림 설정으로 이동"
          >
            ⚙ 알림 설정
          </GhostBtn>
          {unreadCount > 0 && (
            <PrimaryBtn type="button" onClick={handleReadAll}>
              전체 읽음 ({unreadCount})
            </PrimaryBtn>
          )}
        </ActionArea>
      </TabRow>

      {notifications.length === 0 ? (
        <EmptyWrap>
          <EmptyIcon aria-hidden="true">🔔</EmptyIcon>
          <EmptyTitle>알림이 없습니다</EmptyTitle>
          <EmptyDesc>새로운 알림이 오면 여기서 확인하실 수 있어요.</EmptyDesc>
        </EmptyWrap>
      ) : (
        <NotiList>
          {notifications.map((noti) => {
            const read = isRead(noti);
            return (
              <NotiCard
                key={noti.id}
                $read={read}
                onClick={() => handleRead(noti.id)}
                role="button"
                tabIndex={0}
                aria-label={`${noti.title}${read ? '' : ' (읽지 않음)'}`}
                onKeyDown={(e) => e.key === 'Enter' && handleRead(noti.id)}
              >
                <IconWrap style={{ background: TYPE_BG[noti.type] }}>
                  <span aria-hidden="true">{TYPE_ICON[noti.type]}</span>
                </IconWrap>
                <NotiContent>
                  <NotiMeta>
                    <CategoryLabel>{noti.category}</CategoryLabel>
                    <TimeLabel>{noti.timeLabel}</TimeLabel>
                  </NotiMeta>
                  <NotiTitle $read={read}>{noti.title}</NotiTitle>
                  <NotiDesc>{noti.description}</NotiDesc>
                </NotiContent>
                {!read && <UnreadDot aria-label="읽지 않은 알림" />}
              </NotiCard>
            );
          })}
        </NotiList>
      )}

      {totalPages > 1 && (
        <Pagination aria-label="페이지 탐색">
          <PageBtn
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="이전 페이지"
          >
            ‹
          </PageBtn>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PageBtn
              key={p}
              type="button"
              $active={p === currentPage}
              onClick={() => setCurrentPage(p)}
              aria-label={`${p}페이지`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </PageBtn>
          ))}
          <PageBtn
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="다음 페이지"
          >
            ›
          </PageBtn>
        </Pagination>
      )}
    </PageLayout>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────
const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: 0 0 var(--space-3) 0;
`;

const TabRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  gap: var(--space-3);

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--gray-200);
`;

const TabBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  font-size: 0.88rem;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  color: ${(p) => (p.$active ? 'var(--gray-800)' : 'var(--gray-400)')};
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 150ms ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(p) => (p.$active ? '#c07040' : 'transparent')};
    transition: background 150ms ease;
  }

  &:hover {
    color: var(--gray-800);
  }
`;

const TabBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: #c07040;
  color: var(--white);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 999px;
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
`;

const GhostBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--gray-600);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  background: var(--white);
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    border-color: var(--gray-400);
    color: var(--gray-800);
  }
`;

const PrimaryBtn = styled.button`
  padding: 7px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--white);
  background: #c07040;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: filter 150ms ease;
  white-space: nowrap;

  &:hover {
    filter: brightness(0.92);
  }
`;

const NotiList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-5);
`;

const NotiCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: 18px 20px;
  background: ${(p) => (p.$read ? 'var(--white)' : 'rgba(192, 112, 64, 0.04)')};
  cursor: pointer;
  transition: background 140ms ease;
  position: relative;

  &:hover {
    background: var(--gray-50, #fafaf9);
  }

  &:focus-visible {
    outline: 2px solid #c07040;
    outline-offset: -2px;
  }
`;

const IconWrap = styled.div`
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
`;

const NotiContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotiMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: 4px;
`;

const CategoryLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #c07040;
  background: rgba(192, 112, 64, 0.1);
  padding: 2px 8px;
  border-radius: var(--radius-full);
`;

const TimeLabel = styled.span`
  font-size: 0.75rem;
  color: var(--gray-400);
`;

const NotiTitle = styled.p`
  font-size: 0.92rem;
  font-weight: ${(p) => (p.$read ? '400' : '600')};
  color: var(--gray-800);
  margin-bottom: 3px;
  line-height: 1.4;
`;

const NotiDesc = styled.p`
  font-size: 0.82rem;
  color: var(--gray-500);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadDot = styled.span`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c07040;
  margin-top: 4px;
`;

const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: var(--space-2);
`;

const EmptyIcon = styled.span`
  font-size: 2.5rem;
  margin-bottom: var(--space-2);
`;

const EmptyTitle = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-700);
`;

const EmptyDesc = styled.p`
  font-size: 0.85rem;
  color: var(--gray-400);
`;

const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
`;

const PageBtn = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  border-radius: var(--radius-md);
  border: 1px solid ${(p) => (p.$active ? '#c07040' : 'var(--gray-200)')};
  background: ${(p) => (p.$active ? '#c07040' : 'var(--white)')};
  color: ${(p) => (p.$active ? 'var(--white)' : 'var(--gray-600)')};
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.disabled ? 0.4 : 1)};
  transition: all 140ms ease;

  &:hover:not(:disabled) {
    border-color: #c07040;
    color: ${(p) => (p.$active ? 'var(--white)' : '#c07040')};
  }
`;
