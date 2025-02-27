<script lang="ts">
	// import { Card } from '$lib/lib';
	import { gameStore } from '../../stores/gameStore';

	export let card: any;
	export let index: number;

	function playCard() {
		// gameStore.update((state) => {
		// 	const currentPlayer = state.players[state.currentPlayer];
		// 	if (
		// 		currentPlayer.playCard(index, state, () => {
		// 			// Callback after card effect is applied
		// 			console.log(`Card ${card.name} played successfully`);
		// 		})
		// 	) {
		// 		// Card played successfully
		// 	} else {
		// 		alert('Not enough energy to play this card!');
		// 	}
		// 	return state;
		// });
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="card" on:click={playCard}>
	<!-- <div class="card-header">
		<h3>{card.name}</h3>
		<span class="cost">{card.cost}</span>
	</div>
	<div class="card-body">
		<img src={card.image} alt="" />
	</div> -->
</div>

<style>
	.card {
		width: 150px;
		height: 200px;
		border-radius: 10px;
		padding: 10px;
		margin: 5px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		transition: transform 0.2s;
		background-color: #f5f5f5;
	}

	.card:hover {
		transform: translateY(-5px);
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.card-header h3 {
		margin: 0;
		font-size: 16px;
	}

	.cost {
		background-color: #ffcc00;
		border-radius: 50%;
		width: 25px;
		height: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
	}

	.card-body {
		font-size: 14px;
	}

	.card.move {
		background-color: #e6f7ff;
	}

	.card.energy {
		background-color: #ffffcc;
	}

	.card.attack {
		background-color: #ffe6e6;
	}

	.card.defense {
		background-color: #e6ffe6;
	}

	.card.special {
		background-color: #f2e6ff;
	}
</style>
