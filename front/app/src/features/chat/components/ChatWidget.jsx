import { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { FaCommentDots, FaArrowLeft, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import dayjs from 'dayjs';
import {
  getUserChatRooms,
  getHostChatRooms,
  getUserChatMessages,
  getHostChatMessages,
  markUserChatRead,
  markHostChatRead,
  userCreateOrGetRoomByPlace,
} from '../api/chatApi';
import { searchSpaces } from '../../searchPlace/api/searchApi';

const WS_URL = import.meta.env.DEV
  ? 'http://localhost:8080/ws'
  : 'https://api.sloway.store/ws';

function fmtTime(iso) {
  if (!iso) return '';
  const d = dayjs(iso);
  const now = dayjs();
  if (d.isSame(now, 'day')) return d.format('HH:mm');
  if (d.isSame(now.subtract(1, 'day'), 'day')) return '어제';
  return d.format('M/D');
}

function fmtMsgTime(iso) {
  return iso ? dayjs(iso).format('HH:mm') : '';
}

export default function ChatWidget() {
  const user = useSelector((s) => s.auth.user);
  const chatRole = user?.role === 'H' ? 'host' : user?.role === 'U' ? 'user' : null;

  // ─── 패널 상태 ───────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'detail' | 'create'

  // ─── 방 목록 ─────────────────────────────────────────────────────────────
  const [rooms, setRooms] = useState([]);
  const [totalUnread, setTotalUnread] = useState(0);

  // ─── 채팅 상세 ───────────────────────────────────────────────────────────
  const [activeRoom, setActiveRoom] = useState(null); // { roomId, counterpartName, spaceName }
  const activeRoomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ─── 공간 검색 (create view) ─────────────────────────────────────────────
  const [placeQuery, setPlaceQuery] = useState('');
  const [placeResults, setPlaceResults] = useState([]);
  const [placeSearching, setPlaceSearching] = useState(false);
  const [creating, setCreating] = useState(false);
  const placeTimerRef = useRef(null);

  // ─── WebSocket ───────────────────────────────────────────────────────────
  const stompRef = useRef(null);

  // ─── 방 목록 로드 + WS 구독 ──────────────────────────────────────────────
  const loadRooms = useCallback(() => {
    if (!chatRole) return;
    const fetch = chatRole === 'host' ? getHostChatRooms : getUserChatRooms;
    fetch()
      .then((data) => {
        setRooms(data);
        setTotalUnread(data.reduce((acc, r) => acc + (r.unreadCount || 0), 0));
      })
      .catch(() => {});
  }, [chatRole]);

  // 마운트 시 방 목록 + WS 뱃지 구독
  useEffect(() => {
    if (!chatRole || !user?.memberNo) return;

    const fetch = chatRole === 'host' ? getHostChatRooms : getUserChatRooms;
    let client = null;

    fetch()
      .then((data) => {
        setRooms(data);
        setTotalUnread(data.reduce((acc, r) => acc + (r.unreadCount || 0), 0));
        if (!data.length) return;

        client = new Client({
          webSocketFactory: () => new SockJS(WS_URL),
          reconnectDelay: 5000,
          onConnect: () => {
            data.forEach((room) => {
              client.subscribe(`/sub/${room.roomId}`, (frame) => {
                const msg = JSON.parse(frame.body);

                // 현재 열린 방이면 메시지 추가
                if (activeRoomRef.current === room.roomId) {
                  setMessages((prev) =>
                    prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
                  );
                  // 내 방 unread는 실시간으로 읽음 처리
                  if (msg.senderNo !== user.memberNo) {
                    const mark = chatRole === 'host' ? markHostChatRead : markUserChatRead;
                    mark(room.roomId).catch(() => {});
                  }
                } else if (msg.senderNo !== user.memberNo) {
                  // 다른 방 메시지 → 뱃지 증가
                  setTotalUnread((prev) => prev + 1);
                  setRooms((prev) =>
                    prev.map((r) =>
                      r.roomId === room.roomId
                        ? { ...r, lastMessage: msg.content, lastMessageTime: msg.createdAt, unreadCount: r.unreadCount + 1 }
                        : r
                    )
                  );
                }
              });
            });
          },
        });
        client.activate();
        stompRef.current = client;
      })
      .catch(() => {});

    return () => {
      client?.deactivate();
      stompRef.current = null;
    };
  }, [chatRole, user?.memberNo]);

  // 패널 열릴 때 방 목록 최신화
  useEffect(() => {
    if (isOpen && view === 'list') loadRooms();
  }, [isOpen]);

  // ─── 채팅방 열기 ─────────────────────────────────────────────────────────
  const openRoom = useCallback(
    (room) => {
      setActiveRoom(room);
      activeRoomRef.current = room.roomId;
      setMessages([]);
      setMsgLoading(true);
      setView('detail');

      const fetchMsgs = chatRole === 'host' ? getHostChatMessages : getUserChatMessages;
      const markRead = chatRole === 'host' ? markHostChatRead : markUserChatRead;

      fetchMsgs(room.roomId)
        .then((data) => setMessages(data))
        .catch(() => {})
        .finally(() => setMsgLoading(false));

      markRead(room.roomId).catch(() => {});

      // 뱃지 즉시 차감
      setTotalUnread((prev) => Math.max(0, prev - (room.unreadCount || 0)));
      setRooms((prev) =>
        prev.map((r) => (r.roomId === room.roomId ? { ...r, unreadCount: 0 } : r))
      );
    },
    [chatRole]
  );

  // 목록으로 돌아가기
  const backToList = useCallback(() => {
    setView('list');
    setActiveRoom(null);
    activeRoomRef.current = null;
    setMessages([]);
    setInputText('');
    loadRooms();
  }, [loadRooms]);

  // ─── 메시지 전송 ─────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed || !stompRef.current?.connected || !activeRoom) return;

    stompRef.current.publish({
      destination: `/pub/${activeRoom.roomId}`,
      body: JSON.stringify({
        roomId: activeRoom.roomId,
        content: trimmed,
        senderNo: user?.memberNo,
      }),
    });
    setInputText('');
    inputRef.current?.focus();
  }, [inputText, activeRoom, user?.memberNo]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  // 새 메시지 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // ─── 공간 검색 ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (view !== 'create') return;
    clearTimeout(placeTimerRef.current);
    if (!placeQuery.trim()) { setPlaceResults([]); return; }
    setPlaceSearching(true);
    placeTimerRef.current = setTimeout(() => {
      searchSpaces({})
        .then((data) => {
          const kw = placeQuery.trim().toLowerCase();
          setPlaceResults(data.filter((p) => p.title?.toLowerCase().includes(kw)).slice(0, 10));
        })
        .catch(() => setPlaceResults([]))
        .finally(() => setPlaceSearching(false));
    }, 300);
    return () => clearTimeout(placeTimerRef.current);
  }, [placeQuery, view]);

  const handleSelectPlace = useCallback(
    async (place) => {
      if (creating) return;
      setCreating(true);
      try {
        const room = await userCreateOrGetRoomByPlace(place.entityNo, place.type);
        setPlaceQuery('');
        setPlaceResults([]);
        openRoom({ roomId: room.roomId, counterpartName: room.counterpartName, spaceName: room.spaceName, unreadCount: room.unreadCount || 0 });
      } catch {
        alert('채팅방을 만들 수 없어요. 잠시 후 다시 시도해주세요.');
      } finally {
        setCreating(false);
      }
    },
    [creating, openRoom]
  );

  const openCreate = () => {
    setPlaceQuery('');
    setPlaceResults([]);
    setView('create');
  };

  const closeWidget = () => {
    setIsOpen(false);
    setView('list');
    setActiveRoom(null);
    activeRoomRef.current = null;
    setMessages([]);
    setInputText('');
  };

  if (!chatRole) return null;

  // ─── 패널 헤더 타이틀 ────────────────────────────────────────────────────
  const panelTitle =
    view === 'detail'
      ? activeRoom?.counterpartName ?? '채팅'
      : view === 'create'
      ? '공간 검색'
      : '채팅';

  return (
    <WidgetWrap>
      {/* 패널 */}
      {isOpen && (
        <Panel>
          <PanelHeader>
            <PanelLeft>
              {view !== 'list' && (
                <BackBtn onClick={backToList} title="목록으로">
                  <FaArrowLeft size={13} />
                </BackBtn>
              )}
              <PanelTitle>{panelTitle}</PanelTitle>
              {view === 'detail' && activeRoom?.spaceName && (
                <SpaceTag>{activeRoom.spaceName}</SpaceTag>
              )}
            </PanelLeft>
            <CloseBtn onClick={closeWidget} title="닫기">
              <FaTimes size={14} />
            </CloseBtn>
          </PanelHeader>

          {/* ── 목록 뷰 ── */}
          {view === 'list' && (
            <>
              <RoomListArea>
                {rooms.length === 0 ? (
                  <EmptyMsg>채팅방이 없습니다</EmptyMsg>
                ) : (
                  rooms.map((room) => (
                    <RoomRow key={room.roomId} onClick={() => openRoom(room)}>
                      <RoomAvatar>{room.counterpartName?.[0] ?? '?'}</RoomAvatar>
                      <RoomContent>
                        <RoomTop>
                          <RoomName $unread={room.unreadCount > 0}>{room.counterpartName}</RoomName>
                          <RoomTime>{fmtTime(room.lastMessageTime)}</RoomTime>
                        </RoomTop>
                        {room.spaceName && <RoomSpace>{room.spaceName}</RoomSpace>}
                        <RoomLast $unread={room.unreadCount > 0}>
                          {room.lastMessage ?? '대화를 시작해보세요'}
                        </RoomLast>
                      </RoomContent>
                      {room.unreadCount > 0 && <UnreadDot>{room.unreadCount}</UnreadDot>}
                    </RoomRow>
                  ))
                )}
              </RoomListArea>
              {chatRole === 'user' && (
                <ListFooter>
                  <CreateRoomBtn onClick={openCreate}>+ 채팅방 만들기</CreateRoomBtn>
                </ListFooter>
              )}
            </>
          )}

          {/* ── 채팅 상세 뷰 ── */}
          {view === 'detail' && (
            <>
              <MessageArea>
                {msgLoading ? (
                  <EmptyMsg>메시지를 불러오는 중...</EmptyMsg>
                ) : messages.length === 0 ? (
                  <EmptyMsg>첫 메시지를 보내보세요!</EmptyMsg>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderNo === user?.memberNo;
                    const showDate =
                      idx === 0 ||
                      !dayjs(msg.createdAt).isSame(dayjs(messages[idx - 1].createdAt), 'day');
                    return (
                      <div key={msg.id ?? `t${idx}`}>
                        {showDate && (
                          <DateLine>
                            {dayjs(msg.createdAt).format('YYYY년 M월 D일')}
                          </DateLine>
                        )}
                        {isMe ? (
                          <MyRow>
                            <MyBubbleWrap>
                              <MsgTime style={{ textAlign: 'right' }}>
                                나 · {fmtMsgTime(msg.createdAt)}
                              </MsgTime>
                              <MyBubble>{msg.content}</MyBubble>
                            </MyBubbleWrap>
                          </MyRow>
                        ) : (
                          <OtherRow>
                            <MiniAvatar>{msg.senderName?.[0] ?? '?'}</MiniAvatar>
                            <OtherBubbleWrap>
                              <OtherBubble>{msg.content}</OtherBubble>
                              <MsgTime>{fmtMsgTime(msg.createdAt)}</MsgTime>
                            </OtherBubbleWrap>
                          </OtherRow>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </MessageArea>
              <InputBar>
                <MsgInput
                  ref={inputRef}
                  placeholder="메시지 입력..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={500}
                />
                <SendBtn
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  title="전송"
                >
                  <FaPaperPlane size={14} />
                </SendBtn>
              </InputBar>
            </>
          )}

          {/* ── 공간 검색 뷰 ── */}
          {view === 'create' && (
            <CreateArea>
              <SearchInput
                autoFocus
                placeholder="공간 이름 검색..."
                value={placeQuery}
                onChange={(e) => setPlaceQuery(e.target.value)}
              />
              {placeSearching && <EmptyMsg>검색 중...</EmptyMsg>}
              {!placeSearching && placeQuery && placeResults.length === 0 && (
                <EmptyMsg>검색 결과가 없어요</EmptyMsg>
              )}
              {!placeSearching && !placeQuery && (
                <EmptyMsg style={{ marginTop: 12 }}>공간 이름을 입력하세요</EmptyMsg>
              )}
              {placeResults.map((p) => (
                <PlaceRow key={p.entityNo} onClick={() => handleSelectPlace(p)}>
                  <PlaceInfo>
                    <PlaceName>{p.title}</PlaceName>
                    <PlaceAddr>{p.address}</PlaceAddr>
                  </PlaceInfo>
                  <PlaceType>
                    {p.type === 'WORK_STAY' ? '워크앤스테이' : p.type === 'OFFICE' ? '코워킹' : '숙소'}
                  </PlaceType>
                </PlaceRow>
              ))}
            </CreateArea>
          )}
        </Panel>
      )}

      {/* 플로팅 버튼 */}
      <ChatBtn onClick={() => setIsOpen((o) => !o)} title="채팅">
        <FaCommentDots size={24} />
        {totalUnread > 0 && (
          <ChatBadge>{totalUnread > 99 ? '99+' : totalUnread}</ChatBadge>
        )}
      </ChatBtn>
    </WidgetWrap>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const WidgetWrap = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`;

const ChatBtn = styled.button`
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #a8b89f;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  transition: background 150ms, transform 150ms;
  flex-shrink: 0;

  &:hover {
    background: #8fa88a;
    transform: scale(1.06);
  }
`;

const ChatBadge = styled.span`
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #e74c3c;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  box-sizing: content-box;
`;

const Panel = styled.div`
  width: 340px;
  height: 480px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.16);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px 12px;
  border-bottom: 1px solid #f0ebe0;
  background: #f9f6f0;
  flex-shrink: 0;
`;

const PanelLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: #6b8a6e;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  &:hover { color: #2d3b2e; }
`;

const PanelTitle = styled.span`
  font-size: 0.92rem;
  font-weight: 700;
  color: #2d3b2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;
`;

const SpaceTag = styled.span`
  font-size: 0.7rem;
  color: #a8b89f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  &:hover { color: #555; }
`;

/* ── 목록 뷰 ── */

const RoomListArea = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
`;

const EmptyMsg = styled.p`
  text-align: center;
  padding: 40px 16px;
  font-size: 0.82rem;
  color: #bbb;
`;

const RoomRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  cursor: pointer;
  transition: background 100ms;
  &:hover { background: #f9f6f0; }
`;

const RoomAvatar = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #a8b89f;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoomContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const RoomTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
`;

const RoomName = styled.span`
  font-size: 0.85rem;
  font-weight: ${(p) => (p.$unread ? '700' : '500')};
  color: #2d3b2e;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RoomTime = styled.span`
  font-size: 0.68rem;
  color: #bbb;
  flex-shrink: 0;
`;

const RoomSpace = styled.p`
  font-size: 0.72rem;
  color: #a8b89f;
  margin-top: 1px;
`;

const RoomLast = styled.p`
  font-size: 0.78rem;
  color: ${(p) => (p.$unread ? '#444' : '#bbb')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 1px;
`;

const UnreadDot = styled.span`
  flex-shrink: 0;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #e74c3c;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ListFooter = styled.div`
  padding: 10px 14px;
  border-top: 1px solid #f0ebe0;
  flex-shrink: 0;
`;

const CreateRoomBtn = styled.button`
  width: 100%;
  padding: 9px;
  border-radius: 8px;
  background: #a8b89f;
  color: #fff;
  border: none;
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  transition: filter 150ms;
  &:hover { filter: brightness(0.92); }
`;

/* ── 채팅 상세 뷰 ── */

const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: #fafaf8;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
`;

const DateLine = styled.div`
  text-align: center;
  font-size: 0.7rem;
  color: #bbb;
  margin: 10px 0 6px;
  background: rgba(0,0,0,0.04);
  border-radius: 999px;
  padding: 2px 10px;
  align-self: center;
  width: fit-content;
  margin-inline: auto;
`;

const MyRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 6px;
`;

const MyBubbleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  max-width: 70%;
`;

const MyBubble = styled.div`
  padding: 8px 12px;
  background: #a8b89f;
  color: #fff;
  border-radius: 14px 0 14px 14px;
  font-size: 0.83rem;
  line-height: 1.5;
  word-break: break-word;
`;

const OtherRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  margin-bottom: 6px;
`;

const MiniAvatar = styled.div`
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #c8d8c0;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OtherBubbleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 70%;
`;

const OtherBubble = styled.div`
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e8e0d4;
  border-radius: 0 14px 14px 14px;
  font-size: 0.83rem;
  line-height: 1.5;
  word-break: break-word;
  color: #333;
`;

const MsgTime = styled.span`
  font-size: 0.67rem;
  color: #bbb;
`;

const InputBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #f0ebe0;
  background: #fff;
  flex-shrink: 0;
`;

const MsgInput = styled.input`
  flex: 1;
  height: 36px;
  padding: 0 12px;
  font-size: 0.83rem;
  border: 1px solid #e0d8c8;
  border-radius: 999px;
  background: #fafaf8;
  color: #333;
  font-family: inherit;
  outline: none;
  &:focus { border-color: #a8b89f; }
  &::placeholder { color: #ccc; }
`;

const SendBtn = styled.button`
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${(p) => (p.disabled ? '#e8e8e8' : '#a8b89f')};
  color: ${(p) => (p.disabled ? '#bbb' : '#fff')};
  border: none;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms;
`;

/* ── 공간 검색 뷰 ── */

const CreateArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #e0d8c8;
  border-radius: 999px;
  font-size: 0.85rem;
  color: #333;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  flex-shrink: 0;
  &:focus { border-color: #a8b89f; }
  &::placeholder { color: #ccc; }
`;

const PlaceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 100ms;
  &:hover { background: #f4f0e8; }
`;

const PlaceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PlaceName = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: #2d3b2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaceAddr = styled.p`
  font-size: 0.73rem;
  color: #bbb;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PlaceType = styled.span`
  flex-shrink: 0;
  font-size: 0.68rem;
  padding: 3px 7px;
  border-radius: 999px;
  background: #a8b89f;
  color: #fff;
  font-weight: 600;
`;