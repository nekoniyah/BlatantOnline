export default class Card {
	id: string;
	name: string;
	cost: number;
	image: string;

	constructor(id: string, name: string, cost: number, image: string) {
		this.id = id;
		this.name = name;
		this.cost = cost;
		this.image = image;
	}

	effect(gameState: any, callback: () => void) {
		// This will be overridden by specific card implementations
		callback();
	}
}
