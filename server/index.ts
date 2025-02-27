import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import Game, { boardData } from './classes/Game';
import { isValidMove } from './utils/moves';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*'
	}
});

let game = new Game();

io.on('connection', (socket) => {
	let id = socket.handshake.auth.token;

	if (id === undefined) {
		socket.disconnect();
		return;
	}

	game.addPlayer({ name: `Player ${io.sockets.sockets.size}`, id });

	socket.on('join', (roomId: string) => {
		socket.join(roomId);
		const room = game.joinRoom(id, roomId)!;

		socket.on('ready', () => {
			room.playerReady(id);

			if (room.readyCount() === 2) {
				socket.on('move', (data: { id: string; position: [number, number] }) => {
					let success = room.movePawn(data.id, data.position);

					if (success) io.sockets.in(roomId).emit('move', data);
				});

				socket.on('end_turn', () => {
					room.currentPlayer = room.currentPlayer === 0 ? 1 : 0;

					// Reset players remaining moves and forced line

					room.players.forEach((player) => {
						player.remainingMoves = 3;
						player.forcedLine = false;

						room.removePlayer(player.id);
						room.addPlayer(player, player);
					});
				});

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

				io.sockets.in(roomId).emit('start', room);
			}
		});

		socket.on('leave', () => {
			socket.leave(roomId);
			room.removePlayer(id);
		});
	});

	socket.on('disconnect', () => {
		game.removePlayer(id);
	});
});

httpServer.listen(3000, () => {
	console.log('listening on *:3000');
});
