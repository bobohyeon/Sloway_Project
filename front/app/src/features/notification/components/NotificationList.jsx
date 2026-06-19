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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

const ContentWrapper = styled.div`
  flex: 1;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  padding: 0 0 0 8px;
  margin-left: 8px;
  flex-shrink: 0;

  &:hover {
    color: #e74c3c;
    transition: color 0.2s;
  }
`;

const NotificationList = ({ notifications, handleRowClick, handleDelete }) => {
  if (!Array.isArray(notifications)) return null;

  return (
    <ListContainer>
      <h3>실시간 알림</h3>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((n, index) => (
            <NotificationItem key={index}>
              <ContentWrapper onClick={() => handleRowClick(n)}>
                <strong>{n.title}</strong>
                <p>{n.description}</p>
                <small>{n.timeLabel}</small>
              </ContentWrapper>
              <DeleteButton
                onClick={(e) => handleDelete(e, n.id)}
                title="알림 삭제"
              >
                ✕
              </DeleteButton>
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
