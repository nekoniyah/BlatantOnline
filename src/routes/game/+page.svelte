<!--
  @component Game Page
  @description The game lobby page where players can create or join game rooms.
  Features room creation, joining, and recent games list.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import Navbar from '../../components/common/Navbar.svelte';
	import { socket } from '$lib/socket';
	import '../../styles/global.css';
	import type { Socket } from 'socket.io-client';

	let io: Socket | null = null;
	// Room management
	let roomId = '';
	let isCreatingRoom = false;
	let errorMessage = '';
	let playerName = '';
	let players: { id: string; name: string; ready: boolean }[] = [];
	let isReady = false;
	let recentGames: { id: string; players: number; date: string }[] = [];

	interface RoomData {
		roomId: string;
		players: { id: string; name: string; ready: boolean }[];
	}

	interface PlayerData {
		id: string;
		name: string;
		ready: boolean;
	}

	interface ErrorData {
		message: string;
	}

	// Generate random room ID
	function generateRoomId() {
		const letters = '0123456789ABCDEF';
		let id = '';
		for (let i = 0; i < 6; i++) {
			id += letters[Math.floor(Math.random() * 16)];
		}
		return id;
	}

	roomId = generateRoomId();

	// Room actions
	function createRoom() {
		if (!io) return;
		isCreatingRoom = true;
		roomId = generateRoomId();
		io.emit('create_room', { roomId });
		setTimeout(() => {
			window.location.href = `/game/${roomId}`;
		}, 1000);
	}

	function joinRoom() {
		if (!io) return;
		if (roomId.length !== 6) {
			errorMessage = 'Room ID must be 6 characters long';
			return;
		}
		io.emit('join_room', { roomId });
		window.location.href = `/game/${roomId}`;
	}

	function updatePlayerName() {
		if (!io || !playerName.trim()) {
			errorMessage = 'Please enter a valid name';
			return;
		}
		io.emit('update_name', { roomId, name: playerName });
	}

	function handleReady() {
		if (!io || !playerName.trim()) {
			errorMessage = 'Please enter your name first';
			return;
		}
		isReady = !isReady;
		io.emit('ready', { roomId });
	}

	function startGame() {
		if (!io) return;
		if (players.length < 2) {
			errorMessage = 'Need at least 2 players to start';
			return;
		}
		if (!players.every((p) => p.ready)) {
			errorMessage = 'All players must be ready';
			return;
		}
		io.emit('start_game', { roomId });
	}

	// Load recent games (mock data for now)
	onMount(() => {
		io = socket();

		if (io) {
			io.on('room_created', (data: RoomData) => {
				console.log('Room created:', data);
				players = data.players;
			});

			io.on('room_joined', (data: RoomData) => {
				console.log('Room joined:', data);
				players = data.players;
			});

			io.on('player_updated', (data: RoomData) => {
				players = data.players;
			});

			io.on('error', (error: ErrorData) => {
				errorMessage = error.message;
			});
		}

		recentGames = [
			{ id: 'ABC123', players: 4, date: '2 mins ago' },
			{ id: 'DEF456', players: 2, date: '5 mins ago' },
			{ id: 'GHI789', players: 3, date: '10 mins ago' }
		];
	});
</script>

<Navbar />

{#if io}
	<div class="container" in:fade={{ duration: 300 }}>
		<div class="content">
			<div class="left-panel" in:fly={{ x: -50, duration: 500, delay: 300 }}>
				<h2>Recent Games</h2>
				<div class="recent-games">
					{#each recentGames as game}
						<div class="game-item">
							<span class="room-id">{game.id}</span>
							<span class="players">{game.players} players</span>
							<span class="time">{game.date}</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="main-panel" in:fly={{ y: 50, duration: 500, delay: 300 }}>
				<h1>Join Game</h1>
				<div class="room-enter-box" class:creating={isCreatingRoom}>
					<div class="input-group">
						<input
							type="text"
							placeholder="Enter Room ID"
							bind:value={roomId}
							maxlength="6"
							on:input={(event) => {
								const target = event.target as HTMLInputElement;
								target.value = target.value.toUpperCase();
								errorMessage = '';
							}}
						/>
						<button class="refresh" on:click={() => (roomId = generateRoomId())}> ↻ </button>
					</div>

					{#if errorMessage}
						<p class="error" in:fade>{errorMessage}</p>
					{/if}

					<div class="buttons">
						<button class="join" on:click={joinRoom} disabled={isCreatingRoom}>
							{#if isCreatingRoom}
								<span class="loader"></span>
							{:else}
								Join Room
							{/if}
						</button>
						<button class="create" on:click={createRoom} disabled={isCreatingRoom}>
							Create New Room
						</button>
					</div>
				</div>

				<!-- Loading screen -->
				<div class="loading-screen" in:fade|local={{ duration: 300 }}>
					<span class="loader"></span>
				</div>

				{#if players.length >= 2 && players.every((p) => p.ready)}
					<button class="start-btn" on:click={startGame}>Start Game</button>
				{/if}
			</div>
		</div>

		<div class="right-panel" in:fly={{ x: 50, duration: 500, delay: 300 }}>
			<h2>How to Play</h2>
			<div class="instructions">
				<div class="step">
					<span class="number">1</span>
					<p>Create a new room or join an existing one using a Room ID</p>
				</div>
				<div class="step">
					<span class="number">2</span>
					<p>Share the Room ID with your friends to play together</p>
				</div>
				<div class="step">
					<span class="number">3</span>
					<p>Wait for all players to join and start the game</p>
				</div>
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.container {
		min-height: calc(100vh - 70px);
		padding: 2rem;
		background-color: var(--color-tertiary);
		background-image: radial-gradient(
			circle at 50% 50%,
			rgba(255, 215, 0, 0.1) 0%,
			transparent 50%
		);
	}

	.content {
		max-width: 1400px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: 300px 1fr 300px;
		gap: 2rem;
		height: 100%;
	}

	.left-panel,
	.right-panel,
	.main-panel {
		background: rgba(15, 15, 15, 0.7);
		border-radius: 12px;
		padding: 2rem;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 215, 0, 0.1);
	}

	h1,
	h2 {
		color: var(--color-secondary-gold);
		margin-bottom: 1.5rem;
		text-align: center;
		text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
	}

	.room-enter-box {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		align-items: center;

		&.creating {
			opacity: 0.7;
			pointer-events: none;
		}
	}

	:global(.input-group) {
		position: relative;
		width: 100%;
		max-width: 300px;

		input {
			width: 100%;
			padding: 1rem;
			border: 2px solid var(--color-secondary-gold);
			border-radius: 8px;
			background: rgba(15, 15, 15, 0.8);
			color: var(--color-main);
			font-size: 1.2rem;
			text-align: center;
			letter-spacing: 4px;
			transition: all 0.3s ease;

			&:focus {
				outline: none;
				border-color: var(--color-secondary-red);
				box-shadow: 0 0 15px rgba(255, 68, 68, 0.3);
			}
		}

		.refresh {
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
			background: none;
			border: none;
			color: var(--color-secondary-gold);
			cursor: pointer;
			font-size: 1.2rem;
			padding: 5px;
			transition: all 0.3s ease;

			&:hover {
				transform: translateY(-50%) rotate(180deg);
				color: var(--color-secondary-red);
			}
		}
	}

	.error {
		color: var(--color-secondary-red);
		font-size: 0.9rem;
		margin-top: -1rem;
	}

	:global(.buttons) {
		display: flex;
		gap: 1rem;
		width: 100%;
		max-width: 300px;

		button {
			flex: 1;
			padding: 1rem;
			border: none;
			border-radius: 8px;
			font-size: 1rem;
			cursor: pointer;
			transition: all 0.3s ease;

			&.join {
				background: var(--color-secondary-gold);
				color: var(--color-tertiary);

				&:hover {
					background: #e6c200;
					transform: translateY(-2px);
				}
			}

			&.create {
				background: transparent;
				border: 2px solid var(--color-secondary-gold);
				color: var(--color-secondary-gold);

				&:hover {
					background: var(--color-secondary-gold);
					color: var(--color-tertiary);
					transform: translateY(-2px);
				}
			}

			&:disabled {
				opacity: 0.5;
				cursor: not-allowed;
				transform: none;
			}
		}
	}

	.recent-games {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		.game-item {
			padding: 1rem;
			background: rgba(255, 215, 0, 0.1);
			border-radius: 8px;
			display: grid;
			grid-template-columns: 1fr auto auto;
			gap: 1rem;
			align-items: center;
			transition: all 0.3s ease;

			&:hover {
				background: rgba(255, 215, 0, 0.2);
				transform: translateX(5px);
			}

			.room-id {
				color: var(--color-secondary-gold);
				font-weight: bold;
			}

			.players,
			.time {
				color: var(--color-main);
				font-size: 0.9rem;
				opacity: 0.8;
			}
		}
	}

	.instructions {
		.step {
			display: flex;
			gap: 1rem;
			margin-bottom: 1.5rem;
			padding: 1rem;
			background: rgba(255, 215, 0, 0.1);
			border-radius: 8px;
			transition: all 0.3s ease;

			&:hover {
				background: rgba(255, 215, 0, 0.2);
				transform: translateX(-5px);
			}

			.number {
				width: 30px;
				height: 30px;
				background: var(--color-secondary-gold);
				color: var(--color-tertiary);
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
			}

			p {
				margin: 0;
				color: var(--color-main);
			}
		}
	}

	.loader {
		width: 20px;
		height: 20px;
		border: 3px solid var(--color-tertiary);
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 1200px) {
		.content {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.left-panel,
		.right-panel {
			max-width: 600px;
			margin: 0 auto;
			width: 100%;
		}
	}

	@media (max-width: 480px) {
		.container {
			padding: 1rem;
		}

		.buttons {
			flex-direction: column;
		}

		.input-group input {
			font-size: 1rem;
			letter-spacing: 2px;
		}
	}
</style>
