import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const connect = async () => {
      const token = await SecureStore.getItemAsync('accessToken');
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      socketRef.current.on('connect', () => setIsConnected(true));
      socketRef.current.on('disconnect', () => setIsConnected(false));
    };

    connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return { socket: socketRef.current, isConnected };
}
