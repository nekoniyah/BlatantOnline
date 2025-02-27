<!--
  @component Card
  @description A game card component that represents a playable card in the game.
  The card can be clicked to be played and includes visual feedback on hover.

  @prop {any} card - The card data object containing card properties
  @prop {number} index - The index of the card in the player's hand
-->
<script lang="ts">
	// import { Card } from '$lib/lib';
	import { gameStore } from '../../stores/gameStore';

	export let card: any;
	export let index: number;

	/**
	 * Handles the card play action when clicked.
	 * Currently commented out implementation would:
	 * 1. Update the game state
	 * 2. Check if the player has enough energy
	 * 3. Apply the card's effect
	 */
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

<!-- Accessibility exceptions for game interaction -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="card" on:click={playCard}>
	<div class="card-header">
		<h3>{card.name}</h3>
		<span class="cost">{card.cost}</span>
	</div>
	<div class="card-body">
		<img src={card.image} alt="" />
	</div>
</div>

<style>
	/* Card container with hover effects */
	.card {
		width: 150px;
		height: 200px;
		border-radius: 10px;
		padding: 10px;
		margin: 5px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		cursor: pointer;
		transition: all 0.3s ease;
		background-color: var(--color-tertiary);
		border: 2px solid var(--color-secondary-gold);
		color: var(--color-main);
		position: relative;
		overflow: hidden;
	}

	.card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			45deg,
			transparent 0%,
			rgba(255, 215, 0, 0.1) 50%,
			transparent 100%
		);
		transform: translateX(-100%);
		transition: transform 0.6s ease;
	}

	.card:hover {
		transform: translateY(-5px) scale(1.02);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
		border-color: var(--color-secondary-red);
	}

	.card:hover::before {
		transform: translateX(100%);
	}

	/* Card header layout */
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		border-bottom: 1px solid var(--color-secondary-gold);
		padding-bottom: 5px;
	}

	.card-header h3 {
		margin: 0;
		font-size: 16px;
		color: var(--color-secondary-gold);
		text-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
	}

	/* Energy cost display */
	.cost {
		background-color: var(--color-secondary-red);
		color: var(--color-main);
		border-radius: 50%;
		width: 25px;
		height: 25px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		box-shadow: 0 0 10px rgba(255, 68, 68, 0.3);
	}

	.card-body {
		display: flex;
		justify-content: center;
		align-items: center;
		height: calc(100% - 40px);
	}

	.card-body img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		filter: drop-shadow(0 0 2px var(--color-secondary-gold));
	}

	/* Card type-specific background colors */
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
