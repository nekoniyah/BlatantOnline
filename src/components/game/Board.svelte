<script lang="ts">
	import { boardData } from '$lib/boardData';
	import HexagonTile from './HexagonTile.svelte';

	const hexSize = 10; // Hexagon radius
	const hexWidth = Math.sqrt(3) * hexSize;
	const hexHeight = 2 * hexSize * 0.75;
</script>

<svg class="board" viewBox="-30 -30 500 500">
	{#each boardData as tile}
		<HexagonTile {tile} />
	{/each}
</svg>

<style>
	.board {
		width: 90%;
		height: auto;
	}
</style>
