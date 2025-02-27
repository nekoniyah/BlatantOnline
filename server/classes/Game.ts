import { axialDistance, isValidMove } from '../utils/moves';
import Pawn from './Pawn';
import Player from './Player';

export const boardData = [
	// Col 1
	{ id: 'red-1', q: 0, r: 0, color: 'red' },
	{ id: 'red-2', q: 1, r: 0, color: 'red' },
	{ id: 'blank', q: 2, r: 0, color: 'white' },
	{ id: 'blank', q: 3, r: 0, color: 'white' },
	{ id: 'blank', q: 4, r: 0, color: 'white' },
	{ id: 'wall', q: 5, r: 0, color: 'black' },
	{ id: 'energy', q: 6, r: 0, color: 'white', icon: '⚡' },
	{ id: 'dbl_energy', q: 7, r: 0, color: 'white', icon: '⚡⚡' },
	{ id: 'energy', q: 8, r: 0, color: 'white', icon: '⚡' },
	{ id: 'wall', q: 9, r: 0, color: 'black' },
	{ id: 'blank', q: 10, r: 0, color: 'white' },
	{ id: 'blank', q: 11, r: 0, color: 'white' },
	{ id: 'blank', q: 12, r: 0, color: 'white' },
	{ id: 'purple-1', q: 13, r: 0, color: 'purple' },
	{ id: 'purple-2', q: 14, r: 0, color: 'purple' },

	// Col 2
	{ id: 'red-3', q: 0, r: 1, color: 'red' },
	{ id: 'red-4', q: -1, r: 1, color: 'red' },
	{ id: 'red-5', q: 1, r: 1, color: 'red' },
	{ id: 'blank', q: 2, r: 1, color: 'white' },
	{ id: 'blank', q: 3, r: 1, color: 'white' },
	{ id: 'wall', q: 4, r: 1, color: 'black' },
	{ id: 'blank', q: 3, r: 1, color: 'white' },
	{ id: 'wall', q: 4, r: 1, color: 'black' },
	{ id: 'energy', q: 5, r: 1, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 6, r: 1, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 7, r: 1, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 8, r: 1, color: 'white', icon: '⚡' },
	{ id: 'wall', q: 9, r: 1, color: 'black' },
	{ id: 'blank', q: 10, r: 1, color: 'white' },
	{ id: 'blank', q: 11, r: 1, color: 'white' },
	{ id: 'purple-3', q: 12, r: 1, color: 'purple' },
	{ id: 'purple-4', q: 13, r: 1, color: 'purple' },
	{ id: 'purple-5', q: 14, r: 1, color: 'purple' },

	// Col 3
	{ id: 'red-6', q: 0, r: 2, color: 'red' },
	{ id: 'red-7', q: 1, r: 2, color: 'red' },
	{ id: 'blank', q: 2, r: 2, color: 'white' },
	{ id: 'blank', q: 3, r: 2, color: 'white' },
	{ id: 'blank', q: 4, r: 2, color: 'white' },
	{ id: 'blank', q: 5, r: 2, color: 'white' },
	{ id: 'blank', q: 6, r: 2, color: 'white' },
	{ id: 'blank', q: 7, r: 2, color: 'white' },
	{ id: 'blank', q: 8, r: 2, color: 'white' },
	{ id: 'blank', q: 9, r: 2, color: 'white' },
	{ id: 'blank', q: 10, r: 2, color: 'white' },
	{ id: 'blank', q: 11, r: 2, color: 'white' },
	{ id: 'blank', q: 12, r: 2, color: 'white' },
	{ id: 'purple-6', q: 13, r: 2, color: 'purple' },
	{ id: 'purple-7', q: 14, r: 2, color: 'purple' },

	// Col 4

	{ id: 'blank', q: -1, r: 3, color: 'white' },
	{ id: 'blank', q: 0, r: 3, color: 'white' },
	{ id: 'blank', q: 1, r: 3, color: 'white' },
	{ id: 'blank', q: 2, r: 3, color: 'white' },
	{ id: 'blank', q: 3, r: 3, color: 'white' },
	{ id: 'blank', q: 4, r: 3, color: 'white' },
	{ id: 'blank', q: 5, r: 3, color: 'white' },
	{ id: 'blank', q: 6, r: 3, color: 'white' },
	{ id: 'blank', q: 7, r: 3, color: 'white' },
	{ id: 'blank', q: 8, r: 3, color: 'white' },
	{ id: 'blank', q: 9, r: 3, color: 'white' },
	{ id: 'blank', q: 10, r: 3, color: 'white' },
	{ id: 'blank', q: 11, r: 3, color: 'white' },
	{ id: 'blank', q: 12, r: 3, color: 'white' },
	{ id: 'blank', q: 13, r: 3, color: 'white' },
	{ id: 'blank', q: 14, r: 3, color: 'white' },

	// Col 5

	{ id: 'blank', q: 0, r: 4, color: 'white' },
	{ id: 'blank', q: 1, r: 4, color: 'white' },
	{ id: 'blank', q: 2, r: 4, color: 'white' },
	{ id: 'blank', q: 3, r: 4, color: 'white' },
	{ id: 'blank', q: 4, r: 4, color: 'white' },
	{ id: 'blank', q: 5, r: 4, color: 'white' },
	{ id: 'blank', q: 6, r: 4, color: 'white' },
	{ id: 'wall', q: 7, r: 4, color: 'black' },
	{ id: 'blank', q: 8, r: 4, color: 'white' },
	{ id: 'blank', q: 9, r: 4, color: 'white' },
	{ id: 'blank', q: 10, r: 4, color: 'white' },
	{ id: 'blank', q: 11, r: 4, color: 'white' },
	{ id: 'blank', q: 12, r: 4, color: 'white' },
	{ id: 'blank', q: 13, r: 4, color: 'white' },
	{ id: 'blank', q: 14, r: 4, color: 'white' },

	// Col 6

	{ id: 'wall', q: -1, r: 5, color: 'black' },
	{ id: 'blank', q: 0, r: 5, color: 'white' },
	{ id: 'blank', q: 1, r: 5, color: 'white' },
	{ id: 'blank', q: 2, r: 5, color: 'white' },
	{ id: 'blank', q: 3, r: 5, color: 'white' },
	{ id: 'blank', q: 4, r: 5, color: 'white' },
	{ id: 'wall', q: 5, r: 5, color: 'black' },
	{ id: 'wall', q: 6, r: 5, color: 'black' },
	{ id: 'wall', q: 7, r: 5, color: 'black' },
	{ id: 'wall', q: 8, r: 5, color: 'black' },
	{ id: 'blank', q: 9, r: 5, color: 'white' },
	{ id: 'blank', q: 10, r: 5, color: 'white' },
	{ id: 'blank', q: 11, r: 5, color: 'white' },
	{ id: 'blank', q: 12, r: 5, color: 'white' },
	{ id: 'blank', q: 13, r: 5, color: 'white' },
	{ id: 'wall', q: 14, r: 5, color: 'black' },

	// Col 7

	{ id: 'wall', q: 0, r: 6, color: 'black' },
	{ id: 'blank', q: 1, r: 6, color: 'white' },
	{ id: 'blank', q: 2, r: 6, color: 'white' },
	{ id: 'blank', q: 3, r: 6, color: 'white' },
	{ id: 'blank', q: 4, r: 6, color: 'white' },
	{ id: 'blank', q: 5, r: 6, color: 'white' },
	{ id: 'blank', q: 6, r: 6, color: 'white' },
	{ id: 'blank', q: 7, r: 6, color: 'white' },
	{ id: 'blank', q: 8, r: 6, color: 'white', icon: '🎲' },
	{ id: 'wall', q: 9, r: 6, color: 'black' },
	{ id: 'blank', q: 10, r: 6, color: 'white' },
	{ id: 'blank', q: 11, r: 6, color: 'white' },
	{ id: 'blank', q: 12, r: 6, color: 'white' },
	{ id: 'blank', q: 13, r: 6, color: 'white' },
	{ id: 'wall', q: 14, r: 6, color: 'black' },

	// Col 8

	{ id: 'energy', q: -1, r: 7, color: 'white', icon: '⚡' },
	{ id: 'blank', q: 0, r: 7, color: 'white' },
	{ id: 'blank', q: 1, r: 7, color: 'white' },
	{ id: 'blank', q: 2, r: 7, color: 'white' },
	{ id: 'blank', q: 3, r: 7, color: 'white' },
	{ id: 'wall', q: 4, r: 7, color: 'black' },
	{ id: 'blank', q: 5, r: 7, color: 'white', icon: '🎲' },
	{ id: 'energy', q: 6, r: 7, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 7, r: 7, color: 'white', icon: '⚡' },
	{ id: 'blank', q: 8, r: 7, color: 'white' },
	{ id: 'blank', q: 9, r: 7, color: 'white' },
	{ id: 'blank', q: 10, r: 7, color: 'white' },
	{ id: 'blank', q: 11, r: 7, color: 'white' },
	{ id: 'blank', q: 12, r: 7, color: 'white' },
	{ id: 'blank', q: 13, r: 7, color: 'white' },
	{ id: 'energy', q: 14, r: 7, color: 'white', icon: '⚡' },

	// Col 9

	{ id: 'energy', q: 0, r: 8, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 1, r: 8, color: 'white', icon: '⚡' },
	{ id: 'wall', q: 2, r: 8, color: 'black' },
	{ id: 'blank', q: 3, r: 8, color: 'white', icon: '🎲' },
	{ id: 'wall', q: 4, r: 8, color: 'black' },
	{ id: 'blank', q: 5, r: 8, color: 'white' },
	{ id: 'dbl_energy', q: 6, r: 8, color: 'white', icon: '⚡⚡' },
	{ id: 'dbl_energy', q: 7, r: 8, color: 'white', icon: '⚡⚡' },
	{ id: 'dbl_energy', q: 8, r: 8, color: 'white', icon: '⚡⚡' },
	{ id: 'blank', q: 9, r: 8, color: 'white' },
	{ id: 'wall', q: 10, r: 8, color: 'black' },
	{ id: 'blank', q: 11, r: 8, color: 'white', icon: '🎲' },
	{ id: 'wall', q: 12, r: 8, color: 'black' },
	{ id: 'energy', q: 13, r: 8, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 14, r: 8, color: 'white', icon: '⚡' },

	// Col 10

	{ id: 'energy', q: -1, r: 9, color: 'white', icon: '⚡' },
	{ id: 'blank', q: 0, r: 9, color: 'white' },
	{ id: 'blank', q: 1, r: 9, color: 'white' },
	{ id: 'blank', q: 2, r: 9, color: 'white' },
	{ id: 'blank', q: 3, r: 9, color: 'white' },
	{ id: 'blank', q: 4, r: 9, color: 'white' },
	{ id: 'blank', q: 5, r: 9, color: 'white' },
	{ id: 'energy', q: 6, r: 9, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 7, r: 9, color: 'white', icon: '⚡' },
	{ id: 'blank', q: 8, r: 9, color: 'white', icon: '🎲' },
	{ id: 'wall', q: 9, r: 9, color: 'black' },
	{ id: 'blank', q: 10, r: 9, color: 'white' },
	{ id: 'blank', q: 11, r: 9, color: 'white' },
	{ id: 'blank', q: 12, r: 9, color: 'white' },
	{ id: 'blank', q: 13, r: 9, color: 'white' },
	{ id: 'energy', q: 14, r: 9, color: 'white', icon: '⚡' },

	// Col 11

	{ id: 'wall', q: 0, r: 10, color: 'black' },
	{ id: 'blank', q: 1, r: 10, color: 'white' },
	{ id: 'blank', q: 2, r: 10, color: 'white' },
	{ id: 'blank', q: 3, r: 10, color: 'white' },
	{ id: 'blank', q: 4, r: 10, color: 'white' },
	{ id: 'wall', q: 5, r: 10, color: 'black' },
	{ id: 'blank', q: 6, r: 10, color: 'white', icon: '🎲' },
	{ id: 'blank', q: 7, r: 10, color: 'white' },
	{ id: 'blank', q: 8, r: 10, color: 'white' },
	{ id: 'blank', q: 9, r: 10, color: 'white' },
	{ id: 'blank', q: 10, r: 10, color: 'white' },
	{ id: 'blank', q: 11, r: 10, color: 'white' },
	{ id: 'blank', q: 12, r: 10, color: 'white' },
	{ id: 'blank', q: 13, r: 10, color: 'white' },
	{ id: 'wall', q: 14, r: 10, color: 'black' },

	// Col 12

	{ id: 'wall', q: -1, r: 11, color: 'black' },
	{ id: 'blank', q: 0, r: 11, color: 'white' },
	{ id: 'blank', q: 1, r: 11, color: 'white' },
	{ id: 'blank', q: 2, r: 11, color: 'white' },
	{ id: 'blank', q: 3, r: 11, color: 'white' },
	{ id: 'blank', q: 4, r: 11, color: 'white' },
	{ id: 'wall', q: 5, r: 11, color: 'black' },
	{ id: 'wall', q: 6, r: 11, color: 'black' },
	{ id: 'wall', q: 7, r: 11, color: 'black' },
	{ id: 'wall', q: 8, r: 11, color: 'black' },
	{ id: 'blank', q: 9, r: 11, color: 'white' },
	{ id: 'blank', q: 10, r: 11, color: 'white' },
	{ id: 'blank', q: 11, r: 11, color: 'white' },
	{ id: 'blank', q: 12, r: 11, color: 'white' },
	{ id: 'blank', q: 13, r: 11, color: 'white' },
	{ id: 'wall', q: 14, r: 11, color: 'black' },

	// Col 13

	{ id: 'blank', q: 0, r: 12, color: 'white' },
	{ id: 'blank', q: 1, r: 12, color: 'white' },
	{ id: 'blank', q: 2, r: 12, color: 'white' },
	{ id: 'blank', q: 3, r: 12, color: 'white' },
	{ id: 'blank', q: 4, r: 12, color: 'white' },
	{ id: 'blank', q: 5, r: 12, color: 'white' },
	{ id: 'blank', q: 6, r: 12, color: 'white' },
	{ id: 'wall', q: 7, r: 12, color: 'black' },
	{ id: 'blank', q: 8, r: 12, color: 'white' },
	{ id: 'blank', q: 9, r: 12, color: 'white' },
	{ id: 'blank', q: 10, r: 12, color: 'white' },
	{ id: 'blank', q: 11, r: 12, color: 'white' },
	{ id: 'blank', q: 12, r: 12, color: 'white' },
	{ id: 'blank', q: 13, r: 12, color: 'white' },
	{ id: 'blank', q: 14, r: 12, color: 'white' },

	// Col 14

	{ id: 'blank', q: -1, r: 13, color: 'white' },
	{ id: 'blank', q: 0, r: 13, color: 'white' },
	{ id: 'blank', q: 1, r: 13, color: 'white' },
	{ id: 'blank', q: 2, r: 13, color: 'white' },
	{ id: 'blank', q: 3, r: 13, color: 'white' },
	{ id: 'blank', q: 4, r: 13, color: 'white' },
	{ id: 'blank', q: 5, r: 13, color: 'white' },
	{ id: 'blank', q: 6, r: 13, color: 'white' },
	{ id: 'blank', q: 7, r: 13, color: 'white' },
	{ id: 'blank', q: 8, r: 13, color: 'white' },
	{ id: 'blank', q: 9, r: 13, color: 'white' },
	{ id: 'blank', q: 10, r: 13, color: 'white' },
	{ id: 'blank', q: 11, r: 13, color: 'white' },
	{ id: 'blank', q: 12, r: 13, color: 'white' },
	{ id: 'blank', q: 13, r: 13, color: 'white' },
	{ id: 'blank', q: 14, r: 13, color: 'white' },

	// Col 15

	{ id: 'blue-1', q: 0, r: 14, color: 'blue' },
	{ id: 'blue-2', q: 1, r: 14, color: 'blue' },
	{ id: 'blank', q: 2, r: 14, color: 'white' },
	{ id: 'blank', q: 3, r: 14, color: 'white' },
	{ id: 'blank', q: 4, r: 14, color: 'white' },
	{ id: 'blank', q: 5, r: 14, color: 'white' },
	{ id: 'blank', q: 6, r: 14, color: 'white' },
	{ id: 'blank', q: 7, r: 14, color: 'white' },
	{ id: 'blank', q: 8, r: 14, color: 'white' },
	{ id: 'blank', q: 9, r: 14, color: 'white' },
	{ id: 'blank', q: 10, r: 14, color: 'white' },
	{ id: 'blank', q: 11, r: 14, color: 'white' },
	{ id: 'blank', q: 12, r: 14, color: 'white' },
	{ id: 'green-1', q: 13, r: 14, color: 'green' },
	{ id: 'green-2', q: 14, r: 14, color: 'green' },

	// Col 16
	{ id: 'blue-3', q: -1, r: 15, color: 'blue' },
	{ id: 'blue-4', q: 0, r: 15, color: 'blue' },
	{ id: 'blue-5', q: 1, r: 15, color: 'blue' },
	{ id: 'blank', q: 2, r: 15, color: 'white' },
	{ id: 'blank', q: 3, r: 15, color: 'white' },
	{ id: 'wall', q: 4, r: 15, color: 'black' },
	{ id: 'energy', q: 5, r: 15, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 6, r: 15, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 7, r: 15, color: 'white', icon: '⚡' },
	{ id: 'energy', q: 8, r: 15, color: 'white', icon: '⚡' },
	{ id: 'wall', q: 9, r: 15, color: 'black' },
	{ id: 'blank', q: 10, r: 15, color: 'white' },
	{ id: 'blank', q: 11, r: 15, color: 'white' },
	{ id: 'green-3', q: 12, r: 15, color: 'green' },
	{ id: 'green-4', q: 13, r: 15, color: 'green' },
	{ id: 'green-5', q: 14, r: 15, color: 'green' },

	// Col 17
	{ id: 'blue-6', q: 0, r: 16, color: 'blue' },
	{ id: 'blue-7', q: 1, r: 16, color: 'blue' },
	{ id: 'blank', q: 2, r: 16, color: 'white' },
	{ id: 'blank', q: 3, r: 16, color: 'white' },
	{ id: 'blank', q: 4, r: 16, color: 'white' },
	{ id: 'wall', q: 5, r: 16, color: 'black' },
	{ id: 'energy', q: 6, r: 16, color: 'white', icon: '⚡' },
	{ id: 'dbl_energy', q: 7, r: 16, color: 'white', icon: '⚡⚡' },
	{ id: 'energy', q: 8, r: 16, color: 'white', icon: '⚡' },
	{ id: 'wall', q: 9, r: 16, color: 'black' },
	{ id: 'blank', q: 10, r: 16, color: 'white' },
	{ id: 'blank', q: 11, r: 16, color: 'white' },
	{ id: 'blank', q: 12, r: 16, color: 'white' },
	{ id: 'green-6', q: 13, r: 16, color: 'green' },
	{ id: 'green-7', q: 14, r: 16, color: 'green' }
];

export default class Game {
	rooms: Room[] = [];
	players: { name: string; id: string }[] = [];

	addPlayer(player: { name: string; id: string }) {
		this.players.push(player);
	}

	removePlayer(playerId: string) {
		this.players = this.players.filter((player) => player.id !== playerId);
	}

	createRoom(id: string) {
		const room = new Room(id);
		this.rooms.push(room);

		return room;
	}

	removeRoom(id: string) {
		this.rooms = this.rooms.filter((room) => room.id !== id);
	}

	joinRoom(playerId: string, roomId: string) {
		const player = this.players.find((player) => player.id === playerId);
		let room = this.rooms.find((room) => room.id === roomId);

		if (!room) {
			room = this.createRoom(roomId);
		}

		if (player) {
			this.removePlayer(playerId);
			this.addPlayer(player);
			room.removePlayer(playerId);
			room.addPlayer(player);
		}

		return this.getRoom(roomId);
	}

	getRoom(id: string) {
		return this.rooms.find((room) => room.id === id);
	}

	leaveRoom(playerId: string, roomId: string) {
		const player = this.players.find((player) => player.id === playerId);
		const room = this.rooms.find((room) => room.id === roomId);
		if (player && room) {
			room.removePlayer(playerId);
			this.removePlayer(playerId);
		}
	}

	playerCount() {
		return this.players.length;
	}
}

export const defaultPawns: Pawn[] = [
	// Red pawns
	{ id: 'red-pawn-1', player: 'red', position: [1, 2] },
	{ id: 'red-pawn-2', player: 'red', position: [1, 1] },
	{ id: 'red-pawn-3', player: 'red', position: [0, 2] },
	// Blue pawns
	{ id: 'blue-pawn-1', player: 'blue', position: [0, 14] },
	{ id: 'blue-pawn-2', player: 'blue', position: [1, 14] },
	{ id: 'blue-pawn-3', player: 'blue', position: [1, 15] },
	// Add violet pawns
	{ id: 'violet-pawn-1', player: 'violet', position: [12, 1] },
	{ id: 'violet-pawn-2', player: 'violet', position: [13, 2] },
	{ id: 'violet-pawn-3', player: 'violet', position: [14, 2] },
	// Add green pawns
	{ id: 'green-pawn-1', player: 'green', position: [14, 14] },
	{ id: 'green-pawn-2', player: 'green', position: [13, 14] },
	{ id: 'green-pawn-3', player: 'green', position: [12, 15] }
];

export class Room {
	players: ({ name: string; id: string; ready?: boolean } & Player)[] = [];
	pawns: Pawn[] = defaultPawns;
	currentPlayer: number = 0;

	addPlayer(player: { name: string; id: string; ready?: boolean }, additionalData?: Player) {
		let p = additionalData || new Player(player.name);

		this.players.push(Object.assign(p, player));
	}

	removePlayer(playerId: string) {
		this.players = this.players.filter((player) => player.id !== playerId);
	}

	constructor(public id: string) {
		this.players = [];
	}

	playerCount() {
		return this.players.length;
	}

	playerReady(playerId: string) {
		const player = this.players.find((player) => player.id === playerId);
		if (player) {
			player.ready = true;
			this.removePlayer(playerId);
			this.addPlayer(player);
		}
	}

	readyCount() {
		return this.players.filter((player) => player.ready).length;
	}

	getPawnById(pawnId: string) {
		return this.pawns.find((pawn) => pawn.id === pawnId);
	}

	getPawnByPosition(position: [number, number]) {
		return this.pawns.find(
			(pawn) => pawn.position[0] === position[0] && pawn.position[1] === position[1]
		);
	}

	movePawn(pawnId: string, position: [number, number]): boolean {
		const pawn = this.pawns.find((pawn) => pawn.id === pawnId);
		if (!pawn) return false;

		let tile = boardData.find((tile) => tile.q === position[0] && tile.r === position[1]);

		// Check if the move is valid
		if (isValidMove(pawn?.position!, position, Object.assign(this, { tile }))) {
			let diff = axialDistance(
				{ q: pawn.position[0], r: pawn.position[1] },
				{ q: position[0], r: position[1] }
			);

			this.players = this.players.map((player, i) => {
				if (i === this.currentPlayer) {
					player.remainingMoves -= Math.abs(diff);

					return player;
				}
				return player;
			});

			// Check if the move captured a pawn

			let capturedPawn = this.getPawnByPosition(position);

			if (tile?.id === 'wall') return false;

			if (capturedPawn && capturedPawn.id !== pawn.id) {
				capturedPawn.captured = true;
				this.pawns = this.pawns.filter((pawn) => pawn.id !== capturedPawn.id);
				this.pawns.push(capturedPawn);
			}

			pawn.position = position;
			this.pawns = this.pawns.filter((pawn) => pawn.id !== pawnId);
			this.pawns.push(pawn);

			return true;
		}

		return false;
	}
}
