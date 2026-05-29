import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  SectionBox,
  SectionTitle,
  COLOR,
} from '../../components/user/RsvnStyled';

const TopCard = styled.div`
  background: #fff; border: 1px solid ${COLOR.gray200}; border-radius: 12px; padding: 20px;
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;
`;

const TotalPrice = styled.div`text-align: right;`;

const InfoThreeCol = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px;
`;

const InfoCard = styled.div`
  background: #fff; border: 1px solid ${COLOR.gray200}; border-radius: 10px; padding: 18px;
`;

const InfoCardTitle = styled.div`
  font-size: 12px; font-weight: 700; color: ${COLOR.gray400}; margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 44px; height: 44px; border-radius: 50%;
  background: ${({ $color }) => $color || COLOR.sage};
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 16px; color: #fff; flex-shrink: 0;
`;

const PayRow = styled.div`
  display: flex; justify-content: space-between; font-size: 13px;
  color: ${({ $total }) => ($total ? COLOR.black : COLOR.gray600)};
  font-weight: ${({ $total }) => ($total ? 700 : 400)};
  margin-bottom: 10px;
`;

const LogItem = styled.div`
  display: flex; gap: 12px; align-items: flex-start; padding: 10px 0;
  border-bottom: 1px solid ${COLOR.gray100}; &:last-child { border-bottom: none; }
`;

const LogDot = styled.div`
  width: 10px; height: 10px; border-radius: 50%; background: ${({ $color }) => $color || COLOR.gray400};
  margin-top: 4px; flex-shrink: 0;
`;

const LogTag = styled.span`
  font-size: 10px; font-weight: 700; padding: 1px 6px; border-radius: 4px;
  background: rgba(168, 184, 159, 0.18); color: #5b6b53;
`;

const ForceBtn = styled.button`
  padding: 6px 14px; border-radius: 8px; border: 1px solid #fcc;
  background: #fff0f0; color: ${COLOR.red}; font-size: 12px; font-weight: 600;
  cursor: pointer; display: flex; align-items: center; gap: 4px;
  &:hover { background: #ffe0e0; }
`;

function AdminRsvnDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const rsvn = location.state?.rsvn;

  if (!rsvn) {
    return (
      <PageLayout title="예약 상세" backTo="/admin/reservation" backLabel="전체 예약" maxWidth={1200}>
        <div style={{ textAlign: 'center', padding: 40, color: COLOR.gray400 }}>예약 데이터를 불러오지 못했어요</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="예약 상세"
      description="예약 정보를 확인하고 필요 시 강제 취소할 수 있습니다"
      backTo="/admin/reservation"
      backLabel="전체 예약"
      actions={<ForceBtn>⚠️ 강제 취소</ForceBtn>}
      maxWidth={1200}
    >
      {/* 예약 요약 */}
      <TopCard>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <RsvnStatusBadge type="status" label={rsvn.status} />
            <span style={{ fontSize: 12, color: COLOR.gray400 }}>{rsvn.code}</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{rsvn.space}</div>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: COLOR.gray400 }}>
            <span>📅 {rsvn.checkin} · {rsvn.period}</span>
          </div>
        </div>
        <TotalPrice>
          <div style={{ fontSize: 12, color: COLOR.gray400 }}>총 결제</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLOR.terra }}>{rsvn.price}</div>
        </TotalPrice>
      </TopCard>

      {/* 게스트·호스트·공간 */}
      <InfoThreeCol>
        <InfoCard>
          <InfoCardTitle>👤 게스트</InfoCardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar $color={rsvn.guestColor}>{rsvn.guest}</Avatar>
            <div>
              <div style={{ fontWeight: 700 }}>{rsvn.guestName}</div>
            </div>
          </div>
        </InfoCard>

        <InfoCard>
          <InfoCardTitle>🏠 호스트</InfoCardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar $color={COLOR.terra}>{rsvn.hostName?.[0]}</Avatar>
            <div><div style={{ fontWeight: 700 }}>{rsvn.hostName}</div></div>
          </div>
        </InfoCard>

        <InfoCard>
          <InfoCardTitle>🌿 공간</InfoCardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 44, height: 44, background: COLOR.cream, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🌲</div>
            <div>
              <div style={{ fontWeight: 700 }}>{rsvn.space}</div>
              <div style={{ fontSize: 11, color: COLOR.gray400 }}>{rsvn.type}</div>
            </div>
          </div>
        </InfoCard>
      </InfoThreeCol>

      {/* 결제 정보 */}
      <SectionBox>
        <SectionTitle>💳 결제 정보</SectionTitle>
        <PayRow $total>
          <span>결제 금액</span>
          <span>{rsvn.price}</span>
        </PayRow>
        <PayRow>
          <span>결제일</span>
          <span>{rsvn.paidAt}</span>
        </PayRow>
        {/* 상세 결제 내역은 결제 도메인(4번 우영님) 연동 후 추가 예정 */}
      </SectionBox>

      {/* 예약 이벤트 로그 */}
      <SectionBox>
        <SectionTitle>📋 예약 이벤트 로그</SectionTitle>
        <LogItem>
          <LogDot $color={COLOR.green} />
          <div>
            <div style={{ fontSize: 11, color: COLOR.gray400 }}>{rsvn.paidAt}</div>
            <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              예약 확정 <LogTag>자동</LogTag>
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray600 }}>결제 완료 후 자동 확정</div>
          </div>
        </LogItem>
      </SectionBox>
    </PageLayout>
  );
}

export default AdminRsvnDetailPage;
