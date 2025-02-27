// src/stores/gameStore.ts
import { writable } from 'svelte/store';

export type TeamColor = 'red' | 'blue' | 'violet' | 'green';

export interface GameState {
	players: {
		name: string;
		energy: number;
		cards: string[];
		hand: string[];
		deck: string[];
		remainingMoves: number;
		forcedLine: boolean;
	}[];
	currentPlayer: number;
	board: any;
	gamePhase: 'setup' | 'playing' | 'ended';
	teams: {
		[playerId: string]: TeamColor[];
	};
	turn: number;
}

export const gameStore = writable<GameState>();

export const initialized = writable(false);
