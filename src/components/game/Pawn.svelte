<script lang="ts">
	import type { HexTile, Pawn } from '../../types/game';
	import { selectedPawn } from '../../stores/pawnStore';

	export let pawn: Pawn;
	export let tile: HexTile;

	function handleClick() {
		selectedPawn.set(pawn);
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<circle
	class="pawn {pawn.player}{$selectedPawn?.id === pawn.id ? ' selected' : ''}"
	r="7"
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

	.pawn.selected {
		stroke-width: 2;
		r: 8;
	}

	.pawn:hover {
		filter: brightness(1.2);
	}
</style>
