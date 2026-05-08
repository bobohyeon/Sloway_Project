import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  PageTitle,
  PageSub,
  BackLink,
  SectionBox,
  SectionTitle,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  BtnPrimary,
  BtnOutline,
  COLOR,
} from '../../components/user/RsvnStyled';

const StatusBanner = styled.div`
  background: ${COLOR.gray100};
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Dday = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: ${COLOR.terra};
`;

const PayRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ $total }) => ($total ? COLOR.black : COLOR.gray600)};
  font-weight: ${({ $total }) => ($total ? 700 : 400)};
  margin-bottom: 10px;
  span:last-child {
    color: ${({ $discount }) => ($discount ? COLOR.terra : 'inherit')};
  }
`;

const PayDivider = styled.hr`
  border: none;
  border-top: 1px solid ${COLOR.gray200};
  margin: 12px 0;
`;

const CancelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 8px;
  background: ${({ $highlight }) => ($highlight ? '#FFF3E0' : COLOR.gray100)};
  color: ${({ $highlight }) => ($highlight ? COLOR.orange : '#555')};
  margin-bottom: 6px;
`;

const CancelNote = styled.div`
  font-size: 12px;
  color: ${COLOR.gray400};
  background: ${COLOR.gray100};
  padding: 12px 14px;
  border-radius: 8px;
  margin-top: 6px;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${COLOR.gray200};
`;

const CancelLink = styled.button`
  font-size: 13px;
  color: ${COLOR.gray400};
  text-decoration: underline;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${COLOR.red};
  }
`;

function RsvnDetailPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageTitle>예약 상세</PageTitle>
      <PageSub>예약 내역을 자세히 확인하실 수 있어요</PageSub>
      <BackLink onClick={() => navigate('/user/reservation')}>
        ← 예약 목록
      </BackLink>

      <StatusBanner>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RsvnStatusBadge type="status" label="확정" />
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            예약번호 SW-20260508-000847
          </span>
        </div>
        <Dday>D-14</Dday>
      </StatusBanner>

      <SectionBox>
        <SectionTitle>공간 정보</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: '#F4EFE6',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            🌲
          </div>
          <div style={{ flex: 1 }}>
            <RsvnStatusBadge type="type" label="워크앤스테이" />
            <div style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 2px' }}>
              청평 숲속 파인뷰 스테이
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              📍 경기 가평군 청평면 · 🏠 호스트 · 청평스테이
            </div>
          </div>
          <BtnOutline style={{ fontSize: 12, padding: '5px 12px' }}>
            공간 보기
          </BtnOutline>
        </div>
      </SectionBox>

      <SectionBox>
        <SectionTitle>이용 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>일정</InfoLabel>
            <InfoValue>2026.05.08 (목) ~ 2026.05.10 (토)</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>기간</InfoLabel>
            <InfoValue>2박 3일</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>인원</InfoLabel>
            <InfoValue>성인 2명</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>체크인</InfoLabel>
            <InfoValue>오후 3:00 이후</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>체크아웃</InfoLabel>
            <InfoValue>오전 11:00까지</InfoValue>
          </InfoItem>
        </InfoGrid>
      </SectionBox>

      <SectionBox>
        <SectionTitle>결제 정보</SectionTitle>
        <PayRow>
          <span>기본 요금 (185,000원 × 2박)</span>
          <span>370,000원</span>
        </PayRow>
        <PayRow>
          <span>서비스 수수료</span>
          <span>12,000원</span>
        </PayRow>
        <PayRow $discount>
          <span>🎟️ 쿠폰 할인</span>
          <span>-55,500원</span>
        </PayRow>
        <PayDivider />
        <PayRow $total>
          <span>결제 금액</span>
          <span>326,500원</span>
        </PayRow>
        <PayRow>
          <span>결제 수단</span>
          <span>카카오페이</span>
        </PayRow>
        <PayRow>
          <span>결제 일시</span>
          <span>2026.04.24 14:32</span>
        </PayRow>
        <BtnOutline
          style={{ fontSize: 12, padding: '5px 12px', marginTop: 12 }}
        >
          📄 영수증 보기
        </BtnOutline>
      </SectionBox>

      <SectionBox>
        <SectionTitle>취소 / 환불 정책</SectionTitle>
        <CancelRow>
          <span>~ 5/1 (7일 전)</span>
          <span>100% 환불</span>
        </CancelRow>
        <CancelRow>
          <span>5/2 ~ 5/4 (6~4일 전)</span>
          <span style={{ color: COLOR.orange }}>50% 환불</span>
        </CancelRow>
        <CancelRow>
          <span>5/5 ~ 5/7 (3~1일 전)</span>
          <span style={{ color: COLOR.orange }}>30% 환불</span>
        </CancelRow>
        <CancelRow $highlight>
          <span>5/8 (당일 · 이용 이후)</span>
          <span>환불 불가</span>
        </CancelRow>
        <CancelNote>
          호스트가 예약을 거절할 경우 위 정책과 무관하게 100% 자동 환불됩니다.
        </CancelNote>
      </SectionBox>

      <SectionBox>
        <SectionTitle>호스트 연락</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              background: COLOR.gray200,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}
          >
            🏠
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>청평스테이</div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              031-***-5678
            </div>
          </div>
          <BtnPrimary style={{ fontSize: 12, padding: '5px 12px' }}>
            💬 1:1 채팅
          </BtnPrimary>
        </div>
      </SectionBox>

      <BottomBar>
        <CancelLink onClick={() => navigate('/user/reservation/cancel')}>
          예약 취소 / 환불 신청
        </CancelLink>
        <BtnPrimary onClick={() => navigate('/user/reservation')}>
          목록으로
        </BtnPrimary>
      </BottomBar>
    </div>
  );
}

export default RsvnDetailPage;
