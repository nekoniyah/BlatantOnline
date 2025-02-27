export interface GameState {
	players: Player[];
	currentPlayer: number;
	turnTimeLimit: number;
	turnTimeRemaining: number;
}

export interface Player {
	id: string;
	name: string;
	hand: string[];
}

export function playCard(state: GameState, cardId: string, playerId: string): GameState {
	const playerIndex = state.players.findIndex((p) => p.id === playerId);
	if (playerIndex === -1) return state;

	const newState = { ...state };
	newState.players = [...state.players];
	newState.players[playerIndex] = {
		...state.players[playerIndex],
		hand: state.players[playerIndex].hand.filter((id) => id !== cardId)
	};

	return newState;
}
