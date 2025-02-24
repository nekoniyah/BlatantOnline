<script lang="ts">
	import { boardData } from '$lib/boardData';
	import HexagonTile from './HexagonTile.svelte';
</script>

<svg class="board" viewBox="-30 -30 500 500" style="pointer-events: all;">
	{#each boardData as tile}
		<HexagonTile {tile} />
	{/each}
</svg>

<style>
	.board {
		width: 90%;
		height: auto;
		pointer-events: all;
	}
</style>
