import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import html2pdf from 'html2pdf.js';

const METHOD_LABEL = {
  KAKAOPAY: '카카오페이',
  TOSSPAY: '토스페이',
  NAVERPAY: '네이버페이',
};

const STATUS_LABEL = {
  READY: '결제 대기',
  COMPLETED: '결제 완료',
  FAILED: '결제 실패',
  CANCELED: '환불 완료',
};

const won = (n) => `${Number(n ?? 0).toLocaleString()}원`;

const fmtDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export function ReceiptModal({ pay, onClose }) {
  const docRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!docRef.current || downloading) return;
    setDownloading(true);
    html2pdf()
      .set({
        margin: 0,
        filename: `영수증_PAY-${String(pay.no).padStart(6, '0')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(docRef.current)
      .save()
      .then(() => setDownloading(false))
      .catch((err) => {
        console.error('영수증 PDF 생성 실패', err);
        setDownloading(false);
      });
  };

  return createPortal(
    <Backdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Doc ref={docRef}>
          <DocTitle>결제 영수증</DocTitle>
          <DocSub>Sloway</DocSub>

          <MetaRow>
            <span>영수증 번호</span>
            <strong>PAY-{String(pay.no).padStart(6, '0')}</strong>
          </MetaRow>
          <MetaRow>
            <span>결제 일시</span>
            <strong>{fmtDateTime(pay.approvedAt ?? pay.createdAt)}</strong>
          </MetaRow>
          <MetaRow>
            <span>예약 번호</span>
            <strong>RSVN-{String(pay.rsvnNo).padStart(6, '0')}</strong>
          </MetaRow>
          <MetaRow>
            <span>결제 수단</span>
            <strong>{METHOD_LABEL[pay.method] ?? pay.method}</strong>
          </MetaRow>
          <MetaRow>
            <span>승인 번호</span>
            <strong>{pay.tid ?? '—'}</strong>
          </MetaRow>
          <MetaRow>
            <span>상태</span>
            <strong>{STATUS_LABEL[pay.status] ?? pay.status}</strong>
          </MetaRow>

          <Divider />

          <AmtRow>
            <span>기본 금액</span>
            <span>{won(pay.baseAmt)}</span>
          </AmtRow>
          {pay.addAmt > 0 && (
            <AmtRow>
              <span>추가 금액</span>
              <span>{won(pay.addAmt)}</span>
            </AmtRow>
          )}
          {pay.dcAmt > 0 && (
            <AmtRow>
              <span>쿠폰 할인</span>
              <span>-{won(pay.dcAmt)}</span>
            </AmtRow>
          )}
          {pay.usedPoint > 0 && (
            <AmtRow>
              <span>포인트 사용</span>
              <span>-{won(pay.usedPoint)}</span>
            </AmtRow>
          )}

          <Divider />

          <TotalRow>
            <span>최종 결제 금액</span>
            <span>{won(pay.finalAmt)}</span>
          </TotalRow>

          <DocFooter>본 영수증은 Sloway에서 발행한 결제 내역서입니다.</DocFooter>
        </Doc>

        <Actions>
          <SecondaryBtn onClick={onClose}>닫기</SecondaryBtn>
          <PrimaryBtn onClick={handleDownload} disabled={downloading}>
            {downloading ? '생성 중…' : '📄 PDF 다운로드'}
          </PrimaryBtn>
        </Actions>
      </Modal>
    </Backdrop>,
    document.body
  );
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Modal = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
`;

const Doc = styled.div`
  background: #ffffff;
  padding: 32px 28px;
  color: #1a1a1a;
`;

const DocTitle = styled.h2`
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 4px;
`;

const DocSub = styled.div`
  text-align: center;
  color: #8a8a8a;
  font-size: 0.85rem;
  margin-bottom: 24px;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-bottom: 8px;

  span {
    color: #6a6a6a;
  }
  strong {
    color: #1a1a1a;
    font-weight: 600;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px dashed #d0d0d0;
  margin: 16px 0;
`;

const AmtRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 8px;
  color: #3a3a3a;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const DocFooter = styled.div`
  margin-top: 28px;
  text-align: center;
  font-size: 0.75rem;
  color: #a0a0a0;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 24px 24px;
`;

const SecondaryBtn = styled.button`
  flex: 0 0 auto;
  min-width: 100px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #d0d0d0;
  background: #ffffff;
  color: #3a3a3a;
  font-weight: 600;
  cursor: pointer;
`;

const PrimaryBtn = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #2d6a4f;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;
