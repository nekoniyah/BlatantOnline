export interface Card {
	name: string;
	description: string;
	energyCost: number;
}

export interface Player {
	name: string;
	energy: number;
	cards: Card[];
	hand: Card[];
	deck: Card[];
	remainingMoves: number;
	forcedLine: boolean;
}

export interface Pawn {
	type: string;
	position: [number, number];
}
