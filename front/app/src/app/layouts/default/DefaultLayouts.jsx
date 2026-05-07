import React from 'react';
import styled from 'styled-components';
import Header from './../header/Header';
import Nav from './../nav/Nav';
import Footer from './../footer/Footer';
import { Outlet } from 'react-router-dom';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const HeaderArea = styled.header`
  height: 70px;
  background-color: #f4efe6;
  color: #333;
  flex-shrink: 0;
`;

const BodyArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const NavArea = styled.nav`
  width: 250px;
  background-color: #a8b89f;
  color: #fff;
  flex-shrink: 0;
  height: 85.3vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
`;

const MainArea = styled.main`
  flex: 1;
  height: 85.3vh;

  background-color: #f4efe6;
  color: #333;
`;

const FooterArea = styled.footer`
  height: 70px;
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
