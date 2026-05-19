import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';

// ─── Mock 데이터 ───────────────────────────────────────────────────────────────
// 백엔드 연동 시:
//   - 룸 정보: GET /api/host/chats/:roomId
//   - 메시지: GET /api/host/chats/:roomId/messages?cursor=&limit=30
//   - 전송:   POST /api/host/chats/:roomId/messages
//   - 빠른 답변 템플릿: GET /api/host/quick-replies (호스트 별 설정 가능)

const MOCK_ROOM = {
  id: 1,
  guestName: '박민수 (게스트)',
  spaceName: '청평 숲속 파인뷰 스테이',
  avatarInitial: '박',
  avatarBg: '#e8b4a0',
  reservationStatus: 'pending',
  reservation: {
    dateRange: '5/10 ~ 5/12 · 2박',
    guestCount: 3,
    estimatedAmount: '332,500원',
  },
};

const MOCK_MESSAGES = [
  {
    id: 1,
    senderId: 'guest',
    text: '안녕하세요! 청평 숲속 파인뷰 예약한 박민수입니다.',
    time: '14:15',
    dateLabel: '오늘',
  },
  {
    id: 2,
    senderId: 'guest',
    text: '체크인 관련 문의 드려도 될까요?',
    time: '14:15',
    dateLabel: null,
  },
  {
    id: 3,
    senderId: 'me',
    text: '네 안녕하세요! 편하게 말씀해주세요 😊',
    time: '14:13',
    dateLabel: null,
  },
  {
    id: 4,
    senderId: 'guest',
    text: '제가 도착이 좀 늦어질 것 같아요. 오후 4시쯤 가능할까요?',
    time: '14:20',
    dateLabel: null,
  },
  {
    id: 5,
    senderId: 'me',
    text: '물론이에요, 체크인은 3시부터 자유롭게 가능하니 걱정 마세요.',
    time: '14:22',
    dateLabel: null,
  },
  {
    id: 6,
    senderId: 'me',
    text: '혹시 몇 시에 도착하실지 대략적인 시간만 알려주시면 더 좋아요!',
    time: '14:22',
    dateLabel: null,
  },
  {
    id: 7,
    senderId: 'guest',
    text: '체크인 오후 4시쯤 가능할까요? 조금 늦을 것 같아서요.',
    time: '14:32',
    dateLabel: null,
  },
];

// 빠른 답변 템플릿 — 백엔드 연동 시 GET /api/host/quick-replies 로 대체
// 호스트가 직접 추가/수정 가능하도록 설정 페이지 연동 권장

export default function HostChatDetailPage() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const newMsg = {
      id: Date.now(),
      senderId: 'me',
      text: trimmed,
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      dateLabel: null,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    inputRef.current?.focus();
    // TODO: POST /api/host/chats/:roomId/messages { text: trimmed }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <PageLayout
      title="채팅방"
      description="게스트와 실시간으로 소통하세요"
      backTo="/host/chat"
      backLabel="채팅 목록"
    >
      <Divider />

      <ChatContainer>
        {/* 상단 게스트 정보 바 */}
        <ChatHeader>
          <GuestAvatar
            style={{ background: MOCK_ROOM.avatarBg }}
            aria-hidden="true"
          >
            {MOCK_ROOM.avatarInitial}
          </GuestAvatar>

          <GuestInfo>
            <GuestNameRow>{MOCK_ROOM.guestName}</GuestNameRow>
            <SpaceName>📍 {MOCK_ROOM.spaceName}</SpaceName>
          </GuestInfo>

          <HeaderActions>
            <ActionIconBtn type="button" aria-label="예약 상세 보기">
              🗓
            </ActionIconBtn>
            <ActionIconBtn type="button" aria-label="타이머 설정">
              ⏱
            </ActionIconBtn>
            <ActionIconBtn type="button" aria-label="더보기">
              ···
            </ActionIconBtn>
          </HeaderActions>
        </ChatHeader>

        {/* 예약 정보 띠 — 호스트용: 인원수, 예상 금액 추가 */}
        <ReservationBar>
          <ReservationItems>
            <ResvItem>
              <ResvIcon aria-hidden="true">📅</ResvIcon>
              <span>{MOCK_ROOM.reservation.dateRange}</span>
            </ResvItem>
            <ResvDot aria-hidden="true">·</ResvDot>
            <ResvItem>
              <ResvIcon aria-hidden="true">👥</ResvIcon>
              <span>{MOCK_ROOM.reservation.guestCount}명</span>
            </ResvItem>
            <ResvDot aria-hidden="true">·</ResvDot>
            <ResvItem>
              <ResvIcon aria-hidden="true">💰</ResvIcon>
              <span>정산 예상 {MOCK_ROOM.reservation.estimatedAmount}</span>
            </ResvItem>
          </ReservationItems>
          <ResvDetailLink aria-label="예약 상세 보기">
            → 예약 상세
          </ResvDetailLink>
        </ReservationBar>

        {/* 메시지 영역 */}
        <MessageArea role="log" aria-label="채팅 메시지" aria-live="polite">
          {messages.map((msg) => (
            <MessageGroup key={msg.id}>
              {msg.dateLabel && (
                <DateDivider>
                  <DateLabel>{msg.dateLabel}</DateLabel>
                </DateDivider>
              )}

              {msg.senderId === 'guest' ? (
                <GuestRow>
                  <MiniAvatar
                    style={{ background: MOCK_ROOM.avatarBg }}
                    aria-hidden="true"
                  >
                    {MOCK_ROOM.avatarInitial}
                  </MiniAvatar>
                  <GuestBubbleWrap>
                    <GuestBubble>{msg.text}</GuestBubble>
                    <BubbleTime>{msg.time}</BubbleTime>
                  </GuestBubbleWrap>
                </GuestRow>
              ) : (
                <HostRow>
                  <HostBubbleWrap>
                    <BubbleTime style={{ textAlign: 'right' }}>
                      집주인 · {msg.time}
                    </BubbleTime>
                    <HostBubble>{msg.text}</HostBubble>
                  </HostBubbleWrap>
                </HostRow>
              )}
            </MessageGroup>
          ))}
          <div ref={messagesEndRef} />
        </MessageArea>

        {/* 입력 바 */}
        <InputBar>
          <InputIconBtn type="button" aria-label="이미지 첨부">
            🖼
          </InputIconBtn>
          <InputIconBtn type="button" aria-label="파일 첨부">
            📎
          </InputIconBtn>
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
    </PageLayout>
  );
}

// ─── Styled Components ────────────────────────────────────────────────────────
const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--gray-200);
  margin: 0 0 var(--space-3) 0;
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--white);
  flex: 1;
  min-height: 0;
  margin-bottom: var(--space-6);

  max-width: 600px;
  width: 100%;
  align-self: center; /* 가운데 정렬 원하면 추가, 왼쪽 정렬이면 제거 */
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 16px 20px;
  border-bottom: 1px solid var(--gray-100);
  background: var(--white);
`;

const GuestAvatar = styled.div`
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--white);
`;

const GuestInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const GuestNameRow = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 2px;
`;

const SpaceName = styled.p`
  font-size: 0.78rem;
  color: var(--gray-400);
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
  &:hover {
    background: var(--gray-100);
  }
`;

const ReservationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  /* 호스트 테마: 따뜻한 오렌지 계열 */
  background: rgba(192, 112, 64, 0.08);
  border-bottom: 1px solid rgba(192, 112, 64, 0.15);
  font-size: 0.8rem;
  color: var(--gray-600);
  gap: var(--space-3);
  flex-wrap: wrap;
`;

const ReservationItems = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
`;

const ResvItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ResvIcon = styled.span`
  font-size: 0.8rem;
`;

const ResvDot = styled.span`
  color: var(--gray-400);
`;

const ResvDetailLink = styled.a`
  font-size: 0.8rem;
  color: #c07040;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 500;
  &:hover {
    text-decoration: underline;
  }
`;

const MessageArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--gray-50, #fafaf9);
  min-height: 320px;
  max-height: 440px;
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
  background: rgba(0, 0, 0, 0.05);
  padding: 3px 12px;
  border-radius: var(--radius-full);
`;

const GuestRow = styled.div`
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
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--white);
  flex-shrink: 0;
  margin-bottom: 2px;
`;

const GuestBubbleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 60%;
`;

const GuestBubble = styled.div`
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

const HostRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
`;

const HostBubbleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  max-width: 60%;
`;

/* 호스트 버블: 따뜻한 오렌지 계열 (유저 채팅의 sage와 구분) */
const HostBubble = styled.div`
  padding: 10px 14px;
  background: #c07040;
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
  &:hover {
    background: var(--gray-100);
  }
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

  &:focus {
    border-color: #c07040;
  }
  &::placeholder {
    color: var(--gray-400);
  }
`;

const SendBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${(p) => (p.disabled ? 'var(--gray-200)' : '#c07040')};
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
