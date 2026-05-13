import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageLayout from '../../../../app/layouts/page/PageLayout';
import RsvnStatusBadge from '../../components/user/RsvnStatusBadge';
import {
  SectionBox,
  SectionTitle,
  BtnOutline,
  COLOR,
} from '../../components/user/RsvnStyled';

const TopCard = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const TotalPrice = styled.div`
  text-align: right;
`;

const InfoThreeCol = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 16px;
`;

const InfoCard = styled.div`
  background: #fff;
  border: 1px solid ${COLOR.gray200};
  border-radius: 10px;
  padding: 18px;
`;

const InfoCardTitle = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${COLOR.gray400};
  margin-bottom: 12px;
`;

const Avatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: ${({ $color }) => $color || COLOR.sage};
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
  span:last-child {
    color: ${({ $accent }) => ($accent ? COLOR.terra : 'inherit')};
  }
`;

const SettleBox = styled.div`
  background: #fff8f0;
  border: 1px solid #ffd9b0;
  border-radius: 10px;
  padding: 16px 18px;
  margin-top: 14px;
`;

const LogItem = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 0;
  border-bottom: 1px solid ${COLOR.gray100};
  &:last-child {
    border-bottom: none;
  }
`;

const LogDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color || COLOR.gray400};
  margin-top: 4px;
  flex-shrink: 0;
`;

const LogTag = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(168, 184, 159, 0.18);
  color: #5b6b53;
`;

const ForceBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid #fcc;
  background: #fff0f0;
  color: ${COLOR.red};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    background: #ffe0e0;
  }
`;

function AdminRsvnDetailPage() {
  const navigate = useNavigate();

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
            <RsvnStatusBadge type="status" label="확정" />
            <span style={{ fontSize: 12, color: COLOR.gray400 }}>
              SW-20260508-000847
            </span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            청평 숲속 파인뷰 스테이
          </div>
          <div
            style={{
              display: 'flex',
              gap: 14,
              fontSize: 12,
              color: COLOR.gray400,
            }}
          >
            <span>📅 2026.05.08 ~ 2026.05.10</span>
            <span>2박 3일</span>
            <span>👤 2명</span>
          </div>
        </div>
        <TotalPrice>
          <div style={{ fontSize: 12, color: COLOR.gray400 }}>총 결제</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: COLOR.terra }}>
            326,500원
          </div>
        </TotalPrice>
      </TopCard>

      {/* 게스트·호스트·공간 3열 */}
      <InfoThreeCol>
        <InfoCard>
          <InfoCardTitle>👤 게스트 (회원)</InfoCardTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <Avatar $color={COLOR.sage}>홍</Avatar>
            <div>
              <div style={{ fontWeight: 700 }}>홍길동</div>
              <div style={{ fontSize: 11, color: COLOR.gray400 }}>M000124</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: COLOR.gray600, marginBottom: 4 }}>
            hon****@sloway.co.kr
          </div>
          <div style={{ fontSize: 12, color: COLOR.gray600, marginBottom: 10 }}>
            010-****-0000
          </div>
          <span style={{ fontSize: 12, color: COLOR.green, cursor: 'pointer' }}>
            회원 상세 →
          </span>
        </InfoCard>

        <InfoCard>
          <InfoCardTitle>🏠 호스트</InfoCardTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <Avatar $color={COLOR.terra}>청</Avatar>
            <div>
              <div style={{ fontWeight: 700 }}>청평스테이</div>
              <div style={{ fontSize: 11, color: COLOR.gray400 }}>H000012</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: COLOR.gray600, marginBottom: 4 }}>
            대표자: 김우영
          </div>
          <div style={{ fontSize: 12, color: COLOR.gray600, marginBottom: 10 }}>
            031-****-5678
          </div>
          <span style={{ fontSize: 12, color: COLOR.green, cursor: 'pointer' }}>
            호스트 상세 →
          </span>
        </InfoCard>

        <InfoCard>
          <InfoCardTitle>🌿 공간</InfoCardTitle>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: COLOR.cream,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              🌲
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>청평 숲속 파인뷰 스테이</div>
              <div style={{ fontSize: 11, color: COLOR.gray400 }}>
                SP-000001
              </div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: COLOR.gray600, marginBottom: 4 }}>
            유형: 워크앤스테이
          </div>
          <div style={{ fontSize: 12, color: COLOR.gray600, marginBottom: 10 }}>
            위치: 경기 가평
          </div>
          <span style={{ fontSize: 12, color: COLOR.green, cursor: 'pointer' }}>
            공간 상세 →
          </span>
        </InfoCard>
      </InfoThreeCol>

      {/* 결제 정보 */}
      <SectionBox>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
          }}
        >
          <SectionTitle style={{ margin: 0 }}>💳 결제 정보</SectionTitle>
          <span style={{ fontSize: 12, color: COLOR.green, cursor: 'pointer' }}>
            결제 상세 →
          </span>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px 40px',
          }}
        >
          <PayRow>
            <span>결제 ID</span>
            <span style={{ fontSize: 12 }}>PAY-20260424-847</span>
          </PayRow>
          <PayRow>
            <span>기본 요금</span>
            <span>370,000원</span>
          </PayRow>
          <PayRow>
            <span>결제 수단</span>
            <span>카카오페이</span>
          </PayRow>
          <PayRow>
            <span>서비스 수수료</span>
            <span>12,000원</span>
          </PayRow>
          <PayRow>
            <span>PG사</span>
            <span>KG이니시스</span>
          </PayRow>
          <PayRow>
            <span>할인</span>
            <span style={{ color: COLOR.terra }}>-55,500원</span>
          </PayRow>
          <PayRow>
            <span style={{ fontSize: 12 }}>승인번호</span>
            <span style={{ fontSize: 12 }}>KP-20260424-00512847</span>
          </PayRow>
          <PayRow $total $accent>
            <span>최종 결제</span>
            <span>326,500원</span>
          </PayRow>
        </div>
        <SettleBox>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLOR.terra,
              marginBottom: 8,
            }}
          >
            플랫폼 수익 분배
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
              marginBottom: 4,
            }}
          >
            <span>호스트 정산 (87.5%)</span>
            <span style={{ fontWeight: 600 }}>285,687원</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 13,
            }}
          >
            <span>플랫폼 수수료 (12.5%)</span>
            <span style={{ fontWeight: 600, color: COLOR.terra }}>
              40,813원
            </span>
          </div>
        </SettleBox>
      </SectionBox>

      {/* 예약 이벤트 로그 */}
      <SectionBox>
        <SectionTitle>📋 예약 이벤트 로그</SectionTitle>
        {[
          {
            color: COLOR.gray400,
            time: '2026.04.24 14:30',
            title: '예약 신청',
            tag: '게스트',
            desc: '홍길동님이 예약 신청',
          },
          {
            color: COLOR.green,
            time: '2026.04.24 14:32',
            title: '결제 완료',
            tag: '게스트',
            desc: '카카오페이 326,500원',
          },
          {
            color: COLOR.green,
            time: '2026.04.24 14:32',
            title: '예약 확정',
            tag: '자동',
            desc: '결제에 따른 자동 확정',
          },
          {
            color: COLOR.sage,
            time: '2026.04.24 14:45',
            title: '호스트 메시지',
            tag: '호스트',
            desc: '청평스테이님이 환영 메시지 전송',
          },
        ].map((log, i) => (
          <LogItem key={i}>
            <LogDot $color={log.color} />
            <div>
              <div style={{ fontSize: 11, color: COLOR.gray400 }}>
                {log.time}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {log.title} <LogTag>{log.tag}</LogTag>
              </div>
              <div style={{ fontSize: 12, color: COLOR.gray600 }}>
                {log.desc}
              </div>
            </div>
          </LogItem>
        ))}
      </SectionBox>
    </PageLayout>
  );
}

export default AdminRsvnDetailPage;
