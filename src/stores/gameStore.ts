import { writable } from 'svelte/store';
import { type Player, Board } from '$lib/lib';

interface GameState {
	players: Player[];
	currentPlayer: number;
	board: Board;
	gamePhase: 'setup' | 'playing' | 'ended';
}

export const gameStore = writable<GameState>({
	players: [],
	currentPlayer: 0,
	board: new Board(8, 8),
	gamePhase: 'setup'
});
