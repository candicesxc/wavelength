import { GameRoom } from './GameRoom';

// 4-char uppercase alphabetic code, no I or O (confusable with 1 and 0)
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';

function generateCode(): string {
  return Array.from(
    { length: 4 },
    () => CHARS[Math.floor(Math.random() * CHARS.length)]
  ).join('');
}

export class RoomManager {
  private rooms = new Map<string, GameRoom>();
  // Map socket.id → roomCode for fast disconnect cleanup
  private playerRooms = new Map<string, string>();

  createRoom(creatorSocketId: string, creatorName: string): GameRoom {
    let code: string;
    do {
      code = generateCode();
    } while (this.rooms.has(code));

    const room = new GameRoom(code);
    room.addPlayer(creatorSocketId, creatorName, true);
    this.rooms.set(code, room);
    this.playerRooms.set(creatorSocketId, code);
    return room;
  }

  joinRoom(code: string, socketId: string, name: string): GameRoom {
    const room = this.rooms.get(code.toUpperCase());
    if (!room) throw new Error(`Room ${code} not found`);
    room.addPlayer(socketId, name, false);
    this.playerRooms.set(socketId, code.toUpperCase());
    return room;
  }

  getRoom(code: string): GameRoom | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  getRoomForPlayer(socketId: string): GameRoom | undefined {
    const code = this.playerRooms.get(socketId);
    if (!code) return undefined;
    return this.rooms.get(code);
  }

  removePlayer(socketId: string): { room: GameRoom | undefined; roomCode: string | undefined } {
    const code = this.playerRooms.get(socketId);
    this.playerRooms.delete(socketId);
    if (!code) return { room: undefined, roomCode: undefined };
    const room = this.rooms.get(code);
    if (room) {
      room.removePlayer(socketId);
      // Clean up empty rooms
      if (room.getPlayerCount() === 0) {
        this.rooms.delete(code);
      }
    }
    return { room, roomCode: code };
  }
}
