import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBell } from 'react-icons/fa';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { useState } from 'react';
import NotificationList from '../../../features/notification/components/NotificationList';
import { useNotification } from './../../../features/notification/hooks/useNotification';

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

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid #d0c8b8;
  border-radius: 20px;
  padding: 5px 14px 5px 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const Avatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #a8b89f;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: bold;
`;

const UserName = styled.span`
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
  const { notifications, handleRowClick } = useNotification(user?.role);
  const hasNotifications =
    Array.isArray(notifications) && notifications.length > 0;

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
                  />
                </DropdownContainer>
              )}
            </div>

            <UserButton
              onClick={() => navigate(myPagePath)}
              title="마이페이지로 이동"
            >
              <Avatar>
                {(user?.name ?? user?.email)?.[0]?.toUpperCase() ?? 'U'}
              </Avatar>
              <UserName>{user?.name ?? user?.email}</UserName>
            </UserButton>

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
