import React, { createContext, useContext, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { IP_PC } from '../../config';

const SocketContext = createContext<Socket | null>(null);

const socket = io(`${IP_PC}`, {
  transports: ['websocket', 'polling'],
  withCredentials: true,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connecté au WebSocket :', socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
