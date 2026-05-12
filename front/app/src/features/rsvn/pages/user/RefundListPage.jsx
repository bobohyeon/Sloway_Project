import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  TabBar,
  TabBtn,
  TabCount,
  PageTitle,
  PageSub,
  Card,
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

const Page = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 24px;
  animation: ${fadeInUp} 480ms ease-out both;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

// status: '완료' | '환불 불가' 만 사용
const TABS = [
  { label: '전체', status: null },
  { label: '환불 완료', status: '완료' },
  { label: '환불 불가', status: '환불 불가' },
];

const DUMMY = [
  {
    id: 2,
    status: '완료',
    autoTag: null,
    title: '남해 올리브 팜스테이',
    code: 'RF-20260320-00612',
    date: '신청 2026.03.20 · 완료 2026.03.24 · 개인 사정',
    price: '165,000원',
    penaltyNote: '위약금 165,000원',
    icon: '✉️',
  },
  {
    id: 3,
    status: '완료',
    autoTag: '💚 호스트 거절 · 자동환불',
    title: '성수 브릭라운지',
    code: 'RF-20260215-00344',
    date: '신청 2026.02.15 · 완료 2026.02.15 · 호스트 거절',
    price: '28,000원',
    penaltyNote: null,
    icon: '🧱',
  },
  {
    id: 4,
    status: '환불 불가',
    autoTag: null,
    title: '양양 파도소리 빌라',
    code: 'RF-20260108-00122',
    date: '신청 2026.01.08 · 이용일 당일 취소',
    price: '0원',
    penaltyNote: null,
    icon: '🌅',
  },
];

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
  const navigate = useNavigate();

  const filtered =
    activeTab === 0
      ? DUMMY
      : DUMMY.filter((i) => i.status === TABS[activeTab].status);

  const counts = TABS.map((tab, idx) =>
    idx === 0
      ? DUMMY.length
      : DUMMY.filter((i) => i.status === tab.status).length
  );

  return (
    <Page>
      <Header>
        <PageTitle>취소·환불 내역</PageTitle>
        <PageSub>
          내가 취소했거나 환불된 예약의 처리 현황을 한눈에 볼 수 있어요
        </PageSub>
      </Header>
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
      {filtered.map((item) => (
        <Card key={item.id} onClick={() => navigate('/user/refund/complete')}>
          <CardRow>
            <Thumb>{item.icon}</Thumb>
            <CardBody>
              <TagRow>
                <RsvnStatusBadge type="status" label={item.status} />
                {item.autoTag && <AutoTag>{item.autoTag}</AutoTag>}
              </TagRow>
              <CardTitle>{item.title}</CardTitle>
              <CardMeta>
                <span>{item.code}</span>
                <span>·</span>
                <span>{item.date}</span>
              </CardMeta>
            </CardBody>
            <CardRight>
              <div style={{ fontSize: 11, color: COLOR.gray400 }}>환불</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{item.price}</div>
              {item.penaltyNote && (
                <PenaltyNote>{item.penaltyNote}</PenaltyNote>
              )}
            </CardRight>
          </CardRow>
        </Card>
      ))}

      <SummaryBox>
        <div>
          <SumVal>{DUMMY.length}</SumVal>
          <SumLbl>총 건수</SumLbl>
        </div>
        <div>
          <SumVal>193,000원</SumVal>
          <SumLbl>총 환불 금액</SumLbl>
        </div>
        <div>
          <SumVal $red>165,000원</SumVal>
          <SumLbl>총 위약금</SumLbl>
        </div>
      </SummaryBox>
    </Page>
  );
}

export default RefundListPage;
