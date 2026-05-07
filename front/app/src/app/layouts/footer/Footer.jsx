import React from 'react';
import styled from 'styled-components';

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 99%;
  padding: 0 30px;
  border-top: 1px solid #e0d8c8;
  color: #888;
  font-size: 12px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const FooterLink = styled.a`
  color: #555;
  cursor: pointer;
  transition: color 0.2s;

  &,
  &:link,
  &:visited,
  &:hover,
  &:active {
    text-decoration: none;
    color: #555;
  }

  &:hover {
    color: #2d3b2e;
  }
`;

const Divider = styled.span`
  color: #ccc;
`;

function Footer() {
  return (
    <FooterWrapper>
      <Left>
        <span>© 2025 Sloway. All rights reserved.</span>
      </Left>
      <Right>
        <FooterLink href="#">이용약관</FooterLink>
        <Divider>|</Divider>
        <FooterLink href="#">개인정보처리방침</FooterLink>
        <Divider>|</Divider>
        <FooterLink href="#">고객센터</FooterLink>
        <Divider>|</Divider>
        <span>v1.0.0</span>
      </Right>
    </FooterWrapper>
  );
}

export default Footer;
