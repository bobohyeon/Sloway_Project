import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api from './../../../app/api/axiosApi';

export const useNotification = (role) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!role) return;

    const endpoint =
      role === 'HOST'
        ? '/host/notifications/new/list'
        : '/notifications/new/list';

    const fetchInitialNotifications = async () => {
      try {
        const response = await api.get(endpoint);
        setNotifications(response.data);
      } catch (error) {
        console.error('알림 초기 데이터 로드 실패', error);
      }
    };

    fetchInitialNotifications();

    const socket = new SockJS('http://127.0.0.1:8080/ws');
    const stompClient = Stomp.over(socket);

    const token = localStorage.getItem('accessToken');
    stompClient.connect({ Authorization: token }, () => {
      stompClient.subscribe('/sub/notifications', (message) => {
        const newNotification = JSON.parse(message.body);
        setNotifications((prev) => [newNotification, ...prev]);
        alert(`새 알림: ${newNotification.title}`);
      });
    });

    return () => {
      if (stompClient.connected) stompClient.disconnect();
    };
  }, [role]);

  return notifications;
};
