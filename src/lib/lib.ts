export class Board {
	height: number;
	width: number;
	matrix: any[][] = [];

	constructor(height: number, width: number) {
		this.width = width;
		this.height = height;
	}

	init(selector: string) {
		let element = document.querySelector(selector)!;

		for (let y = 0; y < this.width; y++) {
			let row = document.createElement('div');
			row.classList.add('row', `row-${y}`);
			let yArr = [];

			for (let x = 0; x < this.height; x++) {
				let hex = document.createElement('div');
				hex.classList.add('hex', `hex-${x}`, 'red');

				row.appendChild(hex);
				yArr.push({
					hex
				});
			}

			this.matrix.push(yArr);
			element.appendChild(row);
		}
	}
}

export class Pawn {
	type: string;
	position: [number, number];

	constructor(type: string, position: [number, number]) {
		this.type = type;
		this.position = position;
	}
}

export class Card {
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

export class Player {
	name: string = '';
	energy: number = 4;
	cards: Card[] = [];
	hand: Card[] = [];
	deck: Card[] = [];
	remainingMoves: number = 3;
	forcedLine: boolean = false;

	constructor(name: string) {
		this.name = name;
		this.initializeDeck();
		this.draw(4);
	}

	initializeDeck() {
		// Create a starter deck for the player
		this.deck = [];

		// Shuffle the deck
		this.shuffleDeck();
	}

	shuffleDeck() {
		for (let i = this.deck.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
		}
	}

	draw(count: number) {
		for (let i = 0; i < count; i++) {
			if (this.deck.length > 0) {
				const card = this.deck.pop();
				if (card) this.hand.push(card);
			}
		}
	}

	playCard(cardIndex: number, gameState: any, callback: (...args: any[]) => void) {
		if (cardIndex >= 0 && cardIndex < this.hand.length) {
			const card = this.hand[cardIndex];

			// Check if player has enough energy
			if (this.energy >= card.cost) {
				this.energy -= card.cost;
				card.effect(gameState, callback);
				this.hand.splice(cardIndex, 1);
				return true;
			}
		}
		return false;
	}
}
