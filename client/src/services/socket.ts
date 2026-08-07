import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io('/', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socket.on('connect', () => {
      console.log('⚡ [SOCKET.IO FRONTEND] Connected to HAMS Gateway with ID:', socket?.id);
    });

    socket.on('disconnect', () => {
      console.log('⚡ [SOCKET.IO FRONTEND] Disconnected from HAMS Gateway');
    });
  }
  return socket;
};
