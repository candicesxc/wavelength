import React, { useState } from 'react';

interface RoomCodeProps {
  code: string;
}

export const RoomCode: React.FC<RoomCodeProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback — just show copied state if clipboard API fails
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-slate-400 uppercase tracking-widest">Room Code</span>
      <button
        onClick={handleCopy}
        className="group flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-2xl px-6 py-3 hover:border-amber-500 transition-all"
        title="Click to copy"
      >
        <span className="text-3xl font-mono font-bold tracking-[0.3em] text-amber-400">
          {code}
        </span>
        <span className="text-slate-500 group-hover:text-amber-400 transition-colors text-sm">
          {copied ? '✓ Copied!' : '📋'}
        </span>
      </button>
      <span className="text-xs text-slate-500">Share this code with friends</span>
    </div>
  );
};
