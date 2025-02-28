<script lang="ts">
	import { pawns } from '../../stores/pawnStore';
	import type { HexTile } from '../../types/game';
	import Pawn from './Pawn.svelte';
	import TileIcon from './TileIcon.svelte';

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

	$: currentPawn = $pawns.find((p) => p.position[0] === tile.q && p.position[1] === tile.r);
</script>

{#await hexToPixel(tile.q, tile.r) then { x, y }}
	<g class="hex {tile.color}" transform="translate({x}, {y})">
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
			stroke: #4caf50;
			stroke-width: 2;
			opacity: 0.8;
		}
	}

	.hex.green {
		fill: #388e3c;
	}

	.hex.blue {
		fill: #2196f3;
	}

	.hex.red {
		fill: #f44336;
	}

	.hex.yellow {
		fill: #ffeb3b;
	}

	.hex.purple {
		fill: #9c27b0;
	}
</style>
