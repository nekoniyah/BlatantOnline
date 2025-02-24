<script lang="ts">
	import type { HexTile } from '../../types/game';
	import TileIcon from './TileIcon.svelte';
	import Pawn from './Pawn.svelte';
	import { pawns, selectedPawn } from '../../stores/pawnStore';

	export let tile: HexTile;

	const hexSize = 10;
	const hexWidth = Math.sqrt(3) * hexSize;
	const hexHeight = 2 * hexSize * 0.75;

	function hexToPixel(q: number, r: number) {
		return {
			x: q * hexWidth + (r % 2 ? hexWidth / 2 : 0),
			y: r * hexHeight
		};
	}

	// Check if move is valid (adjust rules as needed)
	function isValidMove(from: [number, number], to: [number, number]): boolean {
		const [fromQ, fromR] = from;
		const [toQ, toR] = to;

		// Simple rule: can only move to adjacent tiles
		const dQ = Math.abs(fromQ - toQ);
		const dR = Math.abs(fromR - toR);

		return dQ <= 1 && dR <= 1 && tile.color !== 'black';
	}

	function handleTileClick() {
		if ($selectedPawn && isValidMove($selectedPawn.position, [tile.q, tile.r])) {
			pawns.set(
				$pawns.map((p) => {
					if (p.id === $selectedPawn.id) {
						return { ...p, position: [tile.q, tile.r] };
					}
					return p;
				})
			);

			// selectedPawn.set(null);
		}
	}

	$: currentPawn = $pawns.find((p) => p.position[0] === tile.q && p.position[1] === tile.r);
</script>

{#await hexToPixel(tile.q, tile.r) then { x, y }}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<g
		class="hex {tile.color}{$selectedPawn && isValidMove($selectedPawn.position, [tile.q, tile.r])
			? ' valid-move'
			: ''}"
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
			<Pawn pawn={currentPawn} {tile} />
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
