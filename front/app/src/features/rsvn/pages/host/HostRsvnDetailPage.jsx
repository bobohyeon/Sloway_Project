import { useNavigate, useParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  SectionBox,
  SectionTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  BtnOutline,
  COLOR,
} from '../../components/user/RsvnStyled';
import { ApproveBtn } from '../../components/host/HostRsvnStyled';
import api from '../../../../app/api/axiosApi';
import { rejectRsvn } from '../../api/rsvnApi';

const SpaceThumb = styled.div`
  width: 52px;
  height: 52px;
  background: ${COLOR.cream};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
`;

const GuestAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${COLOR.sage};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: #fff;
`;

const PayRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ $total }) => ($total ? COLOR.black : COLOR.gray600)};
  font-weight: ${({ $total }) => ($total ? 700 : 400)};
  margin-bottom: 10px;
`;

const RequestBox = styled.div`
  background: ${COLOR.gray100};
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  color: ${COLOR.gray600};
  line-height: 1.6;
  margin-top: 10px;
`;

const STATUS_LABEL = { S: '확정', E: '완료', R: '거절', C: '취소' };

function HostRsvnDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const rsvn = location.state?.rsvn;

  const handleReject = async () => {
    const ok = window.confirm('예약을 거절하시겠어요?');
    if (!ok) return;
    try {
      const reject = await rejectRsvn(rsvn.no, rsvn.payNo);
      navigate('/host/reservation/list');
    } catch {
      alert('거절 처리에 실패했습니다.');
    }
  };

  if (!rsvn) {
    return (
      <PageLayout
        title="예약 상세"
        backTo="/host/reservation/list"
        backLabel="예약 목록"
        maxWidth={960}
      >
        <div style={{ textAlign: 'center', padding: 40, color: COLOR.gray400 }}>
          예약 데이터를 불러오지 못했어요
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="예약 상세"
      description="예약 내역과 게스트 정보를 확인하세요"
      backTo="/host/reservation/list"
      backLabel="예약 목록"
      maxWidth={960}
    >
      {/* 공간 + 상태 */}
      <SectionBox style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <SpaceThumb>{rsvn.icon ?? '🏠'}</SpaceThumb>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <RsvnStatusBadge
                type="status"
                label={STATUS_LABEL[rsvn.status] ?? rsvn.status}
              />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{rsvn.title}</div>
            <div style={{ fontSize: 12, color: COLOR.gray400, marginTop: 4 }}>
              예약번호 {rsvn.code}
            </div>
          </div>
        </div>
      </SectionBox>

      {/* 게스트 정보 */}
      <SectionBox>
        <SectionTitle>게스트 정보</SectionTitle>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}
        >
          <GuestAvatar>{rsvn.guestName?.[0] ?? '?'}</GuestAvatar>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {rsvn.guestName}
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              👤 {rsvn.guests}명
            </div>
          </div>
          <BtnOutline
            style={{ fontSize: 12, padding: '5px 12px' }}
            onClick={() => navigate('/host/chat')}
          >
            💬 메시지 보내기
          </BtnOutline>
        </div>
      </SectionBox>

      {/* 예약 내용 */}
      <SectionBox>
        <SectionTitle>예약 내용</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>일정</InfoLabel>
            <InfoValue>{rsvn.date}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이용 인원</InfoLabel>
            <InfoValue>{rsvn.guests}명</InfoValue>
          </InfoItem>
        </InfoGrid>
        {rsvn.special && <RequestBox>💬 {rsvn.special}</RequestBox>}
      </SectionBox>

      {/* 결제 정보 */}
      <SectionBox>
        <SectionTitle>결제 정보</SectionTitle>
        <PayRow $total>
          <span>총 결제 금액</span>
          <span>{rsvn.price}</span>
        </PayRow>
        {/* 상세 결제 내역은 결제 도메인(4번 우영님) 연동 후 추가 예정 */}
      </SectionBox>

      {/* 거절 버튼 — 확정 상태일 때만 */}
      {rsvn.status === 'S' && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: 24,
            paddingTop: 20,
            borderTop: `1px solid ${COLOR.gray200}`,
          }}
        >
          <ApproveBtn $reject onClick={handleReject}>
            예약 거절
          </ApproveBtn>
        </div>
      )}
    </PageLayout>
  );
}

export default HostRsvnDetailPage;
