import React from 'react';

function ThumbsUpSolidIcon({ height = "16", width = "16", fill = '#edeef0' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={`${height}px`}
      width={`${width}px`}
      viewBox="0 0 24 24"
      fill={fill}
    >
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.78 0 1.49-.45 1.83-1.14l3.02-6.03c.11-.23.15-.48.15-.73V10z" />
    </svg>
  );
}

export default ThumbsUpSolidIcon;
