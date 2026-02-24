import { io, Socket } from 'socket.io-client';

const URL = (import.meta.env.VITE_SERVER_URL as string | undefined) ?? 'http://localhost:3001';

// Singleton socket — does NOT auto-connect; call socket.connect() explicitly
export const socket: Socket = io(URL, {
  autoConnect: false,
  transports: ['websocket', 'polling'],
});
