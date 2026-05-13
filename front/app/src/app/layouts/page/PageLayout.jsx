import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

/**
 * PageLayout - 모든 페이지의 공통 레이아웃
 *
 * @example
 * // 기본 사용
 * <PageLayout title="결제 내역" description="모든 결제 내역">
 *   <Content />
 * </PageLayout>
 *
 * @example
 * // 뒤로가기 + 우측 액션
 * <PageLayout
 *   title="결제 상세"
 *   backTo="/user/payment"
 *   backLabel="결제 내역"
 *   actions={<Button>내보내기</Button>}
 *   maxWidth={800}
 * >
 *   <Content />
 * </PageLayout>
 */
function PageLayout({
  title,
  description,
  backTo,
  backLabel = '이전',
  actions,
  maxWidth = 1400,
  children,
}) {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <Container $maxWidth={maxWidth}>
        {(title || actions) && (
          <Header>
            <HeaderLeft>
              {title && <Title>{title}</Title>}
              {description && <Description>{description}</Description>}
            </HeaderLeft>
            {actions && <HeaderRight>{actions}</HeaderRight>}
          </Header>
        )}

        {backTo && (
          <BackButton onClick={() => navigate(backTo)}>
            ← {backLabel}
          </BackButton>
        )}
        {children}
      </Container>
    </PageWrapper>
  );
}

export default PageLayout;

const PageWrapper = styled.div`
  background-color: #f4efe6;
  min-height: 100%;
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: ${(p) => p.$maxWidth}px;
  display: flex;
  flex-direction: column;
  font-family: 'Noto Sans KR', sans-serif;
  animation: fadeInUp 480ms ease-out both;

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const BackButton = styled.button`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  color: #666;
  background: transparent;
  border: none;
  cursor: pointer;
  margin-bottom: 16px;
  padding: 4px 0;
  align-self: flex-start;
  transition: color 200ms ease;

  &:hover {
    color: #1a1a1a;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const HeaderLeft = styled.div`
  flex: 1;
  min-width: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
`;

const Title = styled.h1`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 28px;
  font-weight: 600;
  color: #333;
  letter-spacing: -0.02em;
  line-height: 1.3;
  margin: 0 0 8px 0;
`;

const Description = styled.p`
  font-family: 'Noto Sans KR', sans-serif;
  font-size: 14px;
  color: #888;
  line-height: 1.5;
  margin: 0;
`;
