<script lang="ts">
	import type { HexTile } from '../../types/game';
	import TileIcon from './TileIcon.svelte';

	export let tile: HexTile;

	const hexSize = 10; // Hexagon radius
	const hexWidth = Math.sqrt(3) * hexSize;
	const hexHeight = 2 * hexSize * 0.75;

	function hexToPixel(q: number, r: number) {
		return {
			x: q * hexWidth + (r % 2 ? hexWidth / 2 : 0),
			y: r * hexHeight
		};
	}
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
	</g>
{/await}

<style lang="scss">
	.hex {
		stroke: black;
		stroke-width: 1;
		fill: white;
		transition: opacity 0.2s ease-in-out;

		&:hover {
			cursor: pointer;
			opacity: 0.8;
			vector-effect: non-scaling-stroke;
			stroke-width: 2;
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
