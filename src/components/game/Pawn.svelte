<!-- src/components/game/Pawn.svelte -->
<script lang="ts">
	import type { HexTile, Pawn } from '../../types/game';
	import { selectedPawn } from '../../stores/pawnStore';
	import { gameStore, gameActions } from '../../stores/gameStore';

	export let pawn: Pawn;

	// Subscribe to the game store to get current player
	let currentPlayerName = '';
	gameStore.subscribe((state) => {
		if (state.players.length > 0) {
			currentPlayerName = state.players[state.currentPlayer].name;
		}
	});

	function handleClick() {
		// Check if the current player can move this pawn
		if (gameActions.canMovePawn(currentPlayerName, pawn.player as any)) {
			selectedPawn.set(pawn);
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<circle
	class="pawn {pawn.player}{$selectedPawn?.id === pawn.id ? ' selected' : ''}"
	r="18"
	on:click={handleClick}
/>

<style>
	.pawn {
		stroke: black;
		stroke-width: 1;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pawn.red {
		fill: #ff4444;
	}

	.pawn.blue {
		fill: #4444ff;
	}

	.pawn.violet {
		fill: #9944ff;
	}

	.pawn.green {
		fill: #44ff44;
	}

	.pawn.selected {
		stroke-width: 2;
		r: 8;
	}

	.pawn:hover {
		filter: brightness(1.2);
	}
</style>
