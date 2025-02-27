import { io } from 'socket.io-client';
import { env } from '$env/dynamic/public';

export const socket = () => {
	return io('http://localhost:3001', {
		transports: ['websocket'],
		autoConnect: true,
		reconnection: true,
		reconnectionAttempts: 5,
		reconnectionDelay: 1000
	});
};
