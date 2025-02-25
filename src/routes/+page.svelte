<!-- src/routes/+page.svelte -->
<script>
	import Board from '../components/game/Board.svelte';
	import Navbar from '../components/common/Navbar.svelte';
	import Hand from '../components/game/Hand.svelte';
	import EnergyDisplay from '../components/game/EnergyDisplay.svelte';
	import { gameStore, gameActions } from '../stores/gameStore';
	import { onMount } from 'svelte';

	onMount(() => {
		// Initialize game with 2 players for testing
		gameActions.initGame(['Player 1', 'Player 2']);
	});
</script>

<Navbar />
<div class="game-container">
	<Board />
	<EnergyDisplay />
	<Hand />
</div>

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		line-height: 1.6;
	}

	.game-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
		height: calc(100vh - 60px); /* Adjust based on navbar height */
	}
</style>
