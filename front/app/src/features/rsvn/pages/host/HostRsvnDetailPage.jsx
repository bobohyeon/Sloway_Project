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
  BtnOutline,
  COLOR,
} from '../../components/user/RsvnStyled';
import { ApproveBtn } from '../../components/host/HostRsvnStyled';

const TopCard = styled.div`
  background: #fff;
  border: 1.5px solid ${COLOR.orange};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

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

const NewBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: #fff0e0;
  color: ${COLOR.orange};
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
  flex-shrink: 0;
`;

const PayRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${({ $total }) => ($total ? COLOR.black : COLOR.gray600)};
  font-weight: ${({ $total }) => ($total ? 700 : 400)};
  margin-bottom: 10px;
`;

const SettleBox = styled.div`
  background: #fff8f0;
  border: 1px solid #ffd9b0;
  border-radius: 10px;
  padding: 16px 18px;
  margin-top: 14px;
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

const BottomBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${COLOR.gray200};
`;

function HostRsvnDetailPage() {
  const navigate = useNavigate();

  return (
    <div>
      <PageTitle>예약 상세</PageTitle>
      <PageSub>예약 내역과 게스트 정보를 확인하세요</PageSub>
      <BackLink onClick={() => navigate('/host/reservation/list')}>
        ← 예약 목록
      </BackLink>

      {/* 상단 공간 + 승인/거절 */}
      <TopCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <SpaceThumb>🌲</SpaceThumb>
          <div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <RsvnStatusBadge type="status" label="승인 대기" />
              <NewBadge>NEW</NewBadge>
            </div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>
              청평 숲속 파인뷰
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray400, marginTop: 4 }}>
              예약번호 SW-20260424-000892
            </div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              요청 · 2026.04.24 14:32
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <ApproveBtn $reject>거절</ApproveBtn>
          <ApproveBtn>✓ 예약 승인</ApproveBtn>
        </div>
      </TopCard>

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
          <GuestAvatar>박</GuestAvatar>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>박민수</div>
            <div style={{ fontSize: 12, color: COLOR.gray400 }}>
              2024.11 가입 · Sloway 이용 3회 · 평점 ★ 4.8
            </div>
          </div>
          <BtnOutline style={{ fontSize: 12, padding: '5px 12px' }}>
            💬 메시지 보내기
          </BtnOutline>
        </div>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>연락처</InfoLabel>
            <InfoValue>010-****-2222</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>min****@sloway.co.kr</InfoValue>
          </InfoItem>
        </InfoGrid>
      </SectionBox>

      {/* 예약 내용 */}
      <SectionBox>
        <SectionTitle>예약 내용</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>체크인</InfoLabel>
            <InfoValue>2026.05.10 (토) 오후 3:00</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>체크아웃</InfoLabel>
            <InfoValue>2026.05.12 (월) 오전 11:00까지</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>기간</InfoLabel>
            <InfoValue>2박 3일</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이용 인원</InfoLabel>
            <InfoValue>3명</InfoValue>
          </InfoItem>
        </InfoGrid>
        <RequestBox>
          💬 조용한 업무가 가능한지 궁금해요. 노트북 자리 외 별도 모니터 사용
          가능한가요?
        </RequestBox>
      </SectionBox>

      {/* 예상 정산 */}
      <SectionBox>
        <SectionTitle>💰 예상 정산 금액</SectionTitle>
        <PayRow>
          <span>게스트 결제 금액</span>
          <span>382,000원</span>
        </PayRow>
        <PayRow>
          <span style={{ color: COLOR.gray400 }}>플랫폼 수수료 (12.5%)</span>
          <span style={{ color: COLOR.gray400 }}>-49,500원</span>
        </PayRow>
        <div
          style={{ borderTop: `1px solid ${COLOR.gray200}`, margin: '10px 0' }}
        />
        <PayRow $total>
          <span>내 정산 금액</span>
          <span style={{ color: COLOR.terra }}>332,500원</span>
        </PayRow>
        <div style={{ fontSize: 11, color: COLOR.gray400, marginTop: 4 }}>
          정산 예정일: 이용 완료 후 다음 정산일 (월 1회, 매월 5일)
        </div>
      </SectionBox>

      {/* 결제 정보 */}
      <SectionBox>
        <SectionTitle>결제 정보</SectionTitle>
        <PayRow>
          <span>결제 수단</span>
          <span>카카오페이</span>
        </PayRow>
        <PayRow>
          <span>숙박비 (2박)</span>
          <span>370,000원</span>
        </PayRow>
        <PayRow>
          <span>서비스 수수료</span>
          <span>12,000원</span>
        </PayRow>
        <div
          style={{ borderTop: `1px solid ${COLOR.gray200}`, margin: '10px 0' }}
        />
        <PayRow $total>
          <span>총 결제 금액</span>
          <span style={{ color: COLOR.terra }}>382,000원</span>
        </PayRow>
      </SectionBox>

      <BottomBar>
        <BtnOutline onClick={() => navigate('/host/reservation/list')}>
          목록으로
        </BtnOutline>
        <div style={{ display: 'flex', gap: 8 }}>
          <ApproveBtn $reject>예약 거절</ApproveBtn>
          <ApproveBtn>✓ 예약 승인</ApproveBtn>
        </div>
      </BottomBar>
    </div>
  );
}

export default HostRsvnDetailPage;
