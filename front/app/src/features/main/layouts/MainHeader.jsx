import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrap = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: #faf7f2;
  border-bottom: 0.5px solid #e0d8cc;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const LogoImg = styled.img`
  height: 32px;
  width: auto;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-family: 'Malgun Gothic', sans-serif;
  font-size: 22px;
  font-weight: 800;
  background: linear-gradient(135deg, #2d3b2e 0%, #6b8a6e 100%);
  background-clip: text;
  color: transparent;
  letter-spacing: -0.5px;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const NavLink = styled.span`
  font-size: 13px;
  color: #555;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
  &:hover {
    color: #2d6a4f;
  }
  ${({ $active }) =>
    $active &&
    `
    color: #2D6A4F;
    font-weight: 600;
    border-bottom: 1.5px solid #2D6A4F;
    padding-bottom: 1px;
  `}
`;

const LoginBtn = styled.button`
  padding: 8px 20px;
  border-radius: 8px;
  background: #1a3a2a;
  color: #fff;
  border: none;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  &:hover {
    background: #2d6a4f;
  }
`;

function MainHeader() {
  const navigate = useNavigate();

  return (
    <HeaderWrap>
      <Logo onClick={() => navigate('/')}>
        <LogoImg
          src="/Sloway_logo.png"
          alt="Sloway 로고"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <LogoText>Sloway</LogoText>
      </Logo>

      <Nav>
        <NavLink $active onClick={() => navigate('/spaces/search')}>
          워케이션 찾기
        </NavLink>
        <NavLink onClick={() => navigate('/notices')}>공지사항</NavLink>
        <NavLink onClick={() => navigate('/faqs')}>자주 묻는 질문</NavLink>
        <LoginBtn onClick={() => navigate('/login')}>로그인 / 가입</LoginBtn>
      </Nav>
    </HeaderWrap>
  );
}

export default MainHeader;
