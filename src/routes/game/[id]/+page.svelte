<!-- src/routes/game/[id]/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { page } from '$app/state';
	import Navbar from '../../../components/common/Navbar.svelte';
	import Board from '../../../components/game/Board.svelte';
	import Hand from '../../../components/game/Hand.svelte';
	import { socket } from '$lib/socket';
	import '../../../styles/global.css';
	import EnergyDisplay from '../../../components/game/EnergyDisplay.svelte';
	import type { Socket } from 'socket.io-client';

	// Room state
	interface Room {
		players: { id: string; name: string; ready: boolean; color: string; energy: number }[];
		pawns: { id: string; position: [number, number]; player: string }[];
		currentPlayer: number;
	}

	interface MoveData {
		id: string;
		position: [number, number];
	}

	const roomId = page.params.id;
	let isLoading = true;
	let gameStarted = false;
	let players: { id: string; name: string; ready: boolean; color: string; energy: number }[] = [];
	let chatMessages: { sender: string; message: string; timestamp: Date }[] = [];
	let currentMessage = '';

	// Game state
	let currentPlayer = 0;
	let remainingMoves = 3;
	let selectedPawn: { id: string; position: [number, number] } | null = null;
	let validMoves: [number, number][] = [];
	let pawns: { id: string; position: [number, number]; player: string }[] = [];
	let forcedLine = false;

	// Player state
	let playerName = '';
	let isReady = false;
	let playerId = '';
	let playerColor = '';

	// Game settings
	let settings = {
		turnTimeLimit: 60,
		enableSound: true,
		enableAnimations: true
	};

	// Socket connection
	let io: Socket | null = null;

	let currentPlayerId: string | undefined = '';
	let errorMessage = '';

	interface PlayerData {
		id: string;
		name: string;
		ready: boolean;
		socketId: string;
		color: string;
		energy: number;
	}

	interface RoomData {
		roomId: string;
		players: PlayerData[];
	}

	interface ErrorData {
		message: string;
	}

	interface GameState {
		roomId: string;
		players: PlayerData[];
		// Add other game state properties here
	}

	onMount(() => {
		io = socket();
		if (!io) return;

		// Set up socket event handlers
		io.on('connect', () => {
			if (!io) return;

			currentPlayerId = io.id;
			io.emit('join', { roomId });
		});

		io.on('player_updated', (data: RoomData) => {
			players = data.players;
			const currentPlayer = players.find((p) => p.id === currentPlayerId);
			if (currentPlayer) {
				isReady = currentPlayer.ready;
				playerName = currentPlayer.name;
			}
		});

		io.on('game_started', (state: GameState) => {
			gameStarted = true;
			players = state.players;
		});

		io.on('error', (error: ErrorData) => {
			errorMessage = error.message;
			setTimeout(() => {
				errorMessage = '';
			}, 3000);
		});

		io.on('move', (data: MoveData) => {
			const { id, position } = data;
			pawns = pawns.map((pawn) => (pawn.id === id ? { ...pawn, position } : pawn));
			selectedPawn = null;
			validMoves = [];
			if (players[currentPlayer].id === playerId) {
				remainingMoves--;
			}
		});

		io.on('end_turn', () => {
			currentPlayer = currentPlayer === 0 ? 1 : 0;
			remainingMoves = 3;
			forcedLine = false;
			selectedPawn = null;
			validMoves = [];
		});

		preloadAssets();
		// Simulate loading data
		setTimeout(() => {
			isLoading = false;
		}, 1000);

		// Cleanup on unmount
		return () => {
			io?.emit('leave', { roomId });
			io?.disconnect();
		};
	});

	// Board interaction handlers
	async function handlePawnClick(event: CustomEvent) {
		const pawn = event.detail;
		// Check if it's player's turn and pawn
		if (players[currentPlayer].id !== playerId || pawn.player !== playerColor) {
			return;
		}

		// Check if we have moves remaining
		if (remainingMoves <= 0) {
			return;
		}

		selectedPawn = { id: pawn.id, position: pawn.position };

		// Get valid moves for selected pawn
		const moves = await getValidMoves(pawn.position);
		validMoves = moves;
	}

	async function handleTileClick(event: CustomEvent) {
		const position = event.detail;
		if (
			!selectedPawn ||
			!validMoves.some((move) => move[0] === position[0] && move[1] === position[1])
		) {
			return;
		}

		const isValid = await checkValidMove(selectedPawn.position, position);
		if (!isValid) {
			return;
		}

		io?.emit('move', { id: selectedPawn.id, position });
	}

	async function getValidMoves(position: [number, number]): Promise<[number, number][]> {
		// Calculate valid moves based on game rules
		// This would need to be implemented based on your game's movement rules
		return [];
	}

	function handleReady() {
		if (!io || !playerName.trim()) {
			errorMessage = 'Please enter your name first';
			return;
		}
		io.emit('ready', { roomId });
	}

	function updatePlayerName() {
		if (!io || !playerName.trim()) {
			errorMessage = 'Please enter a valid name';
			return;
		}
		io.emit('update_name', { roomId, name: playerName.trim() });
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

	function endTurn() {
		if (!io || players[currentPlayer].id !== playerId) return;
		io.emit('end_turn');
	}

	async function checkValidMove(position1: [number, number], position2: [number, number]) {
		if (!io) return false;
		return new Promise((resolve) => {
			if (!io) return;

			io.emit('check_valid_move', position1, position2, (isValid: boolean) => {
				resolve(isValid);
			});
		});
	}

	async function checkTurn(playerName: string, pawnColor: string) {
		if (!io) return false;
		return new Promise((resolve) => {
			if (!io) return;
			io.emit('check_turn', playerName, pawnColor, () => {
				resolve(true);
			});
		});
	}

	// Auto-scroll chat
	let chatContainer: HTMLElement;
	$: if (chatContainer && chatMessages.length) {
		setTimeout(() => {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}, 0);
	}

	// Preload game assets
	function preloadAssets() {
		const images = ['/bolt.svg', '/bolt2.svg', '/draw.svg'];
		images.forEach((src) => {
			const img = new Image();
			img.src = src;
		});
	}

	function copyRoomId() {
		navigator.clipboard.writeText(roomId);
	}

	function updateSettings() {
		if (!io) return;
		io.emit('update_settings', { roomId, settings });
	}

	function sendMessage() {
		if (!io || !currentMessage.trim()) return;
		io.emit('chat_message', { roomId, message: currentMessage });
		currentMessage = '';
	}
</script>

<svelte:head>
	<style>
		:global(body) {
			overflow: hidden;
		}
	</style>
</svelte:head>

<Navbar />

<div class="game-container gpu-accelerated" in:fade|local={{ duration: 300 }}>
	{#if isLoading}
		<div class="loading-screen" in:fade|local={{ duration: 300 }}>
			<span class="loader"></span>
			<p>Loading game room...</p>
		</div>
	{:else}
		<div class="game-layout">
			<!-- Left Panel - Player List & Chat -->
			<div class="left-panel gpu-accelerated" in:fly|local={{ x: -50, duration: 500, delay: 300 }}>
				<!-- Room Info -->
				<div class="room-info">
					<h2>Room: {roomId}</h2>
					<button class="copy-btn" on:click={copyRoomId}> Copy ID </button>
				</div>

				<!-- Player List -->
				<div class="players-list">
					<h3>Players</h3>
					{#each players as player}
						<div class="player-item" style="border-color: {player.color}">
							<span class="player-name">{player.name || 'Anonymous'}</span>
							<span class="player-status" class:ready={player.ready}>
								{player.ready ? 'Ready' : 'Not Ready'}
							</span>
						</div>
					{/each}
				</div>

				<!-- Chat System -->
				<div class="chat-system">
					<h3>Chat</h3>
					<div class="chat-messages" bind:this={chatContainer}>
						{#each chatMessages as msg}
							<div class="message" in:slide|local>
								<span class="sender">{msg.sender}:</span>
								<span class="text">{msg.message}</span>
								<span class="time">
									{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
								</span>
							</div>
						{/each}
					</div>
					<div class="chat-input">
						<input
							type="text"
							placeholder="Type a message..."
							bind:value={currentMessage}
							on:keydown={(e) => e.key === 'Enter' && sendMessage()}
						/>
						<button on:click={sendMessage}>Send</button>
					</div>
				</div>
			</div>

			<!-- Main Game Area -->
			<div class="main-area gpu-accelerated" in:fly|local={{ y: 50, duration: 500, delay: 300 }}>
				{#if !gameStarted}
					<div class="pregame-screen">
						<h2>Waiting for players...</h2>
						<div class="player-setup">
							<input
								type="text"
								placeholder="Enter your name"
								bind:value={playerName}
								on:change={updatePlayerName}
								disabled={isReady}
							/>
							<button class="ready-btn" class:is-ready={isReady} on:click={handleReady}>
								{isReady ? 'Ready!' : 'Click when ready'}
							</button>
						</div>
						{#if players.every((p) => p.ready) && players.length >= 2}
							<button class="start-btn" on:click={startGame}>Start Game</button>
						{/if}
					</div>
				{:else}
					<Board />
				{/if}
			</div>

			<!-- Right Panel - Game Settings & Info -->
			<div class="right-panel gpu-accelerated" in:fly|local={{ x: 50, duration: 500, delay: 300 }}>
				<h3>Game Settings</h3>
				<div class="settings">
					<label class="setting-item">
						<span>Turn Time Limit</span>
						<input
							type="range"
							min="30"
							max="120"
							step="10"
							bind:value={settings.turnTimeLimit}
							on:change={updateSettings}
						/>
						<span>{settings.turnTimeLimit}s</span>
					</label>
					<label class="setting-item">
						<span>Sound Effects</span>
						<input type="checkbox" bind:checked={settings.enableSound} on:change={updateSettings} />
					</label>
					<label class="setting-item">
						<span>Animations</span>
						<input
							type="checkbox"
							bind:checked={settings.enableAnimations}
							on:change={updateSettings}
						/>
					</label>
				</div>

				<div class="game-info">
					<h3>Game Stats</h3>
					<div class="turn-info">
						<h3>Current Turn: {players[currentPlayer]?.name || 'Unknown'}</h3>
						{#if players[currentPlayer]?.id === playerId}
							<p>Moves Remaining: {remainingMoves}</p>
							<button class="end-turn-btn" on:click={endTurn} disabled={remainingMoves > 0}>
								End Turn
							</button>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Hand Component at the bottom -->
		{#if gameStarted}
			<div class="hand-wrapper gpu-accelerated" in:slide|local={{ duration: 300 }}>
				<EnergyDisplay value={players[currentPlayer].energy || 0} />
				<Hand isActive={players[currentPlayer]?.id === playerId} />
			</div>
		{/if}
	{/if}
</div>

<style lang="scss">
	/* Base styles */
	:global(body) {
		overflow-x: hidden;
		height: 100vh;
	}

	.game-container {
		background-color: var(--color-tertiary);
		background-image: radial-gradient(
			circle at 50% 50%,
			rgba(255, 215, 0, 0.1) 0%,
			transparent 50%
		);
		position: relative;
		transform: translate3d(0, 0, 0);
		will-change: transform;
		height: calc(100vh - 70px);
		width: 100%;
	}

	/* Loading screen */
	.loading-screen {
		height: calc(100vh - 70px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		color: var(--color-main);
		will-change: opacity;
	}

	.loading-screen p {
		color: var(--color-secondary-gold);
		font-size: 1.2rem;
	}

	/* Layout */
	:global(.game-layout) {
		display: flex;
		gap: 1rem;
		will-change: transform;
		justify-content: space-around;
		height: calc(100vh - 70px);
		width: 100%;
	}

	/* Panels */
	.left-panel,
	.right-panel,
	.main-area {
		background: rgba(15, 15, 15, 0.7);
		border-radius: 12px;
		padding: 1.5rem;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 215, 0, 0.1);
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		will-change: transform;
		transition: transform var(--transition-speed) var(--transition-timing);
		height: calc(100vh - 70px);
		width: 100%;
	}

	/* Hand wrapper */
	:global(.hand-wrapper) {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		will-change: transform;
		z-index: 100;
	}

	.room-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 215, 0, 0.2);
	}

	.room-info h2 {
		color: var(--color-secondary-gold);
		margin: 0;
		font-size: 1.2rem;
	}

	.room-info .copy-btn {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid var(--color-secondary-gold);
		color: var(--color-secondary-gold);
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.room-info .copy-btn:hover {
		background: var(--color-secondary-gold);
		color: var(--color-tertiary);
	}

	.players-list h3 {
		color: var(--color-secondary-gold);
		margin-bottom: 1rem;
	}

	.player-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.8rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 6px;
		margin-bottom: 0.5rem;
		border-left: 3px solid;
		transition: all 0.3s ease;
	}

	.player-item:hover {
		transform: translateX(5px);
	}

	.player-item .player-name {
		color: var(--color-main);
	}

	.player-item .player-status {
		font-size: 0.8rem;
		padding: 0.2rem 0.5rem;
		border-radius: 12px;
		background: rgba(255, 68, 68, 0.2);
		color: var(--color-secondary-red);
	}

	.player-item .player-status.ready {
		background: rgba(0, 255, 0, 0.2);
		color: #4caf50;
	}

	.chat-system {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.chat-system h3 {
		color: var(--color-secondary-gold);
		margin: 0;
	}

	.chat-messages {
		overflow-y: auto;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.chat-messages .message .sender {
		color: var(--color-secondary-gold);
		font-weight: bold;
	}

	.chat-messages .message .text {
		color: var(--color-main);
		margin-left: 0.5rem;
	}

	.chat-messages .message .time {
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.5);
		margin-left: 0.5rem;
	}

	.chat-input {
		display: flex;
		gap: 0.5rem;
	}

	.chat-input input {
		padding: 0.5rem;
		border: 1px solid var(--color-secondary-gold);
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.2);
		color: var(--color-main);
	}

	.chat-input input:focus {
		outline: none;
		border-color: var(--color-secondary-red);
	}

	.chat-input button {
		padding: 0.5rem 1rem;
		background: var(--color-secondary-gold);
		color: var(--color-tertiary);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.chat-input button:hover {
		transform: translateY(-2px);
	}

	.pregame-screen {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		height: 100%;
	}

	.pregame-screen h2 {
		color: var(--color-secondary-gold);
		text-align: center;
	}

	.player-setup {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
		max-width: 300px;
	}

	.player-setup input {
		padding: 1rem;
		border: 2px solid var(--color-secondary-gold);
		border-radius: 8px;
		background: rgba(15, 15, 15, 0.8);
		color: var(--color-main);
		font-size: 1.2rem;
		text-align: center;
	}

	.player-setup input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ready-btn {
		padding: 1rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		background: var(--color-secondary-red);
		color: var(--color-main);
	}

	.ready-btn.is-ready {
		background: #4caf50;
	}

	.ready-btn:hover {
		transform: translateY(-2px);
	}

	.start-btn {
		padding: 1rem 2rem;
		background: var(--color-secondary-gold);
		color: var(--color-tertiary);
		border: none;
		border-radius: 8px;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.start-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
	}

	.settings {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.setting-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		color: var(--color-main);
	}

	.setting-item input[type='range'] {
		flex: 1;
		accent-color: var(--color-secondary-gold);
	}

	.setting-item input[type='checkbox'] {
		width: 20px;
		height: 20px;
		accent-color: var(--color-secondary-gold);
	}

	.loader {
		width: 40px;
		height: 40px;
		border: 4px solid var(--color-main);
		border-top-color: var(--color-secondary-gold);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 1200px) {
		.game-layout {
			display: flex;
		}

		.left-panel {
			order: 2;
		}

		.main-area {
			order: 1;
		}

		.right-panel {
			order: 3;
		}
	}

	@media (max-width: 480px) {
		.game-layout {
			padding: 1rem;
			gap: 1rem;
		}

		.player-setup {
			width: 90%;
		}
	}

	/* Performance optimizations for animations */
	.player-item,
	.message,
	button,
	input {
		will-change: transform, opacity;
		transition: all var(--transition-speed) var(--transition-timing);
	}

	/* Smooth scrolling for chat */
	.chat-messages {
		scroll-behavior: smooth;
		-webkit-overflow-scrolling: touch;
	}

	.chat-messages::-webkit-scrollbar {
		width: 8px;
	}

	.chat-messages::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.2);
		border-radius: 4px;
	}

	.chat-messages::-webkit-scrollbar-thumb {
		background: var(--color-secondary-gold);
		border-radius: 4px;
	}

	.chat-messages::-webkit-scrollbar-thumb:hover {
		background: var(--color-secondary-red);
	}

	.turn-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 8px;
	}

	.turn-info h3 {
		color: var(--color-secondary-gold);
		margin: 0;
	}

	.end-turn-btn {
		padding: 0.5rem 1rem;
		background: var(--color-secondary-gold);
		color: var(--color-tertiary);
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.end-turn-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.end-turn-btn:not(:disabled):hover {
		transform: translateY(-2px);
	}
</style>
