<script lang="ts">
	import { boardData } from '$lib/boardData';
	import HexagonTile from './HexagonTile.svelte';
	import { pawns, selectedPawn } from '../../stores/pawnStore';
</script>

<div class="board-container">
	<svg class="board" viewBox="-30 -30 500 500">
		{#each boardData as tile}
			<HexagonTile {tile} />
		{/each}
	</svg>
</div>

<style>
	.board-container {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
	}

	.board {
		width: 90%;
		height: auto;
	}
</style>
