import { Component } from 'react';
import styled from 'styled-components';

// 렌더 도중 발생한 예외를 잡아 전체 흰 화면(트리 언마운트) 대신 복구 가능한 화면을 보여준다.
// 스타일은 테마/CSS변수에 의존하지 않게 hex 로만 — 테마 쪽이 터져도 폴백은 떠야 하므로.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // 어느 컴포넌트가 던졌는지 추적용 로그 (componentStack 에 렌더 경로가 찍힘)
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Wrap>
        <Emoji>😵</Emoji>
        <Title>화면을 표시하는 중 문제가 생겼어요</Title>
        <Desc>잠시 후 다시 시도하거나 홈으로 이동해주세요.</Desc>
        {import.meta.env.DEV && this.state.error && (
          <ErrBox>{String(this.state.error?.message ?? this.state.error)}</ErrBox>
        )}
        <Actions>
          <Btn onClick={this.handleReset}>다시 시도</Btn>
          <Btn $primary onClick={() => (window.location.href = '/')}>
            홈으로
          </Btn>
        </Actions>
      </Wrap>
    );
  }
}

export default ErrorBoundary;

const Wrap = styled.div`
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 24px;
  text-align: center;
`;
const Emoji = styled.div`
  font-size: 44px;
`;
const Title = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: #1a1a1a;
`;
const Desc = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #666;
`;
const ErrBox = styled.pre`
  max-width: 560px;
  margin: 8px 0 0;
  padding: 12px 14px;
  background: #fff4f4;
  border: 1px solid #f3c2c2;
  border-radius: 8px;
  color: #b02a2a;
  font-size: 0.78rem;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: left;
`;
const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;
const Btn = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${({ $primary }) => ($primary ? '#0064ff' : '#d0d0d0')};
  background: ${({ $primary }) => ($primary ? '#0064ff' : '#fff')};
  color: ${({ $primary }) => ($primary ? '#fff' : '#333')};
`;
