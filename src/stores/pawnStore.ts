import { writable } from 'svelte/store';
import type { Pawn } from '../types/game';

export const pawns = writable<Pawn[]>([
	{ id: 'red-pawn-1', player: 'red', position: [0, 0] },
	{ id: 'red-pawn-2', player: 'red', position: [1, 0] },
	{ id: 'blue-pawn-1', player: 'blue', position: [0, 16] },
	{ id: 'blue-pawn-2', player: 'blue', position: [1, 16] }
]);

export const selectedPawn = writable<Pawn | null>(null);
