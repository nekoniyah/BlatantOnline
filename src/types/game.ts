export interface HexTile {
	id: string;
	q: number;
	r: number;
	color: string;
	icon?: string;
}

export interface Pawn {
	id: string;
	player: string;
	position: [number, number];
}
