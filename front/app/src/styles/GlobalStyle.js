import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --sage: ${({ theme }) => theme.colors.sage};
    --cream: ${({ theme }) => theme.colors.cream};

    --white: ${({ theme }) => theme.colors.white};
    --black: ${({ theme }) => theme.colors.black};

    --gray-100: ${({ theme }) => theme.colors.gray100};
    --gray-200: ${({ theme }) => theme.colors.gray200};
    --gray-400: ${({ theme }) => theme.colors.gray400};
    --gray-600: ${({ theme }) => theme.colors.gray600};
    --gray-800: ${({ theme }) => theme.colors.gray800};

    --font-display: ${({ theme }) => theme.fonts.display};
    --font-body: ${({ theme }) => theme.fonts.body};
    --font-mono: ${({ theme }) => theme.fonts.mono};

    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;

    --radius-sm: 6px;
    --radius-md: 10px;
    --radius-lg: 16px;
    --radius-full: 999px;
  }

  html, body {
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.5;
    color: var(--gray-800);
    background: var(--cream);
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    background: none;
  }

  a { color: inherit; text-decoration: none; }
  ul, ol { list-style: none; }
  input, textarea, select { font-family: inherit; font-size: inherit; }

  *:focus-visible {
    outline: 2px solid var(--sage);
    outline-offset: 2px;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
