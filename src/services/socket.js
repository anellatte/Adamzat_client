import { io } from 'socket.io-client';

const SOCKET_URL = 'https://adamzat-server.onrender.com'; // Adjust the URL if needed

const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
});

export default socket;
