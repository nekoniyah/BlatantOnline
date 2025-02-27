<script lang="ts">
	import { onMount } from 'svelte';
	import Navbar from '../../components/common/Navbar.svelte';

	let roomId = '';

	let letters = '0123456789ABCDEF';

	for (let i = 0; i < 6; i++) {
		roomId += letters[Math.floor(Math.random() * 16)];
	}

	let joinBtn: HTMLButtonElement | null = null;

	onMount(() => {
		if (joinBtn) {
			joinBtn.addEventListener('click', () => {
				window.location.href = `/game/${roomId}`;
			});
		}
	});
</script>

<Navbar />
<div class="container">
	<h1>Game</h1>
	<div class="room-enter-box">
		<input
			type="text"
			placeholder="Room ID"
			bind:value={roomId}
			maxlength="6"
			on:input={(event) => {
				//@ts-ignore
				event!.target!.value = event!.target!.value.toUpperCase();
			}}
		/>
		<button bind:this={joinBtn}>Join</button>
	</div>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;

		h1 {
			margin-bottom: 2rem;
			font-size: 2rem;
			font-family: sans-serif;
		}

		.room-enter-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
			margin-bottom: 2rem;

			input {
				padding: 0.5rem;
				border: 1px solid #ccc;
				border-radius: 4px;
				font-size: 1rem;
				width: 200px;
			}

			button {
				padding: 0.5rem 1rem;
				border: none;
				border-radius: 4px;
				background-color: #007bff;
				color: #fff;
				font-size: 1rem;
				cursor: pointer;
			}
		}
	}
</style>
