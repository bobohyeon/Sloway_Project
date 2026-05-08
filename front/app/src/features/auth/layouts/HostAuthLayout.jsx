import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

// ─── Styled ────────────────────────────────────────────────
const Wrap = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  background: #f7f5ef;
`;

// 좌측: 호스트 안내 패널 (브랜드 + 셀링포인트)
const InfoPanel = styled.aside`
  flex: 1.2;
  background: linear-gradient(135deg, #4a5d3f 0%, #768966 100%);
  color: #fff;
  padding: 60px 56px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* 화면 좁을 때 패널 숨기고 폼만 표시 */
  @media (max-width: 900px) {
    display: none;
  }
`;

const InfoTop = styled.div``;

const Brand = styled.div`
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.3px;
  margin-bottom: 4px;
`;

const BrandSub = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const Pitch = styled.div`
  margin-top: 80px;
`;

const PitchTitle = styled.h2`
  font-size: 30px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 16px;
`;

const PitchDesc = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.7;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 36px 0 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.5;
`;

const FeatureIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
`;

const InfoBottom = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.6;
`;

// 우측: 로그인/회원가입 폼 영역
const FormPanel = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  box-sizing: border-box;
`;

// ─── 컴포넌트 ──────────────────────────────────────────────
function HostAuthLayout() {
  return (
    <Wrap>
      <InfoPanel>
        <InfoTop>
          <Brand>Sloway</Brand>
          <BrandSub>FOR HOSTS</BrandSub>

          <Pitch>
            <PitchTitle>
              내 공간에 가치를
              <br />
              더하는 가장 쉬운 방법
            </PitchTitle>
            <PitchDesc>
              숙소부터 코워킹오피스, 워크앤스테이까지
              <br />
              Sloway 호스트가 되어 새로운 수익을 만들어보세요
            </PitchDesc>

            <FeatureList>
              <FeatureItem>
                <FeatureIcon>📊</FeatureIcon>
                실시간 예약 현황과 매출 통계 대시보드 제공
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>💰</FeatureIcon>월 단위 자동 정산, 투명한 수수료
                정책
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>🤝</FeatureIcon>
                전담 운영팀과 호스트 커뮤니티 지원
              </FeatureItem>
            </FeatureList>
          </Pitch>
        </InfoTop>

        <InfoBottom>
          © 2026 Sloway. 사업자정보 등 자세한 내용은 공식 사이트를 참고해주세요.
        </InfoBottom>
      </InfoPanel>

      <FormPanel>
        <Outlet />
      </FormPanel>
    </Wrap>
  );
}

export default HostAuthLayout;
