import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 30px;
  border-bottom: 1px solid #e0d8c8;
  background: #faf7f2;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 100%;
  max-height: 50px;
  width: auto;
  object-fit: contain;
  padding: 8px 0;
`;

const LogoText = styled.span`
  font-family: 'Malgun Gothic', sans-serif;
  font-size: 24px;
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
  color: ${({ $active }) => ($active ? '#2D6A4F' : '#555')};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  border-bottom: ${({ $active }) => ($active ? '1.5px solid #2D6A4F' : 'none')};
  padding-bottom: ${({ $active }) => ($active ? '1px' : '0')};
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s;
  &:hover {
    color: #2d6a4f;
  }
`;

const LoginBtn = styled.button`
  padding: 7px 18px;
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

function MainHeader({ activePage = 'home' }) {
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <Logo onClick={() => navigate('/')}>
        <LogoImage
          src="/Sloway_logo.png"
          alt="Sloway 로고"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <LogoText>Sloway</LogoText>
      </Logo>

      <Nav>
        <NavLink
          $active={activePage === 'search'}
          onClick={() => navigate('/spaces/search')}
        >
          워케이션 찾기
        </NavLink>
        <NavLink onClick={() => navigate('/notices')}>공지사항</NavLink>
        <NavLink onClick={() => navigate('/faqs')}>자주 묻는 질문</NavLink>
        <LoginBtn onClick={() => navigate('/login')}>로그인 / 가입</LoginBtn>
      </Nav>
    </HeaderWrapper>
  );
}

export default MainHeader;
