import { useCallback, useEffect, useRef, useState } from 'react';
import { socket } from '../lib/socket';
import type { PublicGameState } from '../types/game';

export interface GameStateResult {
  gameState: PublicGameState | null;
  psychicTarget: number | null;
  localPlayerId: string | null;
  error: string | null;
  connected: boolean;
  clearError: () => void;
}

export function useGameState(): GameStateResult {
  const [gameState, setGameState] = useState<PublicGameState | null>(null);
  const [psychicTarget, setPsychicTarget] = useState<number | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  // Keep psychicTarget stable across re-renders using a ref for the reset logic
  const phaseRef = useRef<string | null>(null);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setLocalPlayerId(socket.id ?? null);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    const onStateUpdate = (state: PublicGameState) => {
      setGameState(state);
      // When a new round starts (CLUE_GIVING), clear any stale psychic target
      // from a previous round for non-psychic clients
      if (state.phase === 'CLUE_GIVING' && phaseRef.current !== 'CLUE_GIVING') {
        setPsychicTarget(null);
      }
      phaseRef.current = state.phase;
    };

    const onRoomCreated = ({ roomCode, state }: { roomCode: string; state: PublicGameState }) => {
      console.log('Room created:', roomCode);
      setGameState(state);
    };

    const onRoomJoined = ({ state }: { state: PublicGameState }) => {
      setGameState(state);
    };

    const onPsychicTarget = ({ targetPosition }: { targetPosition: number }) => {
      setPsychicTarget(targetPosition);
    };

    const onError = ({ message }: { message: string }) => {
      setError(message);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('game:state_update', onStateUpdate);
    socket.on('room:created', onRoomCreated);
    socket.on('room:joined', onRoomJoined);
    socket.on('room:psychic_target', onPsychicTarget);
    socket.on('room:error', onError);

    // Update localPlayerId if socket already connected
    if (socket.connected) {
      setConnected(true);
      setLocalPlayerId(socket.id ?? null);
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('game:state_update', onStateUpdate);
      socket.off('room:created', onRoomCreated);
      socket.off('room:joined', onRoomJoined);
      socket.off('room:psychic_target', onPsychicTarget);
      socket.off('room:error', onError);
    };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { gameState, psychicTarget, localPlayerId, error, connected, clearError };
}
