<!-- src/components/game/Hand.svelte -->
<script lang="ts">
	import { gameStore } from '../../stores/gameStore';
	import CardComponent from './Card.svelte';

	let currentPlayerHand: any[] = [];

	gameStore.subscribe((state) => {
		if (!state) return;

		if (state.players.length > 0) {
			currentPlayerHand = state.players[state.currentPlayer].hand;
		}
	});

	let hidden = true;

	function showCards() {
		hidden = !hidden;
	}
</script>

<div class="hand-container">
	<div class="hand-header">
		<h3>Your Hand</h3>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="hamburger" on:click={showCards}>
			<div class="bar"></div>
			<div class="bar"></div>
			<div class="bar"></div>
		</div>
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
	.hand-container {
		position: absolute;
		bottom: 0;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.9);
		padding: 10px;
		border-top: 2px solid #ccc;

		.hand-header {
			display: flex;
			justify-content: space-between;
			padding-inline: 10px;
			align-items: center;

			.hamburger {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 20px;
				width: 20px;

				.bar {
					height: 2px;
					width: 100%;
					background-color: #333;
				}
			}
		}
	}

	.cards {
		display: flex;
		overflow-x: auto;
		padding: 10px 0;
	}
</style>
