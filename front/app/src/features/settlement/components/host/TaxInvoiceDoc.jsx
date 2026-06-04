import { forwardRef } from 'react';
import styled from 'styled-components';

// PDF 캡처 대상 양식. html2canvas 가 CSS 변수(var(--...))를 못 읽는 경우가 있어
// PDF 문서는 테마 의존 없이 명시적 색(hex)으로만 스타일링한다.

const won = (n) => `${Number(n ?? 0).toLocaleString()}원`;
const fmtDate = (d) => (d ? String(d) : '—');
const fmtDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
};

// 세금계산서 = 호스트(공급자)가 공간 이용 매출에 대해 발행하는 매출 계산서.
// 공급가액 = 총매출(totalAmt), 세액 = 10% 별도, 합계 = 공급가액 + 세액.
const TaxInvoiceDoc = forwardRef(({ settle }, ref) => {
  const supply = settle.totalAmt ?? 0; // 공급가액 = 공간 이용 매출
  const vat = Math.round(supply * 0.1); // 부가세 10%
  const total = supply + vat;
  const issued = settle.invoicedAt ? new Date(settle.invoicedAt) : null;
  const serialNo = `${issued ? issued.getFullYear() : '----'}-SW${String(
    settle.no ?? 0
  ).padStart(5, '0')}`;

  return (
    <Doc ref={ref}>
      <DocTitle>세 금 계 산 서</DocTitle>
      <DocSub>(공급받는자 보관용)</DocSub>

      <MetaBar>
        <MetaItem>
          <MetaKey>일련번호</MetaKey>
          <MetaVal>{serialNo}</MetaVal>
        </MetaItem>
        <MetaItem>
          <MetaKey>작성일자</MetaKey>
          <MetaVal>{fmtDateTime(settle.invoicedAt)}</MetaVal>
        </MetaItem>
        <MetaItem>
          <MetaKey>정산번호</MetaKey>
          <MetaVal>#{settle.no}</MetaVal>
        </MetaItem>
      </MetaBar>

      <PartyGrid>
        <Party>
          <PartyLabel>공급자</PartyLabel>
          <PartyRow>
            <PartyKey>상호</PartyKey>
            <PartyVal>호스트 #{settle.hostNo}</PartyVal>
          </PartyRow>
          <PartyRow>
            <PartyKey>등록번호</PartyKey>
            <PartyVal>000-00-00000</PartyVal>
          </PartyRow>
          <PartyRow>
            <PartyKey>대표자</PartyKey>
            <PartyVal>호스트 #{settle.hostNo}</PartyVal>
          </PartyRow>
          <PartyRow>
            <PartyKey>업태/종목</PartyKey>
            <PartyVal>부동산업 / 공간 임대</PartyVal>
          </PartyRow>
        </Party>
        <Party>
          <PartyLabel>공급받는자</PartyLabel>
          <PartyRow>
            <PartyKey>상호</PartyKey>
            <PartyVal>Sloway</PartyVal>
          </PartyRow>
          <PartyRow>
            <PartyKey>등록번호</PartyKey>
            <PartyVal>123-45-67890</PartyVal>
          </PartyRow>
          <PartyRow>
            <PartyKey>대표자</PartyKey>
            <PartyVal>Sloway</PartyVal>
          </PartyRow>
          <PartyRow>
            <PartyKey>업태/종목</PartyKey>
            <PartyVal>플랫폼 / 중개</PartyVal>
          </PartyRow>
        </Party>
      </PartyGrid>

      <PeriodLine>
        정산 기간 : {fmtDate(settle.settleStartDate)} ~{' '}
        {fmtDate(settle.settleEndDate)}
      </PeriodLine>

      <Table>
        <thead>
          <tr>
            <Th $w="55%">품목</Th>
            <Th $right>금액</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>공간 이용 매출 (공급가액)</Td>
            <Td $right>{won(supply)}</Td>
          </tr>
          <tr>
            <Td>부가가치세 (10%)</Td>
            <Td $right>{won(vat)}</Td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <Tf>합계 금액</Tf>
            <Tf $right>{won(total)}</Tf>
          </tr>
        </tfoot>
      </Table>

      <PayoutBox>
        <div>
          <PayoutKey>정산 실지급액</PayoutKey>
          <PayoutNote>
            매출 {won(settle.totalAmt)} − 수수료 {won(settle.feeAmt)} − 환불{' '}
            {won(settle.refundAmt)}
          </PayoutNote>
        </div>
        <PayoutVal>{won(settle.payoutAmt)}</PayoutVal>
      </PayoutBox>
      {settle.carryOver > 0 && (
        <CarryLine>※ 다음 회차 이월액 {won(settle.carryOver)}</CarryLine>
      )}

      <Remark>
        비고 : 본 계산서는 공간 이용 매출 정산 건에 대해 발행되었습니다. 공급가액은
        수수료·환불 차감 전 총매출 기준입니다.
      </Remark>
      <Footer>본 계산서는 Sloway 정산 시스템에서 자동 발행되었습니다.</Footer>
    </Doc>
  );
});

TaxInvoiceDoc.displayName = 'TaxInvoiceDoc';
export default TaxInvoiceDoc;

const Doc = styled.div`
  width: 720px;
  padding: 48px 44px;
  background: #ffffff;
  color: #1a1a1a;
  font-family: 'Noto Sans KR', sans-serif;
  box-sizing: border-box;
`;
const DocTitle = styled.h1`
  margin: 0;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 8px;
`;
const DocSub = styled.p`
  margin: 6px 0 28px;
  text-align: center;
  font-size: 13px;
  color: #888888;
`;
const PartyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
`;
const Party = styled.div`
  border: 1px solid #d0d0d0;
  border-radius: 6px;
  padding: 16px 18px;
`;
const PartyLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #555555;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eeeeee;
`;
const PartyRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  margin-bottom: 7px;
`;
const PartyKey = styled.span`
  color: #888888;
`;
const PartyVal = styled.span`
  color: #1a1a1a;
  font-weight: 500;
  text-align: right;
`;
const PeriodLine = styled.div`
  font-size: 13px;
  color: #555555;
  margin-bottom: 14px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 22px;
`;
const Th = styled.th`
  width: ${({ $w }) => $w || 'auto'};
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  background: #2d2d2d;
  padding: 11px 14px;
`;
const Td = styled.td`
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: 13px;
  color: #1a1a1a;
  padding: 11px 14px;
  border-bottom: 1px solid #eeeeee;
`;
const Tf = styled.td`
  text-align: ${({ $right }) => ($right ? 'right' : 'left')};
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  padding: 13px 14px;
  background: #f5f5f5;
  border-top: 2px solid #2d2d2d;
`;
const PayoutBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #eef4ff;
  border: 1px solid #c5d9ff;
  border-radius: 6px;
`;
const PayoutKey = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a4fb0;
  margin-bottom: 4px;
`;
const PayoutNote = styled.div`
  font-size: 11px;
  color: #6b86b8;
`;
const PayoutVal = styled.strong`
  font-size: 20px;
  font-weight: 700;
  color: #0064ff;
`;
const CarryLine = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #888888;
`;
const Footer = styled.div`
  margin-top: 40px;
  padding-top: 16px;
  border-top: 1px solid #eeeeee;
  text-align: center;
  font-size: 11px;
  color: #aaaaaa;
`;

const MetaBar = styled.div`
  display: flex;
  gap: 24px;
  justify-content: flex-end;
  margin-bottom: 18px;
`;
const MetaItem = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 12px;
`;
const MetaKey = styled.span`
  color: #888888;
`;
const MetaVal = styled.span`
  color: #1a1a1a;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
`;
const Remark = styled.div`
  margin-top: 18px;
  padding: 12px 14px;
  background: #f7f7f7;
  border: 1px solid #eeeeee;
  border-radius: 6px;
  font-size: 11px;
  color: #777777;
  line-height: 1.6;
`;
