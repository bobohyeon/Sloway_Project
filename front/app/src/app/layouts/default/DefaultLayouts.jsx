import React from 'react';
import styled from 'styled-components';
import Header from './../header/Header';
import Nav from './../nav/Nav';
import Footer from './../footer/Footer';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
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
  overflow: hidden;
`;

const NavArea = styled.nav`
  width: 250px;
  background-color: #a8b89f;
  color: #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

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
  align-items: center; /* ✅ 추가: 자식 페이지를 가로 가운데 정렬 */

  overflow: hidden;

  & > * {
    flex: 1;
    width: 100%; /* ✅ 추가: align-items:center로 줄어들지 않게 보장 */
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
