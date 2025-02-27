<script lang="ts">
	import type { HexTile } from '../../types/game';
	import TileIcon from './TileIcon.svelte';
	import Pawn from './Pawn.svelte';
	import { pawns, selectedPawn } from '../../stores/pawnStore';
	import { socket } from '../../stores/socket';

	export let tile: HexTile;

	const hexSize = 30;
	const hexWidth = Math.sqrt(3) * hexSize;
	const hexHeight = 2 * hexSize * 0.75;

	function hexToPixel(q: number, r: number) {
		return {
			x: q * hexWidth + (r % 2 ? hexWidth / 2 : 0),
			y: r * hexHeight
		};
	}

	let validMove: boolean = false;

	function isValidMove(pawnPos: [number, number], targetPos: [number, number]) {
		$socket!.emit('check_valid_move', pawnPos, targetPos, (isValid: boolean) => {
			validMove = isValid;
		});
	}

	function handleTileClick() {
		if (!$selectedPawn) return;

		const targetPos: [number, number] = [tile.q, tile.r];

		if ($selectedPawn.position[0] === targetPos[0] && $selectedPawn.position[1] === targetPos[1]) {
			return;
		}

		$socket!.emit('move', {
			id: $selectedPawn.id,
			position: targetPos
		});
	}

	$: currentPawn = $pawns.find((p) => p.position[0] === tile.q && p.position[1] === tile.r);
</script>

{#if $socket}
	{#await hexToPixel(tile.q, tile.r) then { x, y }}
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<g
			on:load={() => {
				isValidMove($selectedPawn!.position, [tile.q, tile.r]);
			}}
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
	{/await}
{/if}

<style lang="scss">
	.hex {
		stroke: black;
		stroke-width: 1;
		fill: white;
		transition: all 0.2s ease-in-out;

		&:hover {
			cursor: pointer;
			opacity: 0.8;
			vector-effect: non-scaling-stroke;
			stroke-width: 2;
		}

		&.valid-move {
			stroke-width: 3;
			opacity: 0.8;
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
