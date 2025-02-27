<script lang="ts">
	import type { HexTile } from '../../types/game';
	import TileIcon from './TileIcon.svelte';
	import Pawn from './Pawn.svelte';
	import { pawns, selectedPawn } from '../../stores/pawnStore';
	import { socket } from '../../stores/socket';

	export let tile: HexTile;

	const hexSize = 30;
	const hexWidth = Math.sqrt(3) * hexSize;
	const hexHeight = 2 * hexSize;

	function hexToPixel(q: number, r: number) {
		// Flat-topped hexagon coordinates
		const x = hexWidth * (q + r / 2);
		const y = hexHeight * ((r * 3) / 4);
		return { x, y };
	}

	let validMove: boolean = false;

	$: if ($selectedPawn && $socket) {
		isValidMove($selectedPawn.position, [tile.q, tile.r]);
	}

	function isValidMove(pawnPos: [number, number], targetPos: [number, number]) {
		$socket?.emit('check_valid_move', pawnPos, targetPos, (isValid: boolean) => {
			validMove = isValid;
		});
	}

	function handleTileClick() {
		if (!$selectedPawn || !$socket) return;

		const targetPos: [number, number] = [tile.q, tile.r];

		if ($selectedPawn.position[0] === targetPos[0] && $selectedPawn.position[1] === targetPos[1]) {
			return;
		}

		$socket.emit('move', {
			id: $selectedPawn.id,
			position: targetPos
		});
	}

	$: currentPawn = $pawns.find((p) => p.position[0] === tile.q && p.position[1] === tile.r);

	const { x, y } = hexToPixel(tile.q, tile.r);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<g
	class="hex {tile.color}{$selectedPawn && validMove ? ' valid-move' : ''}"
	transform="translate({x}, {y})"
	style="pointer-events: all;"
	on:click={handleTileClick}
>
	<polygon
		points={`
		0,-${hexSize} 
		${hexWidth / 2},-${hexSize / 2} 
		${hexWidth / 2},${hexSize / 2} 
		0,${hexSize} 
		-${hexWidth / 2},${hexSize / 2} 
		-${hexWidth / 2},-${hexSize / 2}
	`}
	/>
	{#if tile.icon}
		<TileIcon hex={tile} />
	{/if}
	{#if currentPawn}
		<Pawn pawn={currentPawn} />
	{/if}
</g>

<style lang="scss">
	.hex {
		stroke: #333;
		stroke-width: 2;
		fill: white;
		transition: all 0.2s ease-in-out;
		filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));

		&:hover {
			cursor: pointer;
			opacity: 0.9;
			vector-effect: non-scaling-stroke;
			stroke-width: 3;
			filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
			transform: translateY(-2px);
		}

		&.valid-move {
			stroke-width: 3;
			stroke: #4caf50;
			filter: drop-shadow(0 0 8px rgba(76, 175, 80, 0.5));
		}
	}

	.hex.red {
		fill: #d32f2f;
	}
	.hex.blue {
		fill: #1976d2;
	}
	.hex.purple {
		fill: #bd19d2;
	}
	.hex.green {
		fill: #388e3c;
	}
	.hex.black {
		fill: #333;
	}
	.hex.yellow {
		fill: #fbc02d;
	}
</style>
