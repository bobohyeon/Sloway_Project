import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminNav from './AdminNav';
import HostNav from './HostNav';
import UserNav from './UserNav';
import { useAuth } from '../../../features/auth/hooks/useAuth';

function Nav() {
  const location = useLocation();
  const { user, role } = useAuth();
  const path = location.pathname;

  console.log(user);
  if (path.startsWith('/admin')) return <AdminNav />;
  if (path.startsWith('/host')) return <HostNav />;
  if (path.startsWith('/user')) return <UserNav />;

  if (user?.role === 'H') return <HostNav />;
  if (user?.role === 'U') return <UserNav />;

  return <UserNav />;
}

export default Nav;
