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
import { findOneRsvn, rejectRsvn } from '../../api/rsvnApi';
import { useEffect, useState } from 'react';

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
  overflow: hidden;
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

const STATUS_LABEL = { P: '결제대기', S: '확정', E: '완료', R: '거절', C: '취소' };
const SPACE_TYPE_ICON = { WORK_STAY: '🌿', OFFICE: '💻', STATION: '🛌' };

// RsvnStatus가 enum 객체로 올 수 있어서 문자열로 변환
const statusCode = (s) => (typeof s === 'object' ? s?.name ?? String(s) : s);

// checkIn·checkOut(LocalDateTime) → "2025.01.01 · 2박" 형태
function formatDate(checkIn, checkOut) {
  if (!checkIn) return '';
  const inStr = String(checkIn).slice(0, 10).replaceAll('-', '.');
  if (!checkOut) return inStr;
  const nights = Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
  return nights > 0 ? `${inStr} · ${nights}박` : inStr;
}

function HostRsvnDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [rsvn, setRsvn] = useState(location.state?.rsvn ?? null);

  useEffect(() => {
    if (rsvn) return;
    findOneRsvn(id).then(setRsvn);
  }, [id]);

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
          <SpaceThumb>
            {rsvn.thumbnailUrl
              ? <img src={rsvn.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : (SPACE_TYPE_ICON[rsvn.spaceType] ?? '🏠')
            }
          </SpaceThumb>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <RsvnStatusBadge
                type="status"
                label={STATUS_LABEL[statusCode(rsvn.status)] ?? statusCode(rsvn.status)}
              />
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{rsvn.spaceName}</div>
            <div style={{ fontSize: 12, color: COLOR.gray400, marginTop: 4 }}>
              예약번호 {rsvn.no}
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
              👤 {rsvn.count}명
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
            <InfoValue>{formatDate(rsvn.checkIn, rsvn.checkOut)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이용 인원</InfoLabel>
            <InfoValue>{rsvn.count}명</InfoValue>
          </InfoItem>
        </InfoGrid>
        {rsvn.special && <RequestBox>💬 {rsvn.special}</RequestBox>}
      </SectionBox>

      {/* 결제 정보 */}
      <SectionBox>
        <SectionTitle>결제 정보</SectionTitle>
        <PayRow $total>
          <span>총 결제 금액</span>
          <span>{rsvn.amt?.toLocaleString()}원</span>
        </PayRow>
        {/* 상세 결제 내역은 결제 도메인(4번 우영님) 연동 후 추가 예정 */}
      </SectionBox>

      {/* 거절 버튼 — 확정 상태일 때만 */}
      {statusCode(rsvn.status) === 'S' && (
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
