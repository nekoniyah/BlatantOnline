import Card from './Card';

export default class Player {
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
