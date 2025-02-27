<!-- src/components/game/EnergyDisplay.svelte -->
<script lang="ts">
	import { gameStore } from '../../stores/gameStore';
	import { selectedPawn } from '../../stores/pawnStore';
	import { socket } from '../../stores/socket';

	let currentPlayerEnergy = 0;
	let currentPlayerName = '';

	if ($gameStore.players.length > 0) {
		currentPlayerName = $gameStore.players[$gameStore.currentPlayer].name;
		currentPlayerEnergy = $gameStore.players[$gameStore.currentPlayer].energy;
	}

	function endTurn() {
		selectedPawn.set(null);
		$socket!.emit('end_turn', currentPlayerName);

		gameStore.update((state) => {
			state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
			return state;
		});
	}
</script>

{#if $socket}
	<div class="energy-display">
		<button class="end-turn-btn" on:click={endTurn}>End Turn</button>
		<div class="energy">
			<img src="/bolt.svg" alt="Energy" width="20" height="20" />
			<span>Energy: {currentPlayerEnergy}</span>
		</div>
	</div>
{/if}

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
