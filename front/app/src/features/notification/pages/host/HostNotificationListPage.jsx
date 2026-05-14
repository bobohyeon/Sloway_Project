import { useState } from 'react';
import styled, { css } from 'styled-components';

// ─── 타입 정의 (백엔드 연동 시 API 응답 스펙에 맞게 수정) ────────────────────
/**
 * @typedef {'reservation' | 'payment' | 'settlement' | 'chat' | 'review' | 'policy' | 'checkin' | 'notice'} HostNotificationType
 * @typedef {'전체' | '안 읽음' | '예약' | '정산'} HostTabType
 *
 * 호스트 알림 탭 구성:
 * - 전체: 모든 알림
 * - 안 읽음: isRead === false
 * - 예약: 예약/운영 관련 (reservation, checkin, chat, review)
 * - 정산: 정산/매출 관련 (settlement, payment, policy)
 */

// ─── Mock 데이터 (백엔드 연동 시 GET /api/host/notifications?tab=&page= 로 대체) ──
const MOCK_HOST_NOTIFICATIONS = [
  {
    id: 1,
    type: 'reservation',
    category: '예약',
    badge: '긴급',   // 배지 레이블 — 중요도 표시용
    title: '새 예약이 들어왔어요 (NEW)',
    description: '박민수님이 예약을 확인받을 5/10-5/12 예약을 신청했어요. 승인해주세요.',
    timeLabel: '방금 전',
    isRead: false,
    tabGroup: '예약',
  },
  {
    id: 2,
    type: 'chat',
    category: '채팅',
    badge: null,
    title: '박민수님이 메시지를 보냈어요',
    description: '체크인 오후 4시쯤 가능할까요? 조금 늦을 것 같아서요.',
    timeLabel: '5분 전',
    isRead: false,
    tabGroup: '예약',
  },
  {
    id: 3,
    type: 'review',
    category: '리뷰',
    badge: null,
    title: '새 리뷰가 달렸어요',
    description: '민정님이 정월 숲속 파인뷰에 ★5점 리뷰를 남겼어요.',
    timeLabel: '2시간 전',
    isRead: false,
    tabGroup: '예약',
  },
  {
    id: 4,
    type: 'settlement',
    category: '정산',
    badge: null,
    title: '정산 예정 알림',
    description: '2026년 5월 5일에 2,992,500원이 지급될 예정입니다.',
    timeLabel: '어제',
    isRead: true,
    tabGroup: '정산',
  },
  {
    id: 5,
    type: 'checkin',
    category: '체크인',
    badge: null,
    title: '내일 체크인 예정',
    description: '홍길동님(정월 숲속 파인뷰) 체크인 · 2026.05.08 오후 3시',
    timeLabel: '어제',
    isRead: true,
    tabGroup: '예약',
  },
  {
    id: 6,
    type: 'notice',
    category: '공지',
    badge: null,
    title: '호스트 공지사항',
    description: '2026년 수수료 정책 개편 안내 · 중요 정책 업데이트',
    timeLabel: '3일 전',
    isRead: true,
    tabGroup: '전체',
  },
  {
    id: 7,
    type: 'review',
    category: '리뷰',
    badge: null,
    title: '새 리뷰가 달렸어요',
    description: '지훈님이 성수 브릭라운지에 ★5점 리뷰를 남겼어요.',
    timeLabel: '5일 전',
    isRead: true,
    tabGroup: '예약',
  },
  {
    id: 8,
    type: 'policy',
    category: '정책',
    badge: null,
    title: '수수료 정책 개편',
    description: '2026년 1월부터 코위킹오피스 수수료가 10%로 인하됐어요.',
    timeLabel: '1주 전',
    isRead: true,
    tabGroup: '정산',
  },
];

// ─── 탭 옵션 정의 ─────────────────────────────────────────────────────────────
const TAB_OPTIONS = [
  { label: '전체', key: '전체' },
  { label: '안 읽음', key: '안 읽음' },
  { label: '예약', key: '예약' },
  { label: '정산', key: '정산' },
];

// 알림 타입별 아이콘 — 호스트 중심 타입으로 재정의
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

// 알림 타입별 배경색 — 디자인 시스템 토큰으로 이동 권장
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

// ─── 페이지 단위 상수 ─────────────────────────────────────────────────────────
const PAGE_SIZE = 8; // 백엔드 연동 시 서버 페이지 사이즈와 맞출 것

export default function HostNotificationListPage() {
  const [activeTab, setActiveTab] = useState('전체');
  // 낙관적 업데이트(Optimistic Update): UI를 즉시 반영하고
  // 백엔드 연동 시 실패하면 롤백하는 패턴
  // 백엔드 연동 시: PATCH /api/host/notifications/:id/read 호출 후 실패 시 롤백
  const [readIds, setReadIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // 탭 필터링 — 백엔드 연동 시 쿼리 파라미터로 이동
  const filtered = MOCK_HOST_NOTIFICATIONS.filter((n) => {
    if (activeTab === '전체') return true;
    if (activeTab === '안 읽음') return !n.isRead && !readIds.has(n.id);
    return n.tabGroup === activeTab;
  });

  // 클라이언트 페이지네이션 — 백엔드 연동 시 서버 페이지네이션으로 교체
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 안 읽음 카운트 — 탭 뱃지 표시용
  const unreadCount = MOCK_HOST_NOTIFICATIONS.filter(
    (n) => !n.isRead && !readIds.has(n.id)
  ).length;

  const tabCount = (key) => {
    if (key === '안 읽음') return unreadCount;
    return null;
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1); // 탭 변경 시 항상 첫 페이지로 리셋
  };

  // 단일 읽음 처리 — 낙관적 업데이트
  const handleRead = (id) => {
    setReadIds((prev) => new Set([...prev, id]));
    // TODO: PATCH /api/host/notifications/:id/read
  };

  // 전체 읽음 — 백엔드 연동 시 PATCH /api/host/notifications/read-all
  const handleReadAll = () => {
    const allIds = MOCK_HOST_NOTIFICATIONS.map((n) => n.id);
    setReadIds(new Set(allIds));
    // TODO: PATCH /api/host/notifications/read-all
  };

  const isRead = (n) => n.isRead || readIds.has(n.id);

  return (
    <Wrap>
      {/* 헤더 */}
      <PageHeader>
        <HeaderLeft>
          <PageTitle>알림 내역</PageTitle>
          <PageDesc>호스트 활동에 대한 알림을 확인하세요</PageDesc>
        </HeaderLeft>
        <HeaderRight>
          <GhostBtn
            type="button"
            onClick={() => { /* TODO: navigate('/host/notifications/settings') */ }}
            aria-label="알림 설정으로 이동"
          >
            ⚙ 알림 설정
          </GhostBtn>
          {unreadCount > 0 && (
            <PrimaryBtn type="button" onClick={handleReadAll}>
              전체 읽음 ({unreadCount})
            </PrimaryBtn>
          )}
        </HeaderRight>
      </PageHeader>

      <Divider />

      {/* 탭 */}
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
            {tabCount(key) != null && tabCount(key) > 0 && (
              <TabBadge>{tabCount(key)}</TabBadge>
            )}
          </TabBtn>
        ))}
      </TabList>

      {/* 알림 목록 */}
      {paginated.length === 0 ? (
        <EmptyWrap>
          <EmptyIcon aria-hidden="true">🔔</EmptyIcon>
          <EmptyTitle>알림이 없습니다</EmptyTitle>
          <EmptyDesc>새로운 알림이 오면 여기서 확인하실 수 있어요.</EmptyDesc>
        </EmptyWrap>
      ) : (
        <NotiList>
          {paginated.map((noti) => {
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
                {/* 타입 아이콘 */}
                <IconWrap style={{ background: TYPE_BG[noti.type] }}>
                  <span aria-hidden="true">{TYPE_ICON[noti.type]}</span>
                </IconWrap>

                {/* 본문 */}
                <NotiContent>
                  <NotiMeta>
                    <CategoryLabel>{noti.category}</CategoryLabel>
                    {/* 긴급 배지 — 호스트 특화: 즉각 조치 필요한 알림에만 표시 */}
                    {noti.badge && (
                      <UrgentBadge aria-label={`${noti.badge} 알림`}>
                        {noti.badge}
                      </UrgentBadge>
                    )}
                    <TimeLabel>{noti.timeLabel}</TimeLabel>
                  </NotiMeta>
                  <NotiTitle $read={read}>{noti.title}</NotiTitle>
                  <NotiDesc>{noti.description}</NotiDesc>
                </NotiContent>

                {/* 안 읽음 인디케이터 */}
                {!read && <UnreadDot aria-label="읽지 않은 알림" />}
              </NotiCard>
            );
          })}
        </NotiList>
      )}

      {/* 페이지네이션 — 백엔드 연동 시 totalPages를 API 응답값으로 교체 */}
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
    </Wrap>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const Wrap = styled.div`
  padding: var(--space-6);
  max-width: 860px;
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
  margin-bottom: var(--space-4);

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const HeaderLeft = styled.div``;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
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

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: 0 0 var(--space-3) 0;
`;

const TabList = styled.div`
  display: flex;
  gap: 0;
  border-bottom: 2px solid var(--gray-200);
  margin-bottom: var(--space-4);
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

  /* 활성 탭 하단 라인 */
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${(p) => (p.$active ? 'var(--sage)' : 'transparent')};
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
  background: var(--sage);
  color: var(--white);
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 999px;
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
  background: var(--sage);
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
  background: ${(p) =>
    p.$read ? 'var(--white)' : 'rgba(168, 184, 159, 0.05)'};
  cursor: pointer;
  transition: background 140ms ease;
  position: relative;

  &:hover {
    background: var(--gray-50, #fafaf9);
  }

  &:focus-visible {
    outline: 2px solid var(--sage);
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
  color: var(--sage);
  background: rgba(168, 184, 159, 0.15);
  padding: 2px 8px;
  border-radius: var(--radius-full);
`;

// 호스트 특화: 즉각 조치 필요 알림 강조 배지
const UrgentBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  color: #c0392b;
  background: rgba(192, 57, 43, 0.1);
  padding: 2px 7px;
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
  background: var(--sage);
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
  border: 1px solid ${(p) => (p.$active ? 'var(--sage)' : 'var(--gray-200)')};
  background: ${(p) => (p.$active ? 'var(--sage)' : 'var(--white)')};
  color: ${(p) => (p.$active ? 'var(--white)' : 'var(--gray-600)')};
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  opacity: ${(p) => (p.disabled ? 0.4 : 1)};
  transition: all 140ms ease;

  &:hover:not(:disabled) {
    border-color: var(--sage);
    color: ${(p) => (p.$active ? 'var(--white)' : 'var(--sage)')};
  }
`;
