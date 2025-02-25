<script lang="ts">
	import { boardData } from '$lib/boardData';
	import { gameActions } from '../../stores/gameStore';
	import HexagonTile from './HexagonTile.svelte';

	gameActions.initGame(['Player 1', 'Player 2']);
</script>

<svg class="board" viewBox="-100 -100 1000 1000">
	{#each boardData as tile}
		<HexagonTile {tile} />
	{/each}
</svg>

<style>
	.board {
		position: absolute;
		top: calc(50% + 30px);
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50%;
		pointer-events: all;
	}
</style>
