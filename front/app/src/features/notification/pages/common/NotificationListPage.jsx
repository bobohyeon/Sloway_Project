import { useState } from 'react';
import styled, { css } from 'styled-components';

// ─── 타입 정의 (백엔드 연동 시 API 응답 스펙에 맞게 수정) ────────────────────
/**
 * @typedef {'chat' | 'reservation' | 'payment' | 'point' | 'coupon' | 'review' | 'inquiry' | 'event'} NotificationType
 * @typedef {'전체' | '안 읽음' | '예약·결제' | '이벤트'} TabType
 */

// ─── Mock 데이터 (백엔드 연동 시 GET /api/notifications?tab=&page= 로 대체) ──
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'chat',
    category: '채팅',
    title: '청량스테이님이 메시지를 보냈어요',
    description: '체크인 관련 안내드립니다. 도착 예정 시간 알려주세요!',
    timeLabel: '방금 전',
    isRead: false,
    tabGroup: '안 읽음',
  },
  {
    id: 2,
    type: 'reservation',
    category: '예약',
    title: '체크인 D-1 안내',
    description: '내일 오후 3시 체크인 예정이에요. 즐거운 위케이션 되세요!',
    timeLabel: '5분 전',
    isRead: false,
    tabGroup: '안 읽음',
  },
  {
    id: 3,
    type: 'payment',
    category: '결제',
    title: '결제가 완료됐어요',
    description: '청량 숲속 파인뷰 스테이 · 326,500원 결제 완료',
    timeLabel: '1시간 전',
    isRead: true,
    tabGroup: '예약·결제',
  },
  {
    id: 4,
    type: 'point',
    category: '포인트',
    title: '포인트가 적립됐어요',
    description: '+4,440P · 제주 돌담길 리트릿 이용 완료 적립',
    timeLabel: '어제',
    isRead: true,
    tabGroup: '예약·결제',
  },
  {
    id: 5,
    type: 'coupon',
    category: '쿠폰',
    title: '쿠폰이 곧 만료돼요',
    description: '"신규 회원 첫 예약 20,000원 할인" 쿠폰이 D-6 만료 예정',
    timeLabel: '2일 전',
    isRead: true,
    tabGroup: '예약·결제',
  },
  {
    id: 6,
    type: 'review',
    category: '리뷰',
    title: '리뷰 답글이 달렸어요',
    description: '성수 브릭라운지 호스트님이 리뷰에 답글을 남겼어요',
    timeLabel: '3일 전',
    isRead: true,
    tabGroup: '전체',
  },
  {
    id: 7,
    type: 'inquiry',
    category: '문의',
    title: '문의 답변이 등록됐어요',
    description: '"결제 오류 관련 문의"에 대한 답변이 달렸어요',
    timeLabel: '3일 전',
    isRead: true,
    tabGroup: '전체',
  },
  {
    id: 8,
    type: 'event',
    category: '이벤트',
    title: '5월 봄맞이 15% 할인 쿠폰이 도착했어요',
    description: '위크엔스테이 전체 적용 · 5/7까지 유효',
    timeLabel: '1주 전',
    isRead: true,
    tabGroup: '이벤트',
  },
];

// 탭별 카운트 계산 (백엔드 연동 시 API 응답의 counts 필드로 대체)
const TAB_OPTIONS = [
  { label: '전체', key: '전체' },
  { label: '안 읽음', key: '안 읽음' },
  { label: '예약·결제', key: '예약·결제' },
  { label: '이벤트', key: '이벤트' },
];

// 알림 타입별 이모지 아이콘 (백엔드 연동 시 type 필드 기준으로 매핑)
const TYPE_ICON = {
  chat: '💬',
  reservation: '📅',
  payment: '💳',
  point: '🌿',
  coupon: '🎟️',
  review: '⭐',
  inquiry: '📋',
  event: '🎁',
};

// 알림 타입별 배경색 (디자인 시스템 토큰으로 이동 권장)
const TYPE_BG = {
  chat: 'rgba(168, 184, 159, 0.15)',
  reservation: 'rgba(220, 100, 80, 0.1)',
  payment: 'rgba(200, 160, 80, 0.1)',
  point: 'rgba(100, 160, 100, 0.12)',
  coupon: 'rgba(200, 140, 60, 0.1)',
  review: 'rgba(240, 180, 60, 0.12)',
  inquiry: 'rgba(100, 130, 200, 0.1)',
  event: 'rgba(200, 100, 140, 0.1)',
};

// ─── 페이지 단위 상수 ─────────────────────────────────────────────────────────
const PAGE_SIZE = 8; // 백엔드 연동 시 서버 페이지 사이즈와 맞출 것

export default function NotificationListPage() {
  const [activeTab, setActiveTab] = useState('전체');
  // 읽음 상태는 로컬에서 낙관적 업데이트(Optimistic Update) 처리
  // 백엔드 연동 시: PATCH /api/notifications/:id/read 호출 후 실패 시 롤백
  const [readIds, setReadIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // 탭 필터링 — 백엔드 연동 시 쿼리 파라미터로 이동
  const filtered = MOCK_NOTIFICATIONS.filter((n) => {
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

  // 탭별 안 읽음 카운트 계산
  const unreadCount = MOCK_NOTIFICATIONS.filter(
    (n) => !n.isRead && !readIds.has(n.id)
  ).length;

  const tabCount = (key) => {
    if (key === '안 읽음') return unreadCount;
    return null; // 다른 탭은 카운트 미표시
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setCurrentPage(1); // 탭 변경 시 첫 페이지로 리셋
  };

  // 단일 알림 읽음 처리
  const handleRead = (id) => {
    setReadIds((prev) => new Set([...prev, id]));
    // TODO: PATCH /api/notifications/:id/read
  };

  // 전체 읽음 처리 — 백엔드 연동 시 PATCH /api/notifications/read-all
  const handleReadAll = () => {
    const allIds = MOCK_NOTIFICATIONS.map((n) => n.id);
    setReadIds(new Set(allIds));
    // TODO: PATCH /api/notifications/read-all
  };

  const isRead = (n) => n.isRead || readIds.has(n.id);

  return (
    <Wrap>
      {/* 헤더 */}
      <PageHeader>
        <PageTitle>알림 내역</PageTitle>
        <PageDesc>놓친 알림이 있는지 확인하세요</PageDesc>
      </PageHeader>

      <Divider />

      {/* 탭 + 우측 액션 */}
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
              {tabCount(key) != null && tabCount(key) > 0 && (
                <TabBadge>{tabCount(key)}</TabBadge>
              )}
            </TabBtn>
          ))}
        </TabList>

        <ActionArea>
          <GhostBtn
            type="button"
            onClick={() => {
              /* TODO: navigate to /notifications/settings */
            }}
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
                {/* 아이콘 */}
                <IconWrap style={{ background: TYPE_BG[noti.type] }}>
                  <span aria-hidden="true">{TYPE_ICON[noti.type]}</span>
                </IconWrap>

                {/* 본문 */}
                <NotiContent>
                  <NotiMeta>
                    <CategoryLabel>{noti.category}</CategoryLabel>
                    <TimeLabel>{noti.timeLabel}</TimeLabel>
                  </NotiMeta>
                  <NotiTitle $read={read}>{noti.title}</NotiTitle>
                  <NotiDesc>{noti.description}</NotiDesc>
                </NotiContent>

                {/* 안 읽음 닷 */}
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
  margin-bottom: var(--space-4);
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
