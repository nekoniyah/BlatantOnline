// src/stores/gameStore.ts
import { writable } from 'svelte/store';
import { Board, Player } from '$lib/lib';

export type TeamColor = 'red' | 'blue' | 'violet' | 'green';

export interface GameState {
	players: Player[];
	currentPlayer: number;
	board: Board;
	gamePhase: 'setup' | 'playing' | 'ended';
	teams: {
		[playerId: string]: TeamColor[];
	};
	turn: number;
}

export const gameStore = writable<GameState>({
	players: [] as Player[],
	currentPlayer: 0,
	board: new Board(15, 17),
	gamePhase: 'setup',
	teams: {},
	turn: 0
});

// Helper functions to manage the game state
export const gameActions = {
	// Initialize a new game with players
	initGame: (playerNames: string[]) => {
		gameStore.update((state) => {
			const players = playerNames.map((name) => new Player(name));

			// Assign teams based on number of players
			const teams: { [playerId: string]: TeamColor[] } = {};
			if (players.length === 2) {
				// 2 players: each controls 2 colors
				teams[players[0].name] = ['red', 'violet'];
				teams[players[1].name] = ['blue', 'green'];
			} else if (players.length === 4) {
				// 4 players: each controls 1 color
				teams[players[0].name] = ['red'];
				teams[players[1].name] = ['blue'];
				teams[players[2].name] = ['violet'];
				teams[players[3].name] = ['green'];
			}

			return {
				...state,
				players,
				currentPlayer: 0,
				gamePhase: 'playing',
				teams
			};
		});
	},

	// Check if a player can move a specific pawn
	canMovePawn: (playerName: string, pawnColor: TeamColor): boolean => {
		let canMove = false;
		gameStore.update((state) => {
			const currentPlayerName = state.players[state.currentPlayer].name;
			if (playerName === currentPlayerName && state.teams[playerName].includes(pawnColor)) {
				canMove = true;
			}
			return state;
		});
		return canMove;
	},

	// End the current player's turn and move to the next player
	endTurn: () => {
		gameStore.update((state) => {
			const nextPlayer = (state.currentPlayer + 1) % state.players.length;
			gameActions.startTurnFor(nextPlayer);
			// Reset the forcedLine flag and the movement counter for the next player

			state.players[nextPlayer].forcedLine = false;
			state.players[nextPlayer].remainingMoves = 3;

			return {
				...state,
				turn: state.turn + 1,
				currentPlayer: nextPlayer
			};
		});
	},

	startTurnFor: (playerIndex: number) => {
		gameStore.update((state) => {
			// Add energy and draw 4 cards for the current player if it's not the first turn

			if (state.players.length === 2 ? state.turn > 0 : state.turn > 3) {
				state.players[playerIndex].energy += 1;
				state.players[playerIndex].draw(4);
			}

			return {
				...state
			};
		});
	}
};
