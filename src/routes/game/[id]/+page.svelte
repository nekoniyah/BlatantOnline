<!-- src/routes/+page.svelte -->
<script lang="ts">
	import Board from '../../../components/game/Board.svelte';
	import Navbar from '../../../components/common/Navbar.svelte';
	import Hand from '../../../components/game/Hand.svelte';
	import EnergyDisplay from '../../../components/game/EnergyDisplay.svelte';
	import { socket as socketFunction } from '$lib/socket';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { pawns } from '../../../stores/pawnStore';
	import { gameStore, initialized, type GameState } from '../../../stores/gameStore';
	import { socket } from '../../../stores/socket';

	export let data;

	let ready = false;
	let btnPlay: HTMLButtonElement | null = null;

	async function verifyId() {
		if (data.id && data.id.toUpperCase() === data.id && data.id.length === 6) {
			return true;
		}

		await goto('/');
		return false;
	}

	if (data.id) {
		verifyId();

		onMount(() => {
			let s = socketFunction();
			socket.set(s);

			s.emit('join', data.id);

			s.on('start', (room: GameState) => {
				gameStore.update(() => {
					return {
						...room
					};
				});

				initialized.set(true);

				s.on('move', (data: { id: string; position: [number, number] }) => {
					pawns.update((pawns) => {
						let pawn = pawns.find((pawn) => pawn.id === data.id);
						if (pawn) pawn.position = data.position;

						return pawns;
					});
				});
			});

			if (typeof btnPlay !== 'undefined') {
				btnPlay!.addEventListener('click', () => {
					ready = true;
					s.emit('ready');
				});
			}
		});
	}
</script>

<Navbar />

{#if !$initialized}
	{#key ready}
		{#if !ready}
			<div class="loader">
				<p>Are you ready to play?</p>
				<button bind:this={btnPlay} class="btn">Lock in</button>
			</div>
		{:else}
			<div class="loader">
				<p>Waiting for opponent...</p>
			</div>
		{/if}
	{/key}
{/if}

{#if $initialized}
	<div class="game-container">
		<Board />
		<EnergyDisplay />
		<Hand />
	</div>
{/if}

<style lang="scss">
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(.loader) {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;

		p {
			font-size: 2rem;
			margin-bottom: 2rem;
		}

		.btn {
			font-size: 1.5rem;
			padding: 1rem 2rem;
			border: none;
			border-radius: 0.5rem;
			background-color: #0077ff;
			color: #fff;
			cursor: pointer;
		}
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
