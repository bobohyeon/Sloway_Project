import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─── Mock 데이터 (백엔드 연동 시 GET /api/chats?tab= 로 대체) ─────────────────
const MOCK_CHAT_ROOMS = [
  {
    id: 1,
    hostName: '청평스테이',
    spaceName: '청평 숲속 파인뷰 스테이',
    avatarEmoji: '🌲',
    avatarBg: '#d4e6d0',
    lastMessage: '체크인 관련 안내드립니다. 도착 예정 시간 알려주세요!',
    timeLabel: '14:32',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 2,
    hostName: '성수브릭',
    spaceName: '성수 브릭라운지',
    avatarEmoji: '🧱',
    avatarBg: '#e8d5c4',
    lastMessage: '네, 주차 가능합니다. 예약 번호 알려주시면 안내해드릴게요.',
    timeLabel: '어제',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: 3,
    hostName: '돌담집호스트',
    spaceName: '제주 돌담집 리트릿',
    avatarEmoji: '🌴',
    avatarBg: '#c8dfc8',
    lastMessage: '즐거운 시간 보내셨길 바랍니다 :) 다음에 또 놀러오세요!',
    timeLabel: '4/17',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 4,
    hostName: '바다향커먼',
    spaceName: '강릉 바다향 키언워크',
    avatarEmoji: '🌊',
    avatarBg: '#c4d8e8',
    lastMessage: '[이미지]',
    timeLabel: '4/02',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 5,
    hostName: '남해올리브',
    spaceName: '남해 올리브 팜스테이',
    avatarEmoji: '🫒',
    avatarBg: '#dde8c4',
    lastMessage: '환불 요청 확인했습니다. 죄송해요 ㅠㅠ',
    timeLabel: '3/20',
    unreadCount: 0,
    isOnline: false,
  },
];

const TAB_OPTIONS = [
  { key: '전체', label: '전체' },
  { key: '안읽음', label: '안읽음' },
];

export default function UserChatListPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('전체');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 탭 + 검색 필터 — 백엔드 연동 시 쿼리 파라미터로 이동
  const filtered = MOCK_CHAT_ROOMS.filter((room) => {
    const matchTab =
      activeTab === '전체' || (activeTab === '안읽음' && room.unreadCount > 0);
    const matchSearch =
      !searchKeyword ||
      room.hostName.includes(searchKeyword) ||
      room.spaceName.includes(searchKeyword);
    return matchTab && matchSearch;
  });

  const totalUnread = MOCK_CHAT_ROOMS.reduce(
    (acc, r) => acc + r.unreadCount,
    0
  );
  const unreadCount = MOCK_CHAT_ROOMS.filter((r) => r.unreadCount > 0).length;

  return (
    <PageLayout title="1:1 채팅" description="호스트와 나눈 대화를 확인하세요">
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
              {key === '안읽음' && unreadCount > 0 && (
                <TabBadge>{unreadCount}</TabBadge>
              )}
            </TabBtn>
          ))}
        </TabList>

        <SearchWrap>
          <SearchIcon aria-hidden="true">🔍</SearchIcon>
          <SearchInput
            placeholder="호스트·공간 검색"
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
          <EmptyDesc>예약 후 호스트와 채팅을 시작해보세요.</EmptyDesc>
        </EmptyWrap>
      ) : (
        <RoomList>
          {filtered.map((room) => (
            <RoomCard
              key={room.id}
              $unread={room.unreadCount > 0}
              onClick={() => navigate(`/user/chat/${room.id}`)}
              role="button"
              tabIndex={0}
              aria-label={`${room.hostName}과의 채팅${room.unreadCount > 0 ? `, 읽지 않은 메시지 ${room.unreadCount}개` : ''}`}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/user/chat/${room.id}`)}
            >
              <AvatarWrap style={{ background: room.avatarBg }}>
                <AvatarEmoji aria-hidden="true">{room.avatarEmoji}</AvatarEmoji>
                {room.isOnline && <OnlineDot aria-label="온라인" />}
              </AvatarWrap>

              <RoomContent>
                <RoomTop>
                  <RoomName $unread={room.unreadCount > 0}>
                    {room.hostName}
                  </RoomName>
                  <RoomTime>{room.timeLabel}</RoomTime>
                </RoomTop>
                <SpaceName>{room.spaceName}</SpaceName>
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
          ))}
        </RoomList>
      )}
    </PageLayout>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────
/*
  스크롤 구조 설명:
  이 Wrap은 max-width로 콘텐츠 너비만 제한합니다.
  스크롤은 부모 레이아웃(예: <main> 또는 body)에서 발생해야 합니다.
  부모에 height:100vh + overflow:auto가 있으면 스크롤바가 컨테이너 안에 갇힙니다.
  → 부모를 min-height:100vh 로 바꾸고 overflow 제거하세요.
*/

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
    background: ${(p) => (p.$active ? 'var(--sage)' : 'transparent')};
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
    border-color: var(--sage);
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
    box-shadow 150ms ease,
    border-color 150ms ease;

  &:hover {
    border-color: var(--gray-300);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  &:focus-visible {
    outline: 2px solid var(--sage);
    outline-offset: 2px;
  }
`;

const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AvatarEmoji = styled.span`
  font-size: 1.5rem;
`;

const OnlineDot = styled.span`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4caf50;
  border: 2px solid var(--white);
`;

const RoomContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const RoomTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const RoomName = styled.span`
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
  color: var(--sage);
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
  background: var(--sage);
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
