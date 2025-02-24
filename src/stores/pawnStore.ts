import { writable } from 'svelte/store';
import type { Pawn } from '../types/game';

export const pawns = writable<Pawn[]>([
	{ id: 'red-pawn-1', player: 'red', position: [1, 2] },
	{ id: 'red-pawn-2', player: 'red', position: [1, 1] },
	{ id: 'red-pawn-3', player: 'red', position: [0, 2] },
	{ id: 'blue-pawn-1', player: 'blue', position: [0, 14] },
	{ id: 'blue-pawn-2', player: 'blue', position: [1, 14] },
	{ id: 'blue-pawn-3', player: 'blue', position: [1, 15] }
]);

export const selectedPawn = writable<Pawn | null>(null);
