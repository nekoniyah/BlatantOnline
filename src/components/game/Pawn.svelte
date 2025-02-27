<!-- src/components/game/Pawn.svelte -->
<!--
  @component Pawn
  @description A component that represents a player's pawn on the game board.
  Handles pawn selection, turn validation, and visual feedback for player interaction.
  
  @prop {Pawn} pawn - The pawn object containing player and position information
-->
<script lang="ts">
	import type { Pawn } from '../../types/game';
	import { selectedPawn } from '../../stores/pawnStore';
	import { gameStore } from '../../stores/gameStore';
	import { socket } from '../../stores/socket';

	export let pawn: Pawn;

	// Track the current player's name from game state
	let currentPlayerName = '';
	gameStore.subscribe((state) => {
		if (!state) return;

		if (state.players.length > 0) {
			currentPlayerName = state.players[state.currentPlayer].name;
		}
	});

	/**
	 * Handles pawn selection/deselection when clicked
	 * If the pawn is already selected, deselects it
	 * Otherwise, validates turn and selects the pawn if valid
	 */
	function handleClick() {
		if ($selectedPawn === pawn) {
			selectedPawn.set(null);
		} else {
			$socket!.emit('check_turn', currentPlayerName, pawn.player, () => {
				selectedPawn.set(pawn);
			});
		}
	}
</script>

{#if $socket}
	<!-- Accessibility exceptions for game interaction -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<circle
		class="pawn {pawn.player}{$selectedPawn
			? $selectedPawn.id === pawn.id
				? ' selected'
				: ''
			: ''}"
		r="18"
		on:click={handleClick}
	/>
{/if}

<style>
	/* Base pawn styling */
	.pawn {
		stroke: black;
		stroke-width: 1;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	/* Player-specific colors */
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

	/* Selected state styling */
	.pawn.selected {
		stroke-width: 2;
		r: 8;
	}

	/* Hover effect */
	.pawn:hover {
		filter: brightness(1.2);
	}
</style>
