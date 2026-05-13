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

// 좌측: 일반회원 안내 패널 (브랜드 + 셀링포인트)
const InfoPanel = styled.aside`
  flex: 1.2;
  background: linear-gradient(135deg, #768966 0%, #a8b89f 100%);
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
function AuthLayout() {
  return (
    <Wrap>
      <InfoPanel>
        <InfoTop>
          <Brand>Sloway</Brand>
          <BrandSub>FOR YOU</BrandSub>

          <Pitch>
            <PitchTitle>
              느린 길 위에서
              <br />
              가장 나다운 휴식을
            </PitchTitle>
            <PitchDesc>
              숙소부터 코워킹오피스, 워크앤스테이까지
              <br />
              나에게 맞는 공간을 Sloway에서 찾아보세요
            </PitchDesc>

            <FeatureList>
              <FeatureItem>
                <FeatureIcon>📍</FeatureIcon>
                전국 검증된 워케이션 공간을 한 번에
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>🎁</FeatureIcon>
                회원 전용 쿠폰과 포인트 적립 혜택
              </FeatureItem>
              <FeatureItem>
                <FeatureIcon>❤️</FeatureIcon>
                찜·예약·리뷰를 마이페이지에서 한 번에
              </FeatureItem>
            </FeatureList>
          </Pitch>
        </InfoTop>

        <InfoBottom>
          © 2026 Sloway. 더 자세한 내용은 공식 사이트를 참고해주세요.
        </InfoBottom>
      </InfoPanel>

      <FormPanel>
        <Outlet />
      </FormPanel>
    </Wrap>
  );
}

export default AuthLayout;
