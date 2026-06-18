import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../auth/hooks/useAuth';

/**
 * 아바타에 띄울 이름 첫 글자를 뽑는다.
 * Array.from을 쓰는 이유: 이모지·일부 문자는 서로게이트 페어(2칸)라
 * source[0]로 자르면 깨질 수 있어 코드포인트 단위로 자른다.
 */
function getInitial(user) {
  const source = user?.name ?? user?.email ?? '';
  const first = Array.from(source)[0] ?? 'U';
  return first.toUpperCase();
}
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

// 프로필 = 원형 아바타 버튼 하나. (Header.jsx의 AvatarButton과 동일 패턴)
const AvatarButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d0c8b8;
  background: #a8b89f;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  overflow: hidden; /* 사진이 원 밖으로 삐져나오지 않게 */
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 0 0 2px rgba(45, 106, 79, 0.3);
  }
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* 비율 유지하며 원을 꽉 채움 */
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
  const [isAvatarError, setIsAvatarError] = useState(false);

  // role이 예상 밖(또는 null)이면 일반회원 마이페이지로 폴백
  const goMyPage = () => navigate(myPagePath);

  // 프로필 사진 필드가 채워졌고 로딩 실패가 아닐 때만 사진 노출 (없으면 글자)
  const showAvatarImage = Boolean(user?.imgUrl) && !isAvatarError;

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
            <AvatarButton onClick={goMyPage} title="마이페이지로 이동">
              {showAvatarImage ? (
                <AvatarImage
                  src={user.imgUrl}
                  alt="프로필"
                  onError={() => setIsAvatarError(true)} // 사진 깨지면 글자로 폴백
                />
              ) : (
                getInitial(user)
              )}
            </AvatarButton>
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
