import api from '../../../app/api/axiosApi';

// ─── USER ─────────────────────────────────────────────────────────────────────

export const userCreateOrGetRoom = (rsvnNo) =>
  api.post('/user/chat/rooms', { rsvnNo }).then((r) => r.data);

export const userCreateOrGetRoomByPlace = (entityNo, placeType) =>
  api.post('/user/chat/rooms/by-place', { entityNo, placeType }).then((r) => r.data);

export const getUserUnreadCount = () =>
  api.get('/user/chat/unread-count').then((r) => r.data);

export const getUserChatRooms = () =>
  api.get('/user/chat/rooms').then((r) => r.data);

export const getUserChatMessages = (roomId) =>
  api.get(`/user/chat/rooms/${roomId}/messages`).then((r) => r.data);

export const markUserChatRead = (roomId) =>
  api.patch(`/user/chat/rooms/${roomId}/read`);

export const leaveUserChatRoom = (roomId) =>
  api.delete(`/user/chat/rooms/${roomId}`);

// ─── HOST ─────────────────────────────────────────────────────────────────────

export const hostCreateOrGetRoom = (rsvnNo) =>
  api.post('/host/chat/rooms', { rsvnNo }).then((r) => r.data);

export const getHostUnreadCount = () =>
  api.get('/host/chat/unread-count').then((r) => r.data);

export const getHostChatRooms = () =>
  api.get('/host/chat/rooms').then((r) => r.data);

export const getHostChatMessages = (roomId) =>
  api.get(`/host/chat/rooms/${roomId}/messages`).then((r) => r.data);

export const markHostChatRead = (roomId) =>
  api.patch(`/host/chat/rooms/${roomId}/read`);

export const leaveHostChatRoom = (roomId) =>
  api.delete(`/host/chat/rooms/${roomId}`);
