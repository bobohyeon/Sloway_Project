import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { Card, Section } from '../../../pay_shared/components'
import { CommissionPolicyTable } from '../../components/host/CommissionPolicyTable'

const POLICIES = [
  {
    id: 1,
    icon: '🏨',
    category: '숙소',
    description: '단기 숙박 예약 수수료',
    rate: 12.5,
    effectiveFrom: '2026.01.01',
  },
  {
    id: 2,
    icon: '🌲',
    category: '워크앤스테이',
    description: '워케이션 숙박 수수료',
    rate: 12.5,
    effectiveFrom: '2026.01.01',
  },
  {
    id: 3,
    icon: '💼',
    category: '코워킹오피스',
    description: '시간제·일일 사용 수수료',
    rate: 10.0,
    effectiveFrom: '2026.01.01',
  },
]

const HISTORY = [
  {
    id: 1,
    title: '2026년 정책 적용',
    date: '2026.01.01',
    description: '신규 카테고리(워크앤스테이) 추가 및 코워킹오피스 수수료 인하',
  },
  {
    id: 2,
    title: '2025년 정책 적용',
    date: '2025.01.01',
    description: '숙소 수수료율 13% → 12.5%로 인하',
  },
]

export default function CommissionPolicy() {
  const nav = useNavigate()

  return (
    <Page>
      <BackLink onClick={() => nav('/host/settlement/dashboard')}>← 정산 대시보드</BackLink>

      <Header>
        <Title>수수료 정책</Title>
        <Description>현재 적용 중인 플랫폼 수수료 정책을 확인하세요</Description>
      </Header>

      <SummaryCard padded>
        <SummaryIcon>📊</SummaryIcon>
        <SummaryContent>
          <SummaryTitle>플랫폼 수수료란?</SummaryTitle>
          <SummaryText>
            예약이 완료된 매출에서 차감되는 플랫폼 운영 수수료입니다. 결제 처리, 정산 자동화,
            마케팅 노출 등 다양한 서비스에 사용돼요.
          </SummaryText>
        </SummaryContent>
      </SummaryCard>

      <CommissionPolicyTable policies={POLICIES} />

      <Section title="수수료 계산 예시">
        <ExampleCard padded>
          <ExampleRow>
            <ExampleLabel>매출 금액</ExampleLabel>
            <ExampleValue>1,000,000원</ExampleValue>
          </ExampleRow>
          <ExampleRow>
            <ExampleLabel>플랫폼 수수료 (12.5%)</ExampleLabel>
            <ExampleValue $negative>-125,000원</ExampleValue>
          </ExampleRow>
          <ExampleDivider />
          <ExampleRow>
            <FinalLabel>호스트 입금액</FinalLabel>
            <FinalValue>875,000원</FinalValue>
          </ExampleRow>
        </ExampleCard>
      </Section>

      <Section title="정책 변경 이력">
        <HistoryList>
          {HISTORY.map((h) => (
            <HistoryItem key={h.id}>
              <HistoryDot />
              <HistoryContent>
                <HistoryTitle>{h.title}</HistoryTitle>
                <HistoryMeta>{h.date}</HistoryMeta>
                <HistoryDesc>{h.description}</HistoryDesc>
              </HistoryContent>
            </HistoryItem>
          ))}
        </HistoryList>
      </Section>

      <NoticeBox>
        <NoticeIcon>💡</NoticeIcon>
        <NoticeContent>
          <NoticeTitle>알아두세요</NoticeTitle>
          <NoticeList>
            <li>수수료는 부가세(VAT) 별도이며, 매월 세금계산서가 발행돼요</li>
            <li>정책 변경 시 사전에 공지하며, 적용 시작일부터 적용돼요</li>
            <li>수수료 정책 관련 문의는 호스트 고객센터로 연락해주세요</li>
          </NoticeList>
        </NoticeContent>
      </NoticeBox>
    </Page>
  )
}

const Page = styled.div`
  width: 100%;
  max-width: 800px;
  padding: var(--space-6) var(--space-5);
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

const SummaryCard = styled(Card)`
  display: flex;
  gap: var(--space-3);
  background: var(--cream);
  margin-bottom: var(--space-5);
`

const SummaryIcon = styled.div`
  font-size: 1.8rem;
  flex-shrink: 0;
`

const SummaryContent = styled.div`
  flex: 1;
`

const SummaryTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 6px;
`

const SummaryText = styled.div`
  font-size: 0.85rem;
  color: var(--gray-600);
  line-height: 1.6;
`

const ExampleCard = styled(Card)``

const ExampleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
`

const ExampleLabel = styled.span`
  font-size: 0.88rem;
  color: var(--gray-600);
`

const ExampleValue = styled.strong`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${(props) => (props.$negative ? '#b85a4e' : 'var(--gray-800)')};
`

const ExampleDivider = styled.hr`
  border: none;
  border-top: 2px solid var(--gray-200);
  margin: var(--space-2) 0;
`

const FinalLabel = styled.span`
  font-size: 0.95rem;
  color: var(--gray-800);
  font-weight: 600;
`

const FinalValue = styled.strong`
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--sage);
  letter-spacing: -0.02em;
`

const HistoryList = styled.div`
  position: relative;
  padding-left: var(--space-3);
`

const HistoryItem = styled.div`
  display: flex;
  gap: var(--space-3);
  padding-bottom: var(--space-4);
  position: relative;

  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 5px;
    top: 16px;
    bottom: 0;
    width: 2px;
    background: var(--gray-200);
  }

  &:last-child {
    padding-bottom: 0;
  }
`

const HistoryDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--sage);
  flex-shrink: 0;
  margin-top: 4px;
  z-index: 1;
`

const HistoryContent = styled.div`
  flex: 1;
`

const HistoryTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 2px;
`

const HistoryMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--gray-400);
  margin-bottom: 4px;
`

const HistoryDesc = styled.div`
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.5;
`

const NoticeBox = styled.div`
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--gray-100);
  border-radius: var(--radius-md);
  margin-top: var(--space-6);
`

const NoticeIcon = styled.div`
  font-size: 1.3rem;
  flex-shrink: 0;
`

const NoticeContent = styled.div`
  flex: 1;
`

const NoticeTitle = styled.div`
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 6px;
`

const NoticeList = styled.ul`
  list-style: disc;
  padding-left: 20px;
  font-size: 0.82rem;
  color: var(--gray-600);
  line-height: 1.7;

  li {
    list-style: disc;
    margin-bottom: 4px;
  }
`
