import React from 'react';

const SlowyLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <path
      d="M16 4C10 4 6 9 6 14c0 3 1.5 5.5 4 7l-1 5 5-2.5c.6.1 1.3.2 2 .2 6 0 10-4.5 10-9.7C26 9 21.5 4 16 4z"
      fill="#A8B89F"
    />
    <path
      d="M12 13.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5S14.3 15 13.5 15 12 14.3 12 13.5z
         M17 13.5c0-.8.7-1.5 1.5-1.5S20 12.7 20 13.5 19.3 15 18.5 15 17 14.3 17 13.5z"
      fill="#fff"
    />
  </svg>
);

export default SlowyLogo;
