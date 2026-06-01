import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { login } from '../../store/authSlice';

const spin = keyframes`to { transform: rotate(360deg); }`;

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f4efe6;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #a8b89f;
  border-top-color: transparent;
  border-radius: 50%;
  margin-bottom: 16px;
  animation: ${spin} 0.8s linear infinite;
`;

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      alert('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
      navigate('/login');
      return;
    }

    // 백엔드가 보낸 토큰을 Redux login 액션으로 처리 (localStorage 저장 + user 파싱)
    dispatch(login(token));
    navigate('/');
  }, []);

  return (
    <Wrap>
      <Spinner />
      <p style={{ fontSize: 14, color: '#9a9280' }}>로그인 처리 중...</p>
    </Wrap>
  );
}

export default OAuthCallbackPage;
