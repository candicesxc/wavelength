import React, { useState } from 'react';
import { socket } from '../../lib/socket';
import { Button } from '../ui/Button';

type Mode = 'choose' | 'join';

const inputStyle: React.CSSProperties = {
  background: '#2D2F50',
  border: '2px solid #414364',
  borderRadius: 12,
  padding: '12px 16px',
  color: '#F1ECC2',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  fontSize: 16,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#80AAB2',
  fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
  marginBottom: 6,
  display: 'block',
};

export const EntryScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<Mode>('choose');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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

  const handleCreate = () => handleConnect(() => {
    socket.emit('room:create', { username: username.trim() });
  });

  const handleJoin = () => {
    if (!roomCode.trim()) return;
    handleConnect(() => {
      socket.emit('room:join', { roomCode: roomCode.trim().toUpperCase(), username: username.trim() });
    });
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: '#0F1132' }}
    >
      {/* Game board panel */}
      <div
        style={{
          background: '#3F6F8E',
          border: '3px solid #174766',
          borderRadius: 20,
          padding: '40px 32px',
          width: '100%',
          maxWidth: 380,
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="font-extrabold tracking-tight"
            style={{
              fontSize: 42,
              color: '#F1ECC2',
              fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
              textShadow: '0 3px 12px rgba(0,0,0,0.5)',
              lineHeight: 1.1,
            }}
          >
            Wavelength
          </h1>
          <p style={{ color: '#80AAB2', fontSize: 14, marginTop: 6, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}>
            The mind-reading party game
          </p>
          {/* Decorative divider */}
          <div style={{ width: 60, height: 3, background: '#E0AD42', borderRadius: 2, margin: '12px auto 0' }} />
        </div>

        {/* Username field */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Your Name</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && username.trim()) setMode('choose'); }}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
            placeholder="Enter your name..."
            maxLength={20}
            style={{
              ...inputStyle,
              borderColor: focusedField === 'name' ? '#E0AD42' : '#414364',
            }}
            autoFocus
          />
        </div>

        {mode === 'choose' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={labelStyle}>Room Code</label>
              <input
                type="text"
                value={roomCode}
                onChange={e => setRoomCode(e.target.value.toUpperCase().slice(0, 4))}
                onKeyDown={e => { if (e.key === 'Enter' && roomCode.trim().length === 4) handleJoin(); }}
                onFocus={() => setFocusedField('code')}
                onBlur={() => setFocusedField(null)}
                placeholder="ABCD"
                maxLength={4}
                style={{
                  ...inputStyle,
                  fontSize: 28,
                  letterSpacing: '0.4em',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  borderColor: focusedField === 'code' ? '#E0AD42' : '#414364',
                }}
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
