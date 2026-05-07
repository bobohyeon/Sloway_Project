import styled from 'styled-components';

const Wrapper = styled.div`
  background: #faf7f2;
  min-height: 100vh;
  font-family: 'Noto Sans KR', sans-serif;
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
  top: 88px;

  @media (max-width: 960px) {
    position: static;
    order: -1;
  }
`;

function DetailLayout({ imageBox, mainBox, rsvnBox }) {
  return (
    <Wrapper>
      <ImageSection>{imageBox}</ImageSection>
      <ContentWrapper>
        <MainSection>{mainBox}</MainSection>
        <RsvnSection>{rsvnBox}</RsvnSection>
      </ContentWrapper>
    </Wrapper>
  );
}

export default DetailLayout;
