import React, { useState } from 'react';

interface RoomCodeProps {
  code: string;
}

export const RoomCode: React.FC<RoomCodeProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#80AAB2',
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
        }}
      >
        Room Code
      </span>
      <button
        onClick={handleCopy}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#2D2F50',
          border: `2px solid ${copied ? '#E0AD42' : '#414364'}`,
          borderRadius: 16,
          padding: '10px 24px',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          outline: 'none',
        }}
        title="Click to copy"
      >
        <span
          style={{
            fontSize: 32,
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            fontWeight: 900,
            letterSpacing: '0.3em',
            color: '#E0AD42',
          }}
        >
          {code}
        </span>
        <span style={{ fontSize: 13, color: copied ? '#E0AD42' : '#80AAB2', transition: 'color 0.2s' }}>
          {copied ? '✓ Copied!' : '📋'}
        </span>
      </button>
      <span style={{ fontSize: 11, color: '#4A6E8A', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
        Share this code with friends
      </span>
    </div>
  );
};
