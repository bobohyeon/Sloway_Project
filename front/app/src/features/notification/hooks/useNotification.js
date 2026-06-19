import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api from './../../../app/api/axiosApi';
import { useNavigate } from 'react-router-dom';

export const useNotification = (role) => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [roleMap, setRoleMap] = useState('');

  useEffect(() => {
    if (!role) return;
    if (role === 'H') {
      setRoleMap('host');
    } else if (role === 'U') {
      setRoleMap('user');
    }

    const endpoint =
      role === 'HOST'
        ? '/host/notifications/new/list'
        : '/notifications/new/list';

    const fetchInitialNotifications = async () => {
      try {
        const response = await api.get(endpoint);
        console.log(response);

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

  function handleRowClick(item) {
    if (item.type === 'notice') {
      navigate(`/${item.type}/${item.targetId}`);
    } else {
      navigate(`/${roleMap}/${item.type}/${item.targetId}`);
    }
  }

  async function handleDelete(e, notificationNo) {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    try {
      await api.get(`/notifications/delete/${notificationNo}`);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationNo));
      console.log('알림 삭제 성공');
    } catch (error) {
      console.error('알림 삭제 실패', error);
    }
  }

  return { notifications, handleRowClick, handleDelete };
};
