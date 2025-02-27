import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Game, { boardData } from './classes/Game';
import { isValidMove } from './utils/moves';

// Initialize Express app and Socket.IO server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*' // Allow connections from any origin
	}
});

// Create new game instance
let game = new Game();

// Handle new socket connections
io.on('connection', (socket) => {
	let id = socket.handshake.auth.token;

	// Disconnect if no auth token provided
	if (id === undefined) {
		socket.disconnect();
		return;
	}

	// Add new player to game with incrementing player number
	game.addPlayer({ name: `Player ${io.sockets.sockets.size}`, id });

	// Handle player joining a room
	socket.on('join', (roomId: string) => {
		socket.join(roomId);
		const room = game.joinRoom(id, roomId)!;

		// Handle player ready state
		socket.on('ready', () => {
			room.playerReady(id);

			// Start game when both players are ready
			if (room.readyCount() === 2) {
				// Handle pawn movement
				socket.on('move', (data: { id: string; position: [number, number] }) => {
					let success = room.movePawn(data.id, data.position);

					// Broadcast successful moves to all players in room
					if (success) io.sockets.in(roomId).emit('move', data);
				});

				// Handle end of turn
				socket.on('end_turn', () => {
					// Switch current player
					room.currentPlayer = room.currentPlayer === 0 ? 1 : 0;

					// Reset player states for new turn
					room.players.forEach((player) => {
						player.remainingMoves = 3;
						player.forcedLine = false;

						// Refresh player in room
						room.removePlayer(player.id);
						room.addPlayer(player, player);
					});
				});

				// Validate move before it's made
				socket.on(
					'check_valid_move',
					(
						position1: [number, number],
						position2: [number, number],
						callback: (success: boolean) => void
					) => {
						let tile = boardData.find((tile) => tile.q === position2[0] && tile.r === position2[1]);
						callback(isValidMove(position1, position2, Object.assign(room, { tile })));
					}
				);

				// Verify it's the correct player's turn
				socket.on(
					'check_turn',
					(currentPlayerName: string, pawnColor: string, callback: () => void) => {
						let i = 0;
						room.pawns.forEach((pawn) => {
							if (pawn.player === pawnColor) {
								if (i === 0 && currentPlayerName === room.players[room.currentPlayer].name)
									callback();
								i++;
							}
						});
					}
				);

				// Emit start game event to all players in room
				io.sockets.in(roomId).emit('start', room);
			}
		});

		// Handle player leaving room
		socket.on('leave', () => {
			socket.leave(roomId);
			room.removePlayer(id);
		});
	});

	// Handle player disconnection
	socket.on('disconnect', () => {
		game.removePlayer(id);
	});
});

// Start server on port 3000
httpServer.listen(3000, () => {
	console.log('listening on *:3000');
});
