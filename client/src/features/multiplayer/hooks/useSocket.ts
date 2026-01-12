import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type RoomState = { text: string; players: Record<string, { name: string; progress: number; wpm?: number; accuracy?: number }> };

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

export function useSocket(onRoomState?: (state: RoomState) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = initSocket();
    socketRef.current = socket;
    if (onRoomState) socket.on('room:state', onRoomState);
    socket.on('room:error', (e: any) => console.warn('room error', e));

    return () => {
      if (onRoomState) socket.off('room:state', onRoomState);
      socketRef.current = null;
      // do not disconnect sharedSocket here to allow reuse across app
    };
  }, [onRoomState]);

  const createRoom = (room: string, text: string, name?: string) => {
    sharedSocket?.emit('room:create', { room, text, name });
  };

  const joinRoom = (room: string, name?: string) => {
    sharedSocket?.emit('room:join', { room, name });
  };

  const sendProgress = (room: string, progress: number, wpm?: number, accuracy?: number) => {
    sharedSocket?.emit('room:progress', { room, progress, wpm, accuracy });
  };

  const leaveRoom = (room: string) => {
    sharedSocket?.emit('room:leave', { room });
  };

  return { createRoom, joinRoom, sendProgress, leaveRoom, socket: sharedSocket };
}

