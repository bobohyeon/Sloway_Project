import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

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
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error || !token) {
      navigate('/login');
      return;
    }

    // TODO: AccessToken 저장 + 유저 정보 조회 + Recoil 상태 저장
    localStorage.setItem('accessToken', token);
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
