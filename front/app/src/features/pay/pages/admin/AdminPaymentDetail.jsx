import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Button, Badge, Section } from '../../../pay_shared/components'

const PAYMENTS = [
  {
    id: 'PAY-20260508-921',
    bookingId: 'SW-20260512-001045',
    status: 'completed',
    userName: '이재현',
    userEmail: 'jaehyun.lee@example.com',
    userPhone: '010-****-1234',
    userJoinDate: '2025.08.15',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    hostName: '청평 숲속 호스트',
    checkInDate: '2026.05.10 (토) ~ 05.12 (월) · 2박',
    guests: '성인 2명',
    method: '카카오페이',
    methodIcon: '💬',
    pg: 'KG이니시스',
    approvalNo: 'KP-20260508-00512921',
    cardInfo: '신한 ****-1234',
    installments: '일시불',
    paidAt: '2026.05.08 14:32',
    refundedAt: null,
    failReason: null,
    priceItems: [
      { label: '270,000원 × 2박', amount: 540000 },
      { label: '서비스 수수료', amount: 15000 },
      { label: '🎟️ 봄맞이 워케이션 15% 할인', amount: 81000, type: 'discount' },
    ],
    subtotal: 555000,
    total: 540000,
    earnedPoints: 5400,
    commission: 67500,
    payoutToHost: 472500,
  },
  {
    id: 'PAY-20260508-917',
    bookingId: 'SW-20260514-001038',
    status: 'refunded',
    userName: '김도현',
    userEmail: 'dohyun.kim@example.com',
    userPhone: '010-****-5678',
    userJoinDate: '2025.11.20',
    spaceName: '청평 숲속 파인뷰 스테이',
    spaceEmoji: '🌲',
    category: '워크앤스테이',
    location: '경기 가평',
    hostName: '청평 숲속 호스트',
    checkInDate: '2026.05.14 (수) ~ 05.16 (금) · 2박',
    guests: '성인 2명',
    method: '네이버페이',
    methodIcon: 'N',
    pg: '네이버페이',
    approvalNo: 'NP-20260508-00478917',
    cardInfo: '네이버페이 머니',
    installments: '일시불',
    paidAt: '2026.05.08 10:05',
    refundedAt: '2026.05.08 16:23',
    refundAmount: 540000,
    failReason: null,
    priceItems: [{ label: '270,000원 × 2박', amount: 540000 }],
    subtotal: 540000,
    total: 540000,
    earnedPoints: 0,
    commission: 67500,
    payoutToHost: 0,
  },
  {
    id: 'PAY-20260507-912',
    bookingId: 'SW-20260512-001025',
    status: 'failed',
    userName: '정유나',
    userEmail: 'yuna.jung@example.com',
    userPhone: '010-****-3456',
    userJoinDate: '2026.02.10',
    spaceName: '강릉 바다향 코워킹',
    spaceEmoji: '🌊',
    category: '코워킹오피스',
    location: '강원 강릉',
    hostName: '강릉 워크 호스트',
    checkInDate: '2026.05.12 (월) 10:00 ~ 18:00 · 8시간',
    guests: '성인 3명',
    method: '토스페이',
    methodIcon: 'T',
    pg: '토스페이먼츠',
    approvalNo: '-',
    cardInfo: '토스 머니',
    installments: '-',
    paidAt: '2026.05.07 21:38',
    refundedAt: null,
    failReason: '카드 한도 초과 - PG사 응답: ERR_LIMIT_EXCEEDED',
    priceItems: [{ label: '10,500원 × 8시간', amount: 84000 }],
    subtotal: 84000,
    total: 84000,
    earnedPoints: 0,
    commission: 0,
    payoutToHost: 0,
  },
]

export default function AdminPaymentDetail() {
  const nav = useNavigate()
  const { id } = useParams()

  const payment = PAYMENTS.find((p) => p.id === id) || PAYMENTS[0]
  const isCompleted = payment.status === 'completed'
  const isRefunded = payment.status === 'refunded'
  const isFailed = payment.status === 'failed'

  return (
    <PageWrapper>
      <Container>
      <BackLink onClick={() => nav('/admin/payment')}>← 결제 내역</BackLink>

      <Header>
        <Title>결제 상세</Title>
        <Description>결제 내역과 관련 정보를 확인합니다</Description>
      </Header>

      {isRefunded && (
        <InfoBanner $variant="info">
          <BannerIcon>↻</BannerIcon>
          <BannerContent>
            <BannerTitle>환불 완료</BannerTitle>
            <BannerDesc>
              {payment.refundedAt}에 환불 처리되었습니다 ({payment.refundAmount?.toLocaleString()}원)
            </BannerDesc>
          </BannerContent>
        </InfoBanner>
      )}

      {isFailed && (
        <InfoBanner $variant="danger">
          <BannerIcon>✗</BannerIcon>
          <BannerContent>
            <BannerTitle>결제 실패</BannerTitle>
            <BannerDesc>{payment.failReason}</BannerDesc>
          </BannerContent>
        </InfoBanner>
      )}

      <DetailCard padded>
        <CardHeader>
          <HeaderLeft>
            {isCompleted && <Badge variant="success" size="md">✓ 결제 완료</Badge>}
            {isRefunded && <Badge variant="info" size="md">↻ 환불됨</Badge>}
            {isFailed && <Badge variant="danger" size="md">✗ 결제 실패</Badge>}
            <PaymentId>{payment.id}</PaymentId>
          </HeaderLeft>
          <PaymentAmount $refunded={isRefunded} $failed={isFailed}>
            {payment.total.toLocaleString()}원
          </PaymentAmount>
        </CardHeader>

        <DetailGrid>
          <DetailGroup>
            <GroupTitle>회원 정보</GroupTitle>
            <DetailRow>
              <Label>회원명</Label>
              <Value>{payment.userName}</Value>
            </DetailRow>
            <DetailRow>
              <Label>이메일</Label>
              <Value>{payment.userEmail}</Value>
            </DetailRow>
            <DetailRow>
              <Label>연락처</Label>
              <Value>{payment.userPhone}</Value>
            </DetailRow>
            <DetailRow>
              <Label>가입일</Label>
              <Value>{payment.userJoinDate}</Value>
            </DetailRow>
          </DetailGroup>

          <DetailGroup>
            <GroupTitle>공간 정보</GroupTitle>
            <DetailRow>
              <Label>공간명</Label>
              <Value>
                {payment.spaceEmoji} {payment.spaceName}
              </Value>
            </DetailRow>
            <DetailRow>
              <Label>카테고리</Label>
              <Value>{payment.category}</Value>
            </DetailRow>
            <DetailRow>
              <Label>위치</Label>
              <Value>{payment.location}</Value>
            </DetailRow>
            <DetailRow>
              <Label>호스트</Label>
              <Value>{payment.hostName}</Value>
            </DetailRow>
          </DetailGroup>

          <DetailGroup>
            <GroupTitle>예약 정보</GroupTitle>
            <DetailRow>
              <Label>예약번호</Label>
              <Value>{payment.bookingId}</Value>
            </DetailRow>
            <DetailRow>
              <Label>일정</Label>
              <Value>{payment.checkInDate}</Value>
            </DetailRow>
            <DetailRow>
              <Label>인원</Label>
              <Value>{payment.guests}</Value>
            </DetailRow>
          </DetailGroup>

          <DetailGroup>
            <GroupTitle>결제 정보</GroupTitle>
            <DetailRow>
              <Label>결제수단</Label>
              <Value>
                {payment.methodIcon} {payment.method}
              </Value>
            </DetailRow>
            <DetailRow>
              <Label>PG사</Label>
              <Value>{payment.pg}</Value>
            </DetailRow>
            <DetailRow>
              <Label>승인번호</Label>
              <Value>
                <MonoText>{payment.approvalNo}</MonoText>
              </Value>
            </DetailRow>
            <DetailRow>
              <Label>카드</Label>
              <Value>{payment.cardInfo}</Value>
            </DetailRow>
            <DetailRow>
              <Label>할부</Label>
              <Value>{payment.installments}</Value>
            </DetailRow>
            <DetailRow>
              <Label>결제일시</Label>
              <Value>{payment.paidAt}</Value>
            </DetailRow>
          </DetailGroup>
        </DetailGrid>
      </DetailCard>

      <Section title="결제 금액 내역">
        <BreakdownCard padded>
          {payment.priceItems.map((item, i) => (
            <BreakdownRow key={i}>
              <BreakdownLabel>{item.label}</BreakdownLabel>
              <BreakdownValue $discount={item.type === 'discount'}>
                {item.type === 'discount' ? '-' : ''}
                {item.amount.toLocaleString()}원
              </BreakdownValue>
            </BreakdownRow>
          ))}
          <Divider />
          <BreakdownRow>
            <BreakdownLabel $bold>총 결제 금액</BreakdownLabel>
            <BreakdownValueSage>{payment.total.toLocaleString()}원</BreakdownValueSage>
          </BreakdownRow>
        </BreakdownCard>
      </Section>

      {isCompleted && (
        <Section title="플랫폼 정산 내역">
          <BreakdownCard padded>
            <BreakdownRow>
              <BreakdownLabel>결제 금액</BreakdownLabel>
              <BreakdownValue>{payment.total.toLocaleString()}원</BreakdownValue>
            </BreakdownRow>
            <BreakdownRow>
              <BreakdownLabel>플랫폼 수수료</BreakdownLabel>
              <BreakdownValueRed>-{payment.commission.toLocaleString()}원</BreakdownValueRed>
            </BreakdownRow>
            <BreakdownRow>
              <BreakdownLabel>적립 포인트</BreakdownLabel>
              <BreakdownValue>{payment.earnedPoints.toLocaleString()}P</BreakdownValue>
            </BreakdownRow>
            <Divider />
            <BreakdownRow>
              <BreakdownLabel $bold>호스트 지급 예정</BreakdownLabel>
              <BreakdownValueSage>{payment.payoutToHost.toLocaleString()}원</BreakdownValueSage>
            </BreakdownRow>
          </BreakdownCard>
        </Section>
      )}

      <Actions>
        <Button variant="secondary" onClick={() => nav('/admin/payment')}>
          목록으로
        </Button>
        {isCompleted && (
          <Button variant="secondary" onClick={() => nav('/admin/refund')}>
            환불 관리로 이동
          </Button>
        )}
        <Button variant="primary" onClick={() => window.print()}>
          🖨️ 출력
        </Button>
      </Actions>
    </Container>
    </PageWrapper>
  )
}

const PageWrapper = styled.div`
  background-color: var(--cream);
  min-height: 100%;
  padding: var(--space-6) var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  animation: fadeInUp 480ms ease-out both;
`

const BackLink = styled.button`
  font-size: 0.85rem;
  color: var(--gray-600);
  margin-bottom: var(--space-4);

  &:hover {
    color: var(--gray-800);
  }
`

const Header = styled.div`
  margin-bottom: var(--space-5);
`

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: 1.8rem;
  font-weight: 500;
  color: var(--gray-800);
  letter-spacing: -0.02em;
  margin-bottom: 4px;
`

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--gray-600);
`

const InfoBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: ${(p) =>
    p.$variant === 'danger'
      ? 'rgba(220, 38, 38, 0.04)'
      : 'rgba(168, 184, 159, 0.08)'};
  border: 1px solid
    ${(p) =>
      p.$variant === 'danger' ? 'rgba(220, 38, 38, 0.2)' : 'rgba(168, 184, 159, 0.3)'};
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
`

const BannerIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
`

const BannerContent = styled.div`
  flex: 1;
`

const BannerTitle = styled.div`
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const BannerDesc = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const DetailCard = styled(Card)`
  margin-bottom: var(--space-5);
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-5);
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--gray-200);
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
`

const PaymentId = styled.div`
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--gray-600);
`

const PaymentAmount = styled.div`
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 500;
  color: ${(p) => {
    if (p.$refunded) return 'var(--gray-400)'
    if (p.$failed) return '#c44b3c'
    return 'var(--sage)'
  }};
  text-decoration: ${(p) => (p.$refunded ? 'line-through' : 'none')};
`

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`

const DetailGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

const GroupTitle = styled.div`
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-2);
`

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
`

const Label = styled.span`
  font-size: 0.85rem;
  color: var(--gray-600);
`

const Value = styled.span`
  font-size: 0.9rem;
  color: var(--gray-800);
  font-weight: 500;
`

const MonoText = styled.span`
  font-family: var(--font-mono);
  font-size: 0.8rem;
`

const BreakdownCard = styled(Card)``

const BreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
`

const BreakdownLabel = styled.span`
  font-size: ${(p) => (p.$bold ? '1rem' : '0.9rem')};
  color: var(--gray-700);
  font-weight: ${(p) => (p.$bold ? 600 : 400)};
`

const BreakdownValue = styled.span`
  font-size: 0.95rem;
  color: ${(p) => (p.$discount ? 'var(--sage)' : 'var(--gray-800)')};
  font-weight: ${(p) => (p.$discount ? 500 : 400)};
`

const BreakdownValueRed = styled.span`
  font-size: 0.95rem;
  color: #c44b3c;
  font-weight: 500;
`

const BreakdownValueSage = styled.span`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--sage);
`

const Divider = styled.div`
  height: 1px;
  background: var(--gray-200);
  margin: var(--space-3) 0;
`

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
  margin-top: var(--space-6);
`
