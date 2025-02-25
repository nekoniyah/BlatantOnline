<!-- src/components/game/EnergyDisplay.svelte -->
<script lang="ts">
	import { gameActions, gameStore } from '../../stores/gameStore';
	import { selectedPawn } from '../../stores/pawnStore';

	let currentPlayerEnergy = 0;
	let currentPlayerName = '';

	gameStore.subscribe((state) => {
		if (state.players.length > 0) {
			currentPlayerName = state.players[state.currentPlayer].name;
			currentPlayerEnergy = state.players[state.currentPlayer].energy;
		}
	});

	function endTurn() {
		selectedPawn.set(null);
		gameActions.endTurn();
	}
</script>

<div class="energy-display">
	<button class="end-turn-btn" on:click={endTurn}>End Turn</button>
	<div class="energy">
		<img src="/bolt.svg" alt="Energy" width="20" height="20" />
		<span>Energy: {currentPlayerEnergy}</span>
	</div>
</div>

<style lang="scss">
	.energy-display {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;

		top: 90px;
		right: 20px;
		background-color: rgba(255, 255, 255, 0.9);
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

		.energy {
			padding: 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}

	.end-turn-btn {
		padding: 10px 20px;
		background-color: #4444ff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		font-weight: bold;
	}

	.end-turn-btn:hover {
		background-color: #3333cc;
	}
</style>
