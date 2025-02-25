import { Card } from '$lib/lib';
import { type GameState } from '../../stores/gameStore';

export class Charge extends Card {
	constructor() {
		super('charge', 'Charge', 5, 'charge.png');
	}

	effect(gameState: GameState, callback: () => void) {
		let player = gameState.players[gameState.currentPlayer];
		player.remainingMoves += 6;
		player.forcedLine = true;

		callback();
	}
}
