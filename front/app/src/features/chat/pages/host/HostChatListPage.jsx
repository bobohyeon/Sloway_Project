import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─── Mock 데이터 (백엔드 연동 시 GET /api/host/chats?tab= 로 대체) ──────────
// 호스트 뷰: 게스트 이름 + 예약 상태 + 긴급 여부가 추가됨
const MOCK_HOST_ROOMS = [
  {
    id: 1,
    guestName: '박민수',
    spaceName: '청평 숲속 파인뷰',
    lastMessage: '체크인 오후 4시쯤 가능할까요? 조금 늦을 것 같아요.',
    timeLabel: '14:32',
    unreadCount: 2,
    avatarInitial: '박',
    avatarBg: '#e8b4a0',
  },
  {
    id: 2,
    guestName: '홍길동',
    spaceName: '청평 숲속 파인뷰',
    lastMessage: '도착 시간 알려드릴게요. 2시쯤 예상이에요!',
    timeLabel: '어제',
    unreadCount: 0,
    avatarInitial: '홍',
    avatarBg: '#e8b4a0',
  },
  {
    id: 3,
    guestName: '이지은',
    spaceName: '성수 브릭라운지',
    lastMessage: '네 감사합니다. 다음에 또 이용할게요.',
    timeLabel: '4/18',
    unreadCount: 0,
    avatarInitial: '이',
    avatarBg: '#e8c4a0',
  },
  {
    id: 4,
    guestName: '김수원',
    spaceName: '강릉 바다성 키언워크',
    lastMessage: '주차 가능한가요?',
    timeLabel: '4/02',
    unreadCount: 0,
    avatarInitial: '김',
    avatarBg: '#e8c4a0',
  },
  {
    id: 5,
    guestName: '정유리',
    spaceName: '청평 숲속 파인뷰',
    lastMessage: '[이미지]',
    timeLabel: '3/20',
    unreadCount: 0,
    avatarInitial: '정',
    avatarBg: '#e8c4a0',
  },
];

const TAB_OPTIONS = [
  { key: '전체', label: '전체' },
  { key: '안읽음', label: '안 읽음' },
];

export default function HostChatListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  const unreadCount = MOCK_HOST_ROOMS.filter((r) => r.unreadCount > 0).length;

  const filtered = MOCK_HOST_ROOMS.filter((room) => {
    const matchTab =
      activeTab === '전체' || (activeTab === '안읽음' && room.unreadCount > 0);
    const matchSearch =
      !searchKeyword ||
      room.guestName.includes(searchKeyword) ||
      room.spaceName.includes(searchKeyword);
    return matchTab && matchSearch;
  });

  const getTabCount = (key) => {
    if (key === '안읽음') return unreadCount;
    return MOCK_HOST_ROOMS.length;
  };

  return (
    <PageLayout
      title="1:1 채팅"
      description="게스트와 나눈 대화를 관리하세요"
      maxWidth={860}
    >
      <Divider />

      <ToolRow>
        <TabList role="tablist" aria-label="채팅 필터">
          {TAB_OPTIONS.map(({ key, label }) => (
            <TabBtn
              key={key}
              role="tab"
              aria-selected={activeTab === key}
              $active={activeTab === key}
              onClick={() => setActiveTab(key)}
              type="button"
            >
              {label}
              <TabBadge $urgent={key === '긴급'}>{getTabCount(key)}</TabBadge>
            </TabBtn>
          ))}
        </TabList>

        <SearchWrap>
          <SearchIcon aria-hidden="true">🔍</SearchIcon>
          <SearchInput
            placeholder="게스트·공간 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            aria-label="채팅 검색"
          />
        </SearchWrap>
      </ToolRow>

      {filtered.length === 0 ? (
        <EmptyWrap>
          <EmptyIcon aria-hidden="true">💬</EmptyIcon>
          <EmptyTitle>채팅이 없습니다</EmptyTitle>
          <EmptyDesc>게스트의 채팅이 오면 여기서 확인할 수 있어요.</EmptyDesc>
        </EmptyWrap>
      ) : (
        <RoomList>
          {filtered.map((room) => {
            return (
              <RoomCard
                key={room.id}
                $unread={room.unreadCount > 0}
                onClick={() => navigate(`/host/chat/${room.id}`)}
                role="button"
                tabIndex={0}
                aria-label={`${room.guestName} 게스트 채팅${room.unreadCount > 0 ? `, 읽지 않은 메시지 ${room.unreadCount}개` : ''}`}
                onKeyDown={(e) =>
                  e.key === 'Enter' && navigate(`/host/chat/${room.id}`)
                }
              >
                {/* 게스트 아바타 — 이름 첫 글자 */}
                <GuestAvatar
                  style={{ background: room.avatarBg }}
                  aria-hidden="true"
                >
                  {room.avatarInitial}
                </GuestAvatar>

                <RoomContent>
                  <RoomTop>
                    <NameArea>
                      <GuestName $unread={room.unreadCount > 0}>
                        {room.guestName}
                      </GuestName>
                    </NameArea>
                    <RoomTime>{room.timeLabel}</RoomTime>
                  </RoomTop>
                  <SpaceName>📍 {room.spaceName}</SpaceName>
                  <LastMessage $unread={room.unreadCount > 0}>
                    {room.lastMessage}
                  </LastMessage>
                </RoomContent>

                {room.unreadCount > 0 && (
                  <UnreadBadge
                    aria-label={`읽지 않은 메시지 ${room.unreadCount}개`}
                  >
                    {room.unreadCount}
                  </UnreadBadge>
                )}
              </RoomCard>
            );
          })}
        </RoomList>
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

const ToolRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 2px solid var(--gray-200);
`;

const TabBtn = styled.button`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 0.88rem;
  font-weight: ${(p) => (p.$active ? '600' : '400')};
  color: ${(p) => (p.$active ? 'var(--gray-800)' : 'var(--gray-400)')};
  background: transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color 150ms;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    /* 호스트 테마: sage 대신 따뜻한 갈색 계열 */
    background: ${(p) => (p.$active ? '#c07040' : 'transparent')};
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

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-full);
  background: var(--white);
  min-width: 200px;

  &:focus-within {
    border-color: #c07040;
  }
`;

const SearchIcon = styled.span`
  font-size: 0.85rem;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  font-size: 0.85rem;
  color: var(--gray-800);
  background: transparent;
  outline: none;
  border: none;
  font-family: inherit;
  &::placeholder {
    color: var(--gray-400);
  }
`;

const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RoomCard = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 18px 20px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition:
    box-shadow 150ms,
    border-color 150ms;

  &:hover {
    border-color: var(--gray-300);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid #c07040;
    outline-offset: 2px;
  }
`;

const GuestAvatar = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--white);
`;

const RoomContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const RoomTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
`;

const NameArea = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const GuestName = styled.span`
  font-size: 0.95rem;
  font-weight: ${(p) => (p.$unread ? '700' : '500')};
  color: var(--gray-800);
`;

const RoomTime = styled.span`
  font-size: 0.75rem;
  color: var(--gray-400);
  flex-shrink: 0;
`;

const SpaceName = styled.p`
  font-size: 0.78rem;
  color: #c07040;
  margin-bottom: 4px;
`;

const LastMessage = styled.p`
  font-size: 0.85rem;
  color: ${(p) => (p.$unread ? 'var(--gray-700)' : 'var(--gray-400)')};
  font-weight: ${(p) => (p.$unread ? '500' : '400')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  background: #c07040;
  color: var(--white);
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 999px;
`;

const EmptyWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
