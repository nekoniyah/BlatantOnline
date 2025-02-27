export default class Pawn {
	id: string;
	position: [number, number];
	player: string;
	captured?: boolean;

	constructor(id: string, position: [number, number], player: string) {
		this.id = id;
		this.position = position;
		this.player = player;
		this.captured = false;
	}
}
