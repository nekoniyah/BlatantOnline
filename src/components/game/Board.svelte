<!--
  @component Board
  @description The game board component that renders a hexagonal grid of tiles.
  Uses SVG for rendering the board layout and positions it in the center of the screen.
  Tiles are rendered using the HexagonTile component based on boardData configuration.
-->
<script lang="ts">
	import { boardData } from '$lib/boardData';
	import HexagonTile from './HexagonTile.svelte';
	import type { HexTile } from '../../types/game';

	// Calculate board dimensions based on actual board data
	$: {
		const minQ = Math.min(...boardData.map((tile) => tile.q));
		const maxQ = Math.max(...boardData.map((tile) => tile.q));
		const minR = Math.min(...boardData.map((tile) => tile.r));
		const maxR = Math.max(...boardData.map((tile) => tile.r));

		const hexSize = 30;
		const hexWidth = Math.sqrt(3) * hexSize;
		const hexHeight = 2 * hexSize;

		// Calculate bounds for flat-topped hexagons
		const xMin = hexWidth * (minQ + minR / 2);
		const xMax = hexWidth * (maxQ + maxR / 2);
		const yMin = hexHeight * ((minR * 3) / 4);
		const yMax = hexHeight * ((maxR * 3) / 4);

		const width = xMax - xMin;
		const height = yMax - yMin;
		const margin = hexSize * 3;

		viewBox = `${xMin - margin} ${yMin - margin} ${width + margin * 2} ${height + margin * 2}`;
	}

	let viewBox: string;
</script>

<!-- SVG container for the hexagonal game board -->
<div class="board-container">
	<svg class="board" {viewBox} preserveAspectRatio="xMidYMid meet">
		{#each boardData as tile}
			<HexagonTile {tile} />
		{/each}
	</svg>
</div>

<style>
	.board-container {
		position: relative;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	/* Board positioning and sizing */
	.board {
		max-width: 90%;
		max-height: 90%;
		aspect-ratio: 1;
		pointer-events: all; /* Enable interaction with the board */
	}

	/* Ensure the board is visible for debugging */
	:global(.debug) .board {
		border: 1px solid red;
	}
</style>
