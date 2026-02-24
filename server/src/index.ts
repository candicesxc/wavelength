import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './game/RoomManager';
import { registerHandlers } from './socket/handlers';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? 'http://localhost:5173';

const app = express();
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

// Health check for Render
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

const roomManager = new RoomManager();

io.on('connection', (socket) => {
  console.log(`[+] Socket connected: ${socket.id}`);
  registerHandlers(io, socket, roomManager);
  socket.on('disconnect', () => {
    console.log(`[-] Socket disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🌊 Wavelength server running on port ${PORT}`);
  console.log(`   Allowed origin: ${ALLOWED_ORIGIN}`);
});
