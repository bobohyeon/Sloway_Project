import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/hooks/useAuth';
import { findMyRefunds } from '../../../refund/api/refundApi';
import styled, { keyframes } from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  TabBar,
  TabBtn,
  TabCount,Card,
  CardRow,
  Thumb,
  CardBody,
  TagRow,
  CardTitle,
  CardMeta,
  CardRight,
  COLOR,
} from '../../components/user/RsvnStyled';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const TABS = [
  { label: '전체', status: null },
  { label: '환불 완료', status: 'COMPLETED' },
  { label: '환불 요청', status: 'REQUESTED' },
];

const STATUS_LABEL = { REQUESTED: '환불 요청', APPROVED: '환불 승인', COMPLETED: '환불 완료' };
const REASON_LABEL = {
  SCHEDULE: '일정 변경', SPACE: '공간 변경', HEALTH: '건강상의 이유',
  PERSONAL: '개인 사정', PRICE: '가격 부담', ETC: '기타',
};


const PenaltyNote = styled.div`
  font-size: 12px;
  color: ${COLOR.red};
`;

const AutoTag = styled.span`
  font-size: 11px;
  color: ${COLOR.green};
`;

const SummaryBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 12px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  text-align: center;
  margin-top: 20px;
`;

const SumVal = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${({ $red }) => ($red ? COLOR.red : COLOR.black)};
  margin-bottom: 4px;
`;

const SumLbl = styled.div`
  font-size: 12px;
  color: ${COLOR.gray400};
`;

function RefundListPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [refunds, setRefunds] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.memberNo) return;
    findMyRefunds(user.memberNo)
      .then(setRefunds)
      .catch(() => setRefunds([]));
  }, [user?.memberNo]);

  const filtered =
    activeTab === 0
      ? refunds
      : refunds.filter((i) => i.status === TABS[activeTab].status);

  const counts = TABS.map((tab, idx) =>
    idx === 0
      ? refunds.length
      : refunds.filter((i) => i.status === tab.status).length
  );

  const totalAmt = refunds.reduce((sum, r) => sum + Number(r.refundAmt ?? 0), 0);

  const formatDate = (dt) => dt?.slice(0, 10).replaceAll('-', '.') ?? '';
  const formatCode = (r) =>
    `RF-${formatDate(r.requestedAt).replaceAll('.', '')}-${String(r.no).padStart(5, '0')}`;

  return (
    <PageLayout
      title="취소·환불 내역"
      description="내가 취소했거나 환불된 예약의 처리 현황을 한눈에 볼 수 있어요"
      maxWidth={960}
    >
      <TabBar>
        {TABS.map((tab, idx) => (
          <TabBtn
            key={idx}
            $active={activeTab === idx}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
            <TabCount $active={activeTab === idx}>{counts[idx]}</TabCount>
          </TabBtn>
        ))}
      </TabBar>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: COLOR.gray400, fontSize: 14 }}>
          취소·환불 내역이 없어요
        </div>
      )}
      {filtered.map((item) => (
        <Card key={item.no} style={{ cursor: 'default' }}>
          <CardRow>
            <Thumb>💳</Thumb>
            <CardBody>
              <TagRow>
                <RsvnStatusBadge type="status" label={STATUS_LABEL[item.status] ?? item.status} />
              </TagRow>
              <CardTitle>예약 #{item.rsvnNo}</CardTitle>
              <CardMeta>
                <span>{formatCode(item)}</span>
                <span>·</span>
                <span>신청 {formatDate(item.requestedAt)} · {REASON_LABEL[item.refundReason] ?? item.refundReason}</span>
              </CardMeta>
            </CardBody>
            <CardRight>
              <div style={{ fontSize: 11, color: COLOR.gray400 }}>환불</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>
                {Number(item.refundAmt ?? 0).toLocaleString()}원
              </div>
            </CardRight>
          </CardRow>
        </Card>
      ))}

      <SummaryBox>
        <div>
          <SumVal>{refunds.length}</SumVal>
          <SumLbl>총 건수</SumLbl>
        </div>
        <div>
          <SumVal>{totalAmt.toLocaleString()}원</SumVal>
          <SumLbl>총 환불 금액</SumLbl>
        </div>
        <div>
          <SumVal $red>-</SumVal>
          <SumLbl>총 위약금</SumLbl>
        </div>
      </SummaryBox>
    </PageLayout>
  );
}

export default RefundListPage;
