import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export const socket = io(URL, {
    autoConnect: true,
    transports: ['websocket', 'polling'] // Explicitly fallback to polling if websocket fails, though usually websocket preferred
});
