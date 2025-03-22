

import { io, Socket } from "socket.io-client";

// const SOCKET_URL = "http://localhost:3000"; 
const SOCKET_URL = import.meta.env.VITE_SOCKET_SERVER; 

let socket: Socket | null = null;

export const connectSocket = (token?: string, user_id?: string): Socket => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            autoConnect: false, 
            auth: { token, user_id },
        });
        socket.connect(); 
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const getSocket = (): Socket | null => socket;
