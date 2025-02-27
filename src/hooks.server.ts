import type { Handle } from '@sveltejs/kit';
import { setupSocketServer } from '$lib/server/socket';
import { Server } from 'http';

const server = new Server();
setupSocketServer(server);

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};

// Start the WebSocket server on port 3001 (or your preferred port)
server.listen(3001, () => {
	console.log('WebSocket server is running on port 3001');
});
