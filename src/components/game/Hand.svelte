<!-- src/components/game/Hand.svelte -->
<!--
  @component Hand
  @description A component that displays the current player's hand of cards.
  Features a collapsible interface with a hamburger menu for showing/hiding cards.
  Subscribes to the game store to keep the displayed hand in sync with game state.
-->
<script lang="ts">
	import { gameStore } from '../../stores/gameStore';
	import CardComponent from './Card.svelte';

	// Array to store the current player's cards
	let currentPlayerHand: any[] = [];

	// Subscribe to game state changes to update the hand display
	gameStore.subscribe((state) => {
		if (!state) return;

		if (state.players.length > 0) {
			currentPlayerHand = state.players[state.currentPlayer].hand;
		}
	});

	// State for controlling hand visibility
	let hidden = true;

	/**
	 * Toggles the visibility of the cards in hand
	 */
	function showCards() {
		hidden = !hidden;
	}

	export let isActive: boolean;
</script>

<div class="hand-container">
	<div class="hand-header">
		<h3>Your Hand</h3>
		<button class="toggle-button" on:click={showCards} aria-label="Toggle hand">
			<!-- svelte-ignore element_invalid_self_closing_tag -->
			<div class="arrow" class:up={!hidden} />
		</button>
	</div>
	{#if !hidden}
		<div class="cards">
			{#each currentPlayerHand as card, i}
				<CardComponent {card} index={i} />
			{/each}
		</div>
	{/if}
</div>

<style lang="scss">
	/* Container for the entire hand component */
	.hand-container {
		position: fixed;
		bottom: 0;
		width: 100vw;
		background-color: var(--color-tertiary);
		border-top: 2px solid var(--color-secondary-gold);
		box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
		transition: transform 0.3s ease;
		z-index: 100;
	}

	/* Header section with title and hamburger menu */
	.hand-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 20px;
		background-color: rgba(15, 15, 15, 0.95);

		h3 {
			color: var(--color-secondary-gold);
			margin: 0;
			font-size: 1.2rem;
			text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
		}
	}

	.toggle-button {
		background: none;
		border: none;
		cursor: pointer;
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.3s ease;

		&:hover {
			transform: translateY(-2px);
		}
	}

	.arrow {
		width: 0;
		height: 0;
		border-left: 8px solid transparent;
		border-right: 8px solid transparent;
		border-bottom: 8px solid var(--color-secondary-gold);
		transform: rotate(180deg);
		transition: transform 0.3s ease;
		filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.3));

		&.up {
			transform: rotate(0);
		}
	}

	/* Horizontal scrollable container for cards */
	.cards {
		display: flex;
		overflow-x: auto;
		padding: 20px;
		gap: 20px;
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;

		/* Scrollbar styling */
		&::-webkit-scrollbar {
			height: 8px;
		}

		&::-webkit-scrollbar-track {
			background: var(--color-tertiary);
			border-radius: 4px;
		}

		&::-webkit-scrollbar-thumb {
			background: var(--color-secondary-gold);
			border-radius: 4px;

			&:hover {
				background: var(--color-secondary-red);
			}
		}
	}

	@media (max-width: 768px) {
		.hand-container {
			max-height: 60vh;
		}

		.cards {
			padding: 10px;
			gap: 10px;
		}
	}
</style>
