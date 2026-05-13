import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainHeader from '../../../main/layouts/MainHeader';

const Wrapper = styled.div`
  background: #fff;
  min-height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
`;

const BackBar = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  border-bottom: 1px solid #f2ede4;
`;

const BackBtn = styled.button`
  font-size: 13px;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  &:hover {
    color: #1a1a1a;
  }
`;

const ImageSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 0;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 80px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 40px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const MainSection = styled.main`
  min-width: 0;
`;

const RsvnSection = styled.aside`
  position: sticky;
  top: 24px;
  @media (max-width: 960px) {
    position: static;
  }
`;

function DetailLayout({ imageBox, mainBox, rsvnBox }) {
  const navigate = useNavigate();

  return (
    <Wrapper>
      {/* 1. 헤더 */}
      <MainHeader activePage="search" />

      {/* 2. 뒤로가기 */}
      <BackBar>
        <BackBtn onClick={() => navigate(-1)}>← 이전으로</BackBtn>
      </BackBar>

      {/* 3. 이미지 */}
      <ImageSection>{imageBox}</ImageSection>

      {/* 4. 본문 */}
      <ContentWrapper>
        <MainSection>{mainBox}</MainSection>
        <RsvnSection>{rsvnBox}</RsvnSection>
      </ContentWrapper>
    </Wrapper>
  );
}

export default DetailLayout;
