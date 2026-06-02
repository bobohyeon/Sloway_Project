import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import { Provider } from 'react-redux';
import store from './app/store/store';
import ErrorBoundary from './app/ErrorBoundary';

// bfcache(뒤로가기 캐시) 복원 시 빈 화면 방지.
// 외부 결제창(카카오/토스)으로 window.location.href 이동 후 뒤로가기로 돌아오면
// React 루트가 비워진 채 복원돼 흰 화면이 되므로, 복원(persisted)일 땐 강제 새로고침.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ErrorBoundary>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ErrorBoundary>
      </ThemeProvider>
    </React.StrictMode>
  </Provider>
);
