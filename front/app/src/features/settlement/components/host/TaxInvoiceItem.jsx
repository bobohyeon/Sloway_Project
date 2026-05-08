import styled from 'styled-components'
import { Card, Badge } from '../../../pay_shared/components'

export function TaxInvoiceItem({ invoice, onDownload }) {
  return (
    <Wrap>
      <LeftSection>
        <PeriodBox>
          <Year>{invoice.year}</Year>
          <Month>{invoice.month}월</Month>
        </PeriodBox>

        <Info>
          <TopRow>
            <InvoiceNumber>{invoice.invoiceNumber}</InvoiceNumber>
            <Badge variant={invoice.status === 'issued' ? 'success' : 'warning'} size="sm">
              {invoice.status === 'issued' ? '발행 완료' : '발행 예정'}
            </Badge>
          </TopRow>
          <Title>{invoice.title}</Title>
          <Meta>
            <span>발행일 {invoice.issuedDate}</span>
            <Sep>·</Sep>
            <span>수수료 합계</span>
          </Meta>
        </Info>
      </LeftSection>

      <RightSection>
        <Amount>
          <Number>{invoice.amount.toLocaleString()}</Number>
          <Unit>원</Unit>
        </Amount>
        {invoice.status === 'issued' && (
          <DownloadBtn onClick={() => onDownload?.(invoice)}>📄 다운로드</DownloadBtn>
        )}
      </RightSection>
    </Wrap>
  )
}

const Wrap = styled(Card)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  gap: var(--space-3);
  transition: all 200ms ease;

  &:hover {
    border-color: var(--sage);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex: 1;
  min-width: 0;
`

const PeriodBox = styled.div`
  width: 64px;
  padding: 8px 0;
  background: var(--cream);
  border-radius: var(--radius-md);
  text-align: center;
  flex-shrink: 0;
`

const Year = styled.div`
  font-size: 0.7rem;
  color: var(--gray-600);
  margin-bottom: 2px;
`

const Month = styled.div`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  letter-spacing: -0.02em;
`

const Info = styled.div`
  flex: 1;
  min-width: 0;
`

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`

const InvoiceNumber = styled.span`
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--gray-600);
`

const Title = styled.div`
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--gray-400);
`

const Sep = styled.span`
  opacity: 0.4;
`

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;

  @media (max-width: 640px) {
    justify-content: space-between;
    padding-top: var(--space-3);
    border-top: 1px solid var(--gray-200);
  }
`

const Amount = styled.div`
  display: flex;
  align-items: baseline;
  gap: 2px;
`

const Number = styled.strong`
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--gray-800);
`

const Unit = styled.span`
  font-size: 0.78rem;
  color: var(--gray-600);
`

const DownloadBtn = styled.button`
  padding: 8px 14px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.78rem;
  color: var(--gray-800);
  white-space: nowrap;
  transition: all 160ms ease;

  &:hover {
    border-color: var(--sage);
    background: var(--cream);
  }
`
