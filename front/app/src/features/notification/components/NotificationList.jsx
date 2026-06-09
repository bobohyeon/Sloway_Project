import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../auth/hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

const ListContainer = styled.div`
  padding: 16px;
  h3 {
    font-size: 15px;
    margin-bottom: 12px;
    color: #333;
  }
`;

const NotificationItem = styled.li`
  list-style: none;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  &:last-child {
    border-bottom: none;
  }
  strong {
    display: block;
    color: #2d3b2e;
    margin-bottom: 4px;
  }
  p {
    color: #666;
    margin: 0;
  }
  small {
    color: #999;
  }
`;

const NotificationList = () => {
  const { user } = useAuth();
  const notifications = useNotification(user?.role);

  if (!Array.isArray(notifications)) return null;

  return (
    <ListContainer>
      <h3>실시간 알림</h3>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((n, index) => (
            <NotificationItem key={index}>
              <strong>{n.title}</strong>
              <p>{n.description}</p>
              <small>{n.createdAt}</small>
            </NotificationItem>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#aaa' }}>
            새로운 알림이 없습니다.
          </p>
        )}
      </ul>
    </ListContainer>
  );
};

export default NotificationList;
