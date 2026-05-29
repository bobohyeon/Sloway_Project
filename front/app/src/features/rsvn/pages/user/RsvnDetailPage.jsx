import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
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
  BtnPrimary,
  BtnOutline,
  COLOR,
} from '../../components/user/RsvnStyled';
import api from '../../../../app/api/axiosApi';

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
`;

const PayDivider = styled.hr`
  border: none;
  border-top: 1px solid ${COLOR.gray200};
  margin: 12px 0;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${COLOR.gray200};
`;

const RefundBtn = styled.button`
  padding: 10px 24px;
  border-radius: 8px;
  background: ${COLOR.terra};
  color: #fff;
  border: none;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  &:hover { filter: brightness(0.9); }
`;

const STATUS_LABEL = { S: '예약확정', E: '이용완료', C: '예약취소', R: '예약거절' };

function RsvnDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rsvn, setRsvn] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/reservation/${id}`);
        setRsvn(res.data);
      } catch {
        alert('예약 정보를 불러오지 못했어요');
        navigate('/user/reservation');
      }
    };
    fetch();
  }, [id]);

  if (!rsvn) {
    return (
      <PageLayout title="예약 상세" backTo="/user/reservation" maxWidth={960}>
        <div style={{ textAlign: 'center', padding: 40, color: COLOR.gray400 }}>불러오는 중...</div>
      </PageLayout>
    );
  }

  const ci = dayjs(rsvn.checkIn);
  const co = dayjs(rsvn.checkOut);
  const nights = co.diff(ci, 'day');
  const diff = ci.diff(dayjs(), 'day');
  const dday = rsvn.status === 'S'
    ? (diff >= 0 ? `D-${diff}` : `D+${Math.abs(diff)}`)
    : null;

  const spaceRoute = rsvn.officeNo ? 'coworking-offices'
    : rsvn.workStayNo ? 'workstays'
    : rsvn.stationNo ? 'stations'
    : null;
  const spaceId = rsvn.officeNo ?? rsvn.workStayNo ?? rsvn.stationNo;

  return (
    <PageLayout
      title="예약 상세"
      description="예약 내역을 자세히 확인하실 수 있어요"
      backTo="/user/reservation"
      maxWidth={960}
    >
      <StatusBanner>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RsvnStatusBadge type="status" label={STATUS_LABEL[rsvn.status] ?? rsvn.status} />
          <span style={{ fontSize: 13, fontWeight: 700 }}>
            예약번호 SW-{String(rsvn.no).padStart(8, '0')}
          </span>
        </div>
        {dday && <Dday>{dday}</Dday>}
      </StatusBanner>

      {/* 공간 정보 */}
      <SectionBox>
        <SectionTitle>공간 정보</SectionTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 56, height: 56, background: COLOR.cream, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          }}>
            {spaceRoute === 'workstays' ? '🌲' : spaceRoute === 'coworking-offices' ? '🏢' : '🏠'}
          </div>
          <div style={{ flex: 1 }}>
            {rsvn.spaceType && <RsvnStatusBadge type="type" label={rsvn.spaceType} />}
            <div style={{ fontSize: 15, fontWeight: 700, margin: '4px 0 2px' }}>
              {rsvn.spaceName ?? `공간 No.${spaceId}`}
            </div>
          </div>
          {spaceRoute && (
            <BtnOutline
              style={{ fontSize: 12, padding: '5px 12px' }}
              onClick={() => navigate(`/${spaceRoute}/${spaceId}`)}
            >
              공간 보기
            </BtnOutline>
          )}
        </div>
      </SectionBox>

      {/* 이용 정보 */}
      <SectionBox>
        <SectionTitle>이용 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>체크인</InfoLabel>
            <InfoValue>{ci.format('YYYY.MM.DD (ddd) HH:mm')}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>체크아웃</InfoLabel>
            <InfoValue>{co.format('YYYY.MM.DD (ddd) HH:mm')}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>기간</InfoLabel>
            <InfoValue>{nights > 0 ? `${nights}박 ${nights + 1}일` : '당일'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>인원</InfoLabel>
            <InfoValue>{rsvn.count}명</InfoValue>
          </InfoItem>
          {rsvn.special && (
            <InfoItem>
              <InfoLabel>특이사항</InfoLabel>
              <InfoValue>{rsvn.special}</InfoValue>
            </InfoItem>
          )}
        </InfoGrid>
      </SectionBox>

      {/* 결제 정보 */}
      <SectionBox>
        <SectionTitle>결제 정보</SectionTitle>
        <PayDivider />
        <PayRow $total>
          <span>결제 금액</span>
          <span>{rsvn.amt?.toLocaleString()}원</span>
        </PayRow>
        {/* 쿠폰·할인·결제수단 상세는 결제 도메인(4번) 연동 후 추가 예정 */}
      </SectionBox>

      {/* 하단 버튼 — 예약확정 상태일 때만 */}
      {rsvn.status === 'S' && (
        <BottomBar>
          <RefundBtn onClick={() => navigate('/user/refund/request')}>
            예약 취소 / 환불 신청
          </RefundBtn>
        </BottomBar>
      )}
    </PageLayout>
  );
}

export default RsvnDetailPage;
