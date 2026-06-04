import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../auth/hooks/useAuth';
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
const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserChip = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #d0c8b8;
  border-radius: 20px;
  padding: 5px 14px 5px 6px; /* ← Header의 UserButton과 동일하게 */
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.6);
  }
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #a8b89f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
`;

const UserEmail = styled.span`
  font-size: 13px;
  color: #333;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LogoutBtn = styled.button`
  padding: 7px 16px;
  border-radius: 8px;
  background: none;
  border: 1px solid #d0c8b8;
  color: #555;
  font-size: 13px;
  font-weight: 600;
  font-family: 'Noto Sans KR', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  &:hover {
    border-color: #2d6a4f;
    color: #2d6a4f;
  }
`;

// role → 마이페이지 진입 경로 (한 곳에서 관리: 경로 바뀌면 여기만 고침)
const MYPAGE_PATH = {
  U: '/user/mypage',
  H: '/host/profile',
  A: '/admin/dashboard',
};

function MainHeader({ activePage = 'home' }) {
  const navigate = useNavigate();
  const { isAuthenticated, user, myPagePath, handleLogout } = useAuth();

  // role이 예상 밖(또는 null)이면 일반회원 마이페이지로 폴백
  const goMyPage = () => navigate(myPagePath);

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
        <NavLink onClick={() => navigate('/notice')}>공지사항</NavLink>
        <NavLink onClick={() => navigate('/faq')}>자주 묻는 질문</NavLink>

        {isAuthenticated ? (
          <UserArea>
            <UserChip onClick={goMyPage} title="마이페이지로 이동">
              <Avatar>
                {(user?.name ?? user?.email).toUpperCase() ?? 'U'}
              </Avatar>
              <UserEmail>{user?.name ?? user?.email}</UserEmail>
            </UserChip>
            <LogoutBtn onClick={() => handleLogout('/')}>로그아웃</LogoutBtn>
          </UserArea>
        ) : (
          <LoginBtn onClick={() => navigate('/login')}>로그인 / 가입</LoginBtn>
        )}
      </Nav>
    </HeaderWrapper>
  );
}

export default MainHeader;
