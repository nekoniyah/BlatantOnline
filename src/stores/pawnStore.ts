import { writable } from 'svelte/store';
import type { Pawn } from '../types/game';

export const pawns = writable<Pawn[]>([
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
]);

export const selectedPawn = writable<Pawn | null>(null);
