import { Server, Socket } from 'socket.io';
import { RoomManager } from '../game/RoomManager';
import { SpectrumCard } from '../types/game';

export function registerHandlers(io: Server, socket: Socket, roomManager: RoomManager): void {
  function emitStateUpdate(roomCode: string): void {
    const room = roomManager.getRoom(roomCode);
    if (!room) return;
    io.to(roomCode).emit('game:state_update', room.getPublicState());
  }

  function emitError(message: string): void {
    socket.emit('room:error', { message });
  }

  // ─── Room Creation ───────────────────────────────────────────────────────
  socket.on('room:create', ({ username }: { username: string }) => {
    try {
      if (!username?.trim()) return emitError('Username is required');
      const room = roomManager.createRoom(socket.id, username.trim());
      socket.join(room.roomCode);
      socket.emit('room:created', { roomCode: room.roomCode, state: room.getPublicState() });
    } catch (err: unknown) {
      emitError(err instanceof Error ? err.message : 'Failed to create room');
    }
  });

  // ─── Room Join ───────────────────────────────────────────────────────────
  socket.on('room:join', ({ roomCode, username }: { roomCode: string; username: string }) => {
    try {
      if (!username?.trim()) return emitError('Username is required');
      if (!roomCode?.trim()) return emitError('Room code is required');
      const room = roomManager.joinRoom(roomCode.trim(), socket.id, username.trim());
      socket.join(room.roomCode);
      socket.emit('room:joined', { state: room.getPublicState() });
      // Notify all others in room
      socket.to(room.roomCode).emit('game:state_update', room.getPublicState());
    } catch (err: unknown) {
      emitError(err instanceof Error ? err.message : 'Failed to join room');
    }
  });

  // ─── Team Assignment ────────────────────────────────────────────────────
  socket.on('player:assign_team', ({ team }: { team: 'A' | 'B' }) => {
    try {
      const room = roomManager.getRoomForPlayer(socket.id);
      if (!room) return emitError('Not in a room');
      room.assignTeam(socket.id, team);
      emitStateUpdate(room.roomCode);
    } catch (err: unknown) {
      emitError(err instanceof Error ? err.message : 'Failed to assign team');
    }
  });

  // ─── Game Start ──────────────────────────────────────────────────────────
  socket.on('game:start', ({ customCards = [] }: { customCards?: SpectrumCard[] }) => {
    try {
      const room = roomManager.getRoomForPlayer(socket.id);
      if (!room) return emitError('Not in a room');
      const player = room.getPlayer(socket.id);
      if (!player?.isHost) return emitError('Only the host can start the game');
      if (!room.canStart()) return emitError('Need at least 1 player on each team');
      room.startGame(customCards);
      // Broadcast public state to all
      emitStateUpdate(room.roomCode);
      // Send private target ONLY to the Psychic
      const psychicId = room.getPsychicId();
      const target = room.getPrivateTarget();
      if (psychicId && target !== null) {
        io.to(psychicId).emit('room:psychic_target', { targetPosition: target });
      }
    } catch (err: unknown) {
      emitError(err instanceof Error ? err.message : 'Failed to start game');
    }
  });

  // ─── Submit Clues ────────────────────────────────────────────────────────
  socket.on('round:submit_clues', ({ clue1, clue2 }: { clue1: string; clue2: string }) => {
    try {
      const room = roomManager.getRoomForPlayer(socket.id);
      if (!room) return emitError('Not in a room');
      room.submitClues(socket.id, clue1, clue2);
      emitStateUpdate(room.roomCode);
    } catch (err: unknown) {
      emitError(err instanceof Error ? err.message : 'Failed to submit clues');
    }
  });

  // ─── Update Dial ─────────────────────────────────────────────────────────
  socket.on('round:update_dial', ({ position }: { position: number }) => {
    try {
      const room = roomManager.getRoomForPlayer(socket.id);
      if (!room) return;
      room.updateDial(socket.id, position);
      emitStateUpdate(room.roomCode);
    } catch {
      // Silently ignore dial update errors (throttled)
    }
  });

  // ─── Lock Guess ──────────────────────────────────────────────────────────
  socket.on('round:lock_guess', () => {
    try {
      const room = roomManager.getRoomForPlayer(socket.id);
      if (!room) return emitError('Not in a room');
      room.lockGuess(socket.id);
      emitStateUpdate(room.roomCode);
    } catch (err: unknown) {
      emitError(err instanceof Error ? err.message : 'Failed to lock guess');
    }
  });

  // ─── Left/Right Vote ─────────────────────────────────────────────────────
  socket.on('round:lock_left_right', ({ guess }: { guess: 'left' | 'right' }) => {
    try {
      const room = roomManager.getRoomForPlayer(socket.id);
      if (!room) return emitError('Not in a room');
      room.lockLeftRight(socket.id, guess);
      emitStateUpdate(room.roomCode);
    } catch (err: unknown) {
      emitError(err instanceof Error ? err.message : 'Failed to submit left/right guess');
    }
  });

  // ─── Next Round ──────────────────────────────────────────────────────────
  socket.on('round:next', () => {
    try {
      const room = roomManager.getRoomForPlayer(socket.id);
      if (!room) return emitError('Not in a room');
      room.nextRound();
      emitStateUpdate(room.roomCode);
      // If new round started (not GAME_OVER), send private target to new Psychic
      const state = room.getPublicState();
      if (state.phase === 'CLUE_GIVING') {
        const psychicId = room.getPsychicId();
        const target = room.getPrivateTarget();
        if (psychicId && target !== null) {
          io.to(psychicId).emit('room:psychic_target', { targetPosition: target });
        }
      }
    } catch (err: unknown) {
      emitError(err instanceof Error ? err.message : 'Failed to advance round');
    }
  });

  // ─── Disconnect ──────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    const { room, roomCode } = roomManager.removePlayer(socket.id);
    if (room && roomCode) {
      io.to(roomCode).emit('game:state_update', room.getPublicState());
    }
  });
}
