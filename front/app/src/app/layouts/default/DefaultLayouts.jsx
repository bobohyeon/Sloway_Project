import React from 'react';
import styled from 'styled-components';
import Header from './../header/Header';
import Nav from './../nav/Nav';
import Footer from './../footer/Footer';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* min-height 대신 height로 고정 */
  width: 100%;
  overflow: hidden; /* 전체 페이지 바깥 스크롤 방지 */
`;

const HeaderArea = styled.header`
  height: 60px;
  background-color: #f4efe6;
  color: #333;
  flex-shrink: 0;
`;

const BodyArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  overflow: hidden; /* 중요: 바디 영역 안에서만 스크롤이 일어나도록 제한 */
`;

const NavArea = styled.nav`
  width: 250px;
  background-color: #a8b89f;
  color: #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 네비게이션 자체 스크롤이 필요한 경우 */

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
`;

const MainArea = styled.main`
  flex: 1;
  background-color: #f4efe6;
  color: #333;
  position: relative;
  display: flex;
  flex-direction: column;

  overflow: hidden;

  & > * {
    flex: 1;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      background: #d8d3cb;
      border-radius: 10px;
    }
  }
`;

const FooterArea = styled.footer`
  height: 40px;
  background-color: #f4efe6;
  color: #333;
  flex-shrink: 0;
`;

function DefaultLayouts() {
  return (
    <LayoutContainer>
      <HeaderArea>
        <Header />
      </HeaderArea>

      <BodyArea>
        <NavArea>
          <Nav />
        </NavArea>
        <MainArea>
          <Outlet />
        </MainArea>
      </BodyArea>

      <FooterArea>
        <Footer />
      </FooterArea>
    </LayoutContainer>
  );
}

export default DefaultLayouts;
