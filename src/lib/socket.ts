import { io } from 'socket.io-client';
import { env } from '$env/dynamic/public';

export function socket() {
	let token = localStorage.getItem('token');

	if (!token) {
		localStorage.setItem(
			'token',
			Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
		);
		token = localStorage.getItem('token');
	}

	let s = io(env.PUBLIC_SERVER_URL || 'http://localhost:3000', {
		auth: {
			token
		}
	});

	return s;
}
