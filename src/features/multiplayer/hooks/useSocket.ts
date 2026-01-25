import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export type RoomState = { text: string; players: Record<string, { name: string; progress: number; wpm?: number; accuracy?: number; ready?: boolean }> };

let sharedSocket: Socket | null = null;

function initSocket() {
  if (sharedSocket) return sharedSocket;
  // reuse socket created by SocketProvider if present on window
  if ((window as any).__TYPING_SOCKET) {
    sharedSocket = (window as any).__TYPING_SOCKET as Socket;
    return sharedSocket;
  }
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  sharedSocket = io(url, { autoConnect: true });
  sharedSocket.on('connect_error', (err: any) => console.warn('socket connect error', err));
  return sharedSocket;
}

export function useSocket(onRoomState?: (state: any) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;
    if (onRoomState) {
      socket.on('room:state', onRoomState);
    }
    socket.on('room:error', (e: any) => console.warn('room error', e));

    return () => {
      if (onRoomState) {
        socket.off('room:state', onRoomState);
      }
      socketRef.current = null;
      // do not disconnect sharedSocket here to allow reuse across app
    };
  }, [onRoomState]);

  const createRoom = useCallback((room: string, text: string, name?: string) => {
    sharedSocket?.emit('room:create', { room, text, name });
  }, []);

  const setRoomText = useCallback((room: string, text: string) => {
    sharedSocket?.emit('room:setText', { room, text });
  }, []);

  const joinRoom = useCallback((room: string, name?: string) => {
    sharedSocket?.emit('room:join', { room, name });
  }, []);

  const sendProgress = useCallback((room: string, progress: number, wpm?: number, accuracy?: number) => {
    sharedSocket?.emit('room:progress', { room, progress, wpm, accuracy });
  }, []);

  const setReady = useCallback((room: string, ready: boolean) => {
    sharedSocket?.emit('player:ready', { room, ready });
  }, []);

  const startRace = useCallback((room: string) => {
    sharedSocket?.emit('race:start', { room });
  }, []);

  const leaveRoom = useCallback((room: string) => {
    sharedSocket?.emit('room:leave', { room });
  }, []);

  return { createRoom, joinRoom, sendProgress, setReady, startRace, leaveRoom, setRoomText, socket: sharedSocket };
}


