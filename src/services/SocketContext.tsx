import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isAuthenticated: boolean;
  connectWithAuth: (token: string, user_id: string, serverUrl: string) => void;
  logout: () => void;
}

interface AuthData {
  token: string;
  user_id: string;
  serverUrl: string;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

declare global {
  interface Window {
    __IO__: Socket | null;
  }
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;


  // AUTH DATA FUNCTIONS
  const saveAuthData = (token: string, user_id: string, serverUrl: string) => {
    const authData: AuthData = { token, user_id, serverUrl };
    localStorage.setItem('socketAuthData', JSON.stringify(authData));
  };

  const getAuthData = (): AuthData | null => {
    const data = localStorage.getItem('socketAuthData');
    return data ? JSON.parse(data) : null;
  };

  const clearAuthData = () => {
    localStorage.removeItem('socketAuthData');
  };

  const connectWithAuth = (token: string, user_id: string, serverUrl: string) => {
    if (window.__IO__) {
      window.__IO__.disconnect();
    }

    const newSocket = io(serverUrl, {
      auth: { token, user_id },
    });

    window.__IO__ = newSocket;
    setSocket(newSocket);

    newSocket.on('authentication-success', () => {
      setIsAuthenticated(true);
      saveAuthData(token, user_id, serverUrl);
    });

    newSocket.on('authentication-failed', () => {
      setIsAuthenticated(false);
      clearAuthData();
      console.error('Authentication failed');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearAuthData();
    
    if (window.__IO__) {
      window.__IO__.disconnect();
      window.__IO__ = null;
    }
    
    const newSocket = io(SERVER_URL); // UNAUTHENTICATED CONNECTION
    window.__IO__ = newSocket;
    setSocket(newSocket);
  };

  useEffect(() => {
    const authData = getAuthData(); // WILL GET SAVED AUTH DATA
    
    if (authData) { // RECONNNECT IF MERON
      connectWithAuth(authData.token, authData.user_id, authData.serverUrl);
    } else {
      if (!window.__IO__) {
        const newSocket = io(SERVER_URL);
        window.__IO__ = newSocket;
        setSocket(newSocket);
      }
    }

    return () => {
      if (window.__IO__) {
        window.__IO__.disconnect();
        window.__IO__ = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
  
    socket.on("connect", () => {
      console.log("Connected to WebSocket server on port", window.location.port);
    });
  
    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server on port", window.location.port);
    });
  
    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
      }
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isAuthenticated, connectWithAuth, logout }}>
      {children}
    </SocketContext.Provider>
  );
};