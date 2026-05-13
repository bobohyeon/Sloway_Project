import { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';

// ─── Mock 데이터 ───────────────────────────────────────────────────────────────
// 백엔드 연동 시:
//   - 룸 정보: GET /api/chats/:roomId
//   - 메시지: GET /api/chats/:roomId/messages?cursor=&limit=30 (커서 기반 페이지네이션 권장)
//   - 전송:   POST /api/chats/:roomId/messages
//   - 실시간: WebSocket /ws/chats/:roomId 또는 SSE

const MOCK_ROOM = {
  id: 1,
  hostName: '청평스테이',
  spaceName: '청평 숲속 파인뷰 스테이',
  avatarEmoji: '🌲',
  avatarBg: '#d4e6d0',
  isOnline: true,
  reservation: {
    dateRange: '5/8 ~ 5/10 · 2박',
    code: 'SW-20260508-000847',
  },
};

const MOCK_MESSAGES = [
  {
    id: 1,
    senderId: 'host',
    text: '안녕하세요 청평 숲속 파인뷰 스테이 호스트입니다 🌲',
    time: '14:20',
    dateLabel: '2026년 4월 24일',
  },
  {
    id: 2,
    senderId: 'host',
    text: '예약 주셔서 감사합니다! 궁금한 점 있으시면 편하게 문의 주세요.',
    time: '14:20',
    dateLabel: null,
  },
  {
    id: 3,
    senderId: 'me',
    text: '안녕하세요! 체크인 시간이 오후 3시인가요?',
    time: '14:22',
    dateLabel: null,
  },
  {
    id: 4,
    senderId: 'host',
    text: '네, 맞아요. 오후 3시부터 체크인 가능합니다.',
    time: '14:23',
    dateLabel: null,
  },
  {
    id: 5,
    senderId: 'host',
    text: '혹시 일찍 도착하실 예정이면 짐만 먼저 놓고 가시는 것도 가능해요!',
    time: '14:23',
    dateLabel: null,
  },
  {
    id: 6,
    senderId: 'me',
    text: '좋네요, 2시쯤 도착할 것 같아요',
    time: '14:36',
    dateLabel: null,
  },
  {
    id: 7,
    senderId: 'host',
    text: '체크인 관련 안내드립니다. 도착 예정 시간 알려주세요!',
    time: '14:32',
    dateLabel: null,
  },
  {
    id: 8,
    senderId: 'host',
    text: '2시에 뵐겠습니다 :) 안전 운전 하시고 곧 만나요!',
    time: '14:32',
    dateLabel: null,
  },
];

export default function UserChatDetailPage() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 새 메시지 왔을 때 자동 스크롤
  // dependency: messages.length만 추적 — 전체 배열 참조 불필요
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    // 낙관적 업데이트 — 백엔드 연동 시 실패 시 롤백 처리 추가
    const newMsg = {
      id: Date.now(),
      senderId: 'me',
      text: trimmed,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      dateLabel: null,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    inputRef.current?.focus();
    // TODO: POST /api/chats/:roomId/messages { text: trimmed }
  };

  const handleKeyDown = (e) => {
    // IME(한글 조합) 입력 중엔 Enter 무시 — isComposing 체크 필수
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // 채팅 UI는 뷰포트 높이를 꽉 채워야 해서 flex column 레이아웃 필요
    // 부모 레이아웃에서 height: 100vh 혹은 100% 확보 필요
    <ChatWrap>
      {/* 페이지 헤더 */}
      <PageHeader>
        <PageTitle>채팅방</PageTitle>
        <PageDesc>호스트와 실시간으로 소통하세요</PageDesc>
      </PageHeader>

      <Divider />

      {/* 뒤로가기 */}
      <BackRow>
        <BackBtn
          type="button"
          // onClick={() => navigate('/chats')}
          aria-label="채팅 목록으로 돌아가기"
        >
          ← 채팅 목록
        </BackBtn>
      </BackRow>

      {/* 채팅 컨테이너 */}
      <ChatContainer>
        {/* 상단 호스트 정보 바 */}
        <ChatHeader>
          <HostAvatarWrap style={{ background: MOCK_ROOM.avatarBg }}>
            <span aria-hidden="true">{MOCK_ROOM.avatarEmoji}</span>
            {MOCK_ROOM.isOnline && <OnlineDot aria-label="온라인" />}
          </HostAvatarWrap>

          <HostInfo>
            <HostName>
              {MOCK_ROOM.hostName}
              {MOCK_ROOM.isOnline && (
                <OnlineBadge aria-label="접속 중">● 접속 중</OnlineBadge>
              )}
            </HostName>
            <HostSpace>{MOCK_ROOM.spaceName}</HostSpace>
          </HostInfo>

          <HeaderActions>
            <ActionIconBtn type="button" aria-label="예약 정보 보기">🗓</ActionIconBtn>
            <ActionIconBtn type="button" aria-label="신고하기">🚩</ActionIconBtn>
            <ActionIconBtn type="button" aria-label="더보기">···</ActionIconBtn>
          </HeaderActions>
        </ChatHeader>

        {/* 예약 정보 띠 */}
        <ReservationBar>
          <ReservationInfo>
            <ResvIcon aria-hidden="true">📅</ResvIcon>
            <span>{MOCK_ROOM.reservation.dateRange}</span>
            <Dot aria-hidden="true">·</Dot>
            <span>예약 번호 {MOCK_ROOM.reservation.code}</span>
          </ReservationInfo>
          <ResvDetailLink
            // href={`/reservations/${MOCK_ROOM.reservation.code}`}
            aria-label="예약 상세 보기"
          >
            →
          </ResvDetailLink>
        </ReservationBar>

        {/* 메시지 영역 — overflow-y: auto로 채팅 스크롤 독립 */}
        <MessageArea role="log" aria-label="채팅 메시지" aria-live="polite">
          {messages.map((msg) => (
            <MessageGroup key={msg.id}>
              {msg.dateLabel && (
                <DateDivider>
                  <DateLabel>{msg.dateLabel}</DateLabel>
                </DateDivider>
              )}

              {msg.senderId === 'host' ? (
                <HostRow>
                  <MiniAvatar style={{ background: MOCK_ROOM.avatarBg }} aria-hidden="true">
                    {MOCK_ROOM.avatarEmoji}
                  </MiniAvatar>
                  <HostBubbleWrap>
                    <HostBubble>{msg.text}</HostBubble>
                    <BubbleTime>{msg.time}</BubbleTime>
                  </HostBubbleWrap>
                </HostRow>
              ) : (
                <MyRow>
                  <MyBubbleWrap>
                    <BubbleTime style={{ textAlign: 'right' }}>나 · {msg.time}</BubbleTime>
                    <MyBubble>{msg.text}</MyBubble>
                  </MyBubbleWrap>
                </MyRow>
              )}
            </MessageGroup>
          ))}
          <div ref={messagesEndRef} />
        </MessageArea>

        {/* 입력 바 */}
        <InputBar>
          <InputIconBtn type="button" aria-label="이미지 첨부">🖼</InputIconBtn>
          <InputIconBtn type="button" aria-label="파일 첨부">📎</InputIconBtn>
          <MessageInput
            ref={inputRef}
            placeholder="메시지 입력..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="메시지 입력"
            maxLength={500}
          />
          <SendBtn
            type="button"
            onClick={handleSend}
            disabled={!inputText.trim()}
            aria-label="메시지 전송"
          >
            ↑
          </SendBtn>
        </InputBar>
      </ChatContainer>
    </ChatWrap>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────

const ChatWrap = styled.div`
  max-width: 860px;
  width: 100%;
  margin: 0 auto;
  padding: var(--space-6) var(--space-6) 0;
  /* 채팅 레이아웃: 부모가 height를 확보해야 MessageArea 스크롤이 동작합니다 */
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: var(--space-4) var(--space-4) 0;
  }
`;

const PageHeader = styled.div`margin-bottom: var(--space-4);`;

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

const BackRow = styled.div`margin-bottom: var(--space-3);`;

const BackBtn = styled.button`
  font-size: 0.85rem;
  color: var(--gray-500);
  cursor: pointer;
  transition: color 140ms;
  &:hover { color: var(--gray-800); }
`;

/* 채팅 컨테이너 — 내부에서 독립 스크롤 */
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--white);
  /* 부모가 flex + height 확보 시 자동으로 남은 공간을 채움 */
  flex: 1;
  min-height: 0;
  margin-bottom: var(--space-6);
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-100);
  background: var(--white);
`;

const HostAvatarWrap = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
`;

const OnlineDot = styled.span`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4caf50;
  border: 2px solid var(--white);
`;

const HostInfo = styled.div`flex: 1; min-width: 0;`;

const HostName = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
`;

const OnlineBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 500;
  color: #4caf50;
`;

const HostSpace = styled.p`
  font-size: 0.78rem;
  color: var(--gray-400);
  margin-top: 1px;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ActionIconBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  color: var(--gray-500);
  cursor: pointer;
  transition: background 140ms;
  &:hover { background: var(--gray-100); }
`;

const ReservationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: var(--cream, #f4efe6);
  border-bottom: 1px solid rgba(168,184,159,0.2);
  font-size: 0.8rem;
  color: var(--gray-600);
`;

const ReservationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ResvIcon = styled.span`font-size: 0.85rem;`;

const Dot = styled.span`color: var(--gray-400);`;

const ResvDetailLink = styled.a`
  font-size: 0.85rem;
  color: var(--gray-400);
  cursor: pointer;
  &:hover { color: var(--gray-700); }
`;

/* 메시지 영역 — 이 div 만 독립 스크롤 */
const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--gray-50, #fafaf9);
  min-height: 320px;
  max-height: 480px; /* 부모 flex height 미확보 시 폴백 */
`;

const MessageGroup = styled.div``;

const DateDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 16px 0;
`;

const DateLabel = styled.span`
  font-size: 0.75rem;
  color: var(--gray-400);
  background: rgba(0,0,0,0.05);
  padding: 3px 12px;
  border-radius: var(--radius-full);
`;

const HostRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
`;

const MiniAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  flex-shrink: 0;
  margin-bottom: 2px;
`;

const HostBubbleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 60%;
`;

const HostBubble = styled.div`
  padding: 10px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 0 var(--radius-lg) var(--radius-lg) var(--radius-lg);
  font-size: 0.88rem;
  color: var(--gray-800);
  line-height: 1.6;
  word-break: break-word;
`;

const BubbleTime = styled.span`
  font-size: 0.72rem;
  color: var(--gray-400);
`;

const MyRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

const MyBubbleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  max-width: 60%;
`;

const MyBubble = styled.div`
  padding: 10px 14px;
  background: var(--sage);
  border-radius: var(--radius-lg) 0 var(--radius-lg) var(--radius-lg);
  font-size: 0.88rem;
  color: var(--white);
  line-height: 1.6;
  word-break: break-word;
`;

const InputBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--gray-200);
  background: var(--white);
`;

const InputIconBtn = styled.button`
  font-size: 1rem;
  color: var(--gray-400);
  cursor: pointer;
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background 140ms;
  &:hover { background: var(--gray-100); }
`;

const MessageInput = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 14px;
  font-size: 0.88rem;
  background: var(--gray-50, #fafaf9);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-full);
  color: var(--gray-800);
  font-family: inherit;
  outline: none;
  transition: border-color 150ms;

  &:focus { border-color: var(--sage); }
  &::placeholder { color: var(--gray-400); }
`;

const SendBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(p) => (p.disabled ? 'var(--gray-200)' : 'var(--sage)')};
  color: ${(p) => (p.disabled ? 'var(--gray-400)' : 'var(--white)')};
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(p) => (p.disabled ? 'not-allowed' : 'pointer')};
  transition: background 150ms;
  flex-shrink: 0;
`;
