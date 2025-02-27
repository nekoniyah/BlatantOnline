import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';

interface Room {
	id: string;
	players: Player[];
	gameStarted: boolean;
	pawns: { id: string; position: [number, number]; player: string }[];
	currentPlayer: number;
	remainingMoves: number;
}

interface Player {
	id: string;
	name: string;
	ready: boolean;
	socketId: string;
	color: string;
}

const PLAYER_COLORS = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00'];

const rooms = new Map<string, Room>();

export function setupSocketServer(server: HTTPServer) {
	const io = new Server(server);

	io.on('connection', (socket) => {
		let currentRoom: string | null = null;

		socket.on('join', ({ roomId }) => {
			const room = rooms.get(roomId);
			if (!room) {
				// Create new room if it doesn't exist
				const newRoom: Room = {
					id: roomId,
					players: [
						{
							id: socket.id,
							name: 'Anonymous',
							ready: false,
							socketId: socket.id,
							color: PLAYER_COLORS[0]
						}
					],
					gameStarted: false,
					pawns: [],
					currentPlayer: 0,
					remainingMoves: 0
				};
				rooms.set(roomId, newRoom);
				socket.join(roomId);
				currentRoom = roomId;
				socket.emit('player_updated', { roomId, players: newRoom.players });
				return;
			}

			if (room.gameStarted) {
				socket.emit('error', { message: 'Game already in progress' });
				return;
			}

			if (room.players.length >= 4) {
				socket.emit('error', { message: 'Room is full' });
				return;
			}

			const newPlayer = {
				id: socket.id,
				name: 'Anonymous',
				ready: false,
				socketId: socket.id,
				color: PLAYER_COLORS[room.players.length]
			};

			room.players.push(newPlayer);
			socket.join(roomId);
			currentRoom = roomId;
			io.to(roomId).emit('player_updated', { roomId, players: room.players });
		});

		socket.on('update_name', ({ roomId, name }) => {
			const room = rooms.get(roomId);
			if (!room) return;

			const player = room.players.find((p) => p.socketId === socket.id);
			if (player) {
				player.name = name;
				io.to(roomId).emit('player_updated', { roomId, players: room.players });
			}
		});

		socket.on('ready', ({ roomId }) => {
			const room = rooms.get(roomId);
			if (!room) return;

			const player = room.players.find((p) => p.socketId === socket.id);
			if (player) {
				player.ready = !player.ready;
				io.to(roomId).emit('player_updated', { roomId, players: room.players });
			}
		});

		socket.on('start_game', ({ roomId }) => {
			const room = rooms.get(roomId);
			if (!room) return;

			if (room.players.length < 2) {
				socket.emit('error', { message: 'Need at least 2 players to start' });
				return;
			}

			if (!room.players.every((p) => p.ready)) {
				socket.emit('error', { message: 'All players must be ready' });
				return;
			}

			// Initialize game state
			room.gameStarted = true;
			room.currentPlayer = 0;
			room.remainingMoves = 3;

			// Initialize pawns for each player
			room.pawns = [];
			room.players.forEach((player, playerIndex) => {
				// Create initial pawns for each player
				const startRow = playerIndex === 0 ? 0 : 7; // First player starts at top, second at bottom
				for (let col = 0; col < 8; col++) {
					if (col % 2 === 0) {
						// Place pawns on alternating squares
						room.pawns.push({
							id: `pawn_${player.id}_${col}`,
							position: [startRow, col],
							player: player.id
						});
					}
				}
			});

			io.to(roomId).emit('game_started', {
				roomId,
				players: room.players,
				pawns: room.pawns,
				currentPlayer: room.currentPlayer,
				remainingMoves: room.remainingMoves
			});
		});

		socket.on('move', ({ roomId, id, position }) => {
			const room = rooms.get(roomId);
			if (!room || !room.gameStarted) return;

			// Verify it's the player's turn
			const player = room.players.find((p) => p.socketId === socket.id);
			if (!player || player.id !== room.players[room.currentPlayer].id) {
				socket.emit('error', { message: 'Not your turn' });
				return;
			}

			// Verify moves remaining
			if (room.remainingMoves <= 0) {
				socket.emit('error', { message: 'No moves remaining' });
				return;
			}

			const pawnIndex = room.pawns.findIndex((p) => p.id === id);
			if (pawnIndex === -1) return;

			// Verify the pawn belongs to the current player
			if (room.pawns[pawnIndex].player !== player.id) {
				socket.emit('error', { message: 'Not your pawn' });
				return;
			}

			// Update pawn position
			room.pawns[pawnIndex].position = position;
			room.remainingMoves--;

			io.to(roomId).emit('move', {
				id,
				position,
				remainingMoves: room.remainingMoves
			});
		});

		socket.on('end_turn', ({ roomId }) => {
			const room = rooms.get(roomId);
			if (!room || !room.gameStarted) return;

			// Verify it's the player's turn
			const player = room.players.find((p) => p.socketId === socket.id);
			if (!player || player.id !== room.players[room.currentPlayer].id) {
				socket.emit('error', { message: 'Not your turn' });
				return;
			}

			room.currentPlayer = (room.currentPlayer + 1) % room.players.length;
			room.remainingMoves = 3;

			io.to(roomId).emit('end_turn', {
				currentPlayer: room.currentPlayer,
				remainingMoves: room.remainingMoves
			});
		});

		socket.on('chat_message', ({ roomId, message }) => {
			const room = rooms.get(roomId);
			if (!room) return;

			const player = room.players.find((p) => p.socketId === socket.id);
			if (!player) return;

			io.to(roomId).emit('chat_message', {
				sender: player.name,
				message,
				timestamp: new Date()
			});
		});

		socket.on('disconnect', () => {
			if (currentRoom) {
				const room = rooms.get(currentRoom);
				if (room) {
					room.players = room.players.filter((p) => p.socketId !== socket.id);
					if (room.players.length === 0) {
						rooms.delete(currentRoom);
					} else {
						io.to(currentRoom).emit('player_updated', {
							roomId: currentRoom,
							players: room.players
						});
					}
				}
			}
		});
	});

	return io;
}
