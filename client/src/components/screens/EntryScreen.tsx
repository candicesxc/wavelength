import React, { useState } from 'react';
import { socket } from '../../lib/socket';
import { Button } from '../ui/Button';

type Mode = 'choose' | 'join';

export const EntryScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<Mode>('choose');
  const [loading, setLoading] = useState(false);

  const handleConnect = (action: () => void) => {
    if (!username.trim()) return;
    if (!socket.connected) {
      socket.connect();
      socket.once('connect', action);
    } else {
      action();
    }
    setLoading(true);
  };

  const handleCreate = () => {
    handleConnect(() => {
      socket.emit('room:create', { username: username.trim() });
    });
  };

  const handleJoin = () => {
    if (!roomCode.trim()) return;
    handleConnect(() => {
      socket.emit('room:join', { roomCode: roomCode.trim().toUpperCase(), username: username.trim() });
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">
          🌊 Wavelength
        </h1>
        <p className="text-slate-400 text-lg">The mind-reading party game</p>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-6">
        {/* Username input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Your Name
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && username.trim()) setMode('choose');
            }}
            placeholder="Enter your name..."
            maxLength={20}
            className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors text-lg"
            autoFocus
          />
        </div>

        {mode === 'choose' && (
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!username.trim() || loading}
              onClick={handleCreate}
            >
              {loading ? '⏳ Connecting...' : '🏠 Create Room'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              disabled={!username.trim()}
              onClick={() => setMode('join')}
            >
              🔑 Join Room
            </Button>
          </div>
        )}

        {mode === 'join' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Room Code
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && roomCode.trim().length === 4) handleJoin();
                }}
                placeholder="ABCD"
                maxLength={4}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors text-2xl font-mono tracking-[0.4em] uppercase text-center"
                autoFocus
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!username.trim() || roomCode.trim().length < 4 || loading}
              onClick={handleJoin}
            >
              {loading ? '⏳ Joining...' : '→ Join Room'}
            </Button>
            <Button variant="ghost" size="md" className="w-full" onClick={() => setMode('choose')}>
              ← Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
