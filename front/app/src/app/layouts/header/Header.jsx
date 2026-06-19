import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useState } from 'react';
import NotificationList from '../../../features/notification/components/NotificationList';
import { useNotification } from './../../../features/notification/hooks/useNotification';

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

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 30px;
  border-bottom: 1px solid #e0d8c8;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;

  &,
  &:link,
  &:visited,
  &:hover,
  &:active {
    text-decoration: none;
  }
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
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const RightMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconButton = styled.button`
  position: relative;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #2d3b2e;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: #e74c3c;
  border-radius: 50%;
`;

// 헤더 우측 프로필 = 원형 아바타 버튼 하나.
// 긴 이름을 그대로 넣으면 깨지므로, 이름 텍스트 대신 첫 글자(또는 사진)만 노출한다.
const AvatarButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #d0c8b8;
  background-color: #a8b89f;
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
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  &:hover {
    border-color: #2d6a4f;
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
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
  &:hover {
    background: #2d6a4f;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 320px;
  max-height: 400px;
  background: white;
  border: 1px solid #d0c8b8;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
`;

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, myPagePath, handleLogout } = useAuth();
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isAvatarError, setIsAvatarError] = useState(false);
  const { notifications, handleRowClick, handleDelete } = useNotification(
    user?.role
  );
  const hasNotifications =
    Array.isArray(notifications) && notifications.length > 0;

  // redux user.imgUrl(로그인·프로필수정 시 채워짐)이 있고 로딩 실패가 아닐 때만 사진 노출.
  // 없으면 이름 첫 글자로 폴백.
  const showAvatarImage = Boolean(user?.imgUrl) && !isAvatarError;

  return (
    <HeaderWrapper>
      <Logo to="/">
        <LogoImage
          src="/Sloway_logo.png"
          alt="Sloway"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <LogoText>Sloway</LogoText>
      </Logo>

      <RightMenu>
        {isAuthenticated ? (
          <>
            <div style={{ position: 'relative' }}>
              <IconButton
                title="알림"
                onClick={() => setIsNotiOpen(!isNotiOpen)}
              >
                <FaBell size={18} />
                {hasNotifications && <Badge />}
              </IconButton>

              {isNotiOpen && (
                <DropdownContainer>
                  <NotificationList
                    notifications={notifications}
                    handleRowClick={handleRowClick}
                    handleDelete={handleDelete}
                  />
                </DropdownContainer>
              )}
            </div>

            <AvatarButton
              onClick={() => navigate(myPagePath)}
              title="마이페이지로 이동"
            >
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
          </>
        ) : (
          <LoginBtn onClick={() => navigate('/login')}>로그인</LoginBtn>
        )}
      </RightMenu>
    </HeaderWrapper>
  );
}

export default Header;
