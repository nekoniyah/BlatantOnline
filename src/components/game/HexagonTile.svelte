<script lang="ts">
	import type { HexTile } from '../../types/game';
	import TileIcon from './TileIcon.svelte';
	import Pawn from './Pawn.svelte';
	import { pawns, selectedPawn } from '../../stores/pawnStore';
	import { boardData } from '$lib/boardData';

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

	// Add these helper functions at the top of the script section
	function getNeighbors(q: number, r: number): [number, number][] {
		// All possible neighbors for a hex tile
		const directions = [
			[1, 0],
			[1, -1],
			[0, -1],
			[-1, 0],
			[-1, 1],
			[0, 1]
		];

		// If we're on an odd row, we need to shift the coordinates
		const oddRow = r % 2;
		return directions.map(([dq, dr]) => [q + dq + (oddRow ? 0 : dr < 0 ? -1 : 0), r + dr]);
	}

	// Breadth-first search to find valid paths
	function findPath(start: [number, number], end: [number, number], maxSteps: number = 3): boolean {
		const queue: Array<{ pos: [number, number]; steps: number }> = [{ pos: start, steps: 0 }];
		const visited = new Set<string>();

		while (queue.length > 0) {
			const current = queue.shift()!;
			const [currentQ, currentR] = current.pos;
			const key = `${currentQ},${currentR}`;

			if (visited.has(key)) continue;
			visited.add(key);

			// Found the target
			if (currentQ === end[0] && currentR === end[1]) {
				return true;
			}

			// Don't explore further if we've reached max steps
			if (current.steps >= maxSteps) continue;

			// Get all valid neighbors
			const neighbors = getNeighbors(currentQ, currentR);
			for (const neighbor of neighbors) {
				const [nq, nr] = neighbor;

				// Find the tile in boardData
				const neighborTile = boardData.find((t) => t.q === nq && t.r === nr);

				// Skip if the neighbor is a wall or doesn't exist
				if (!neighborTile || neighborTile.color === 'black') continue;

				queue.push({
					pos: [nq, nr],
					steps: current.steps + 1
				});
			}
		}

		return false;
	}

	// Update the isValidMove function
	function isValidMove(from: [number, number], to: [number, number]): boolean {
		// Check if the target tile is valid
		if (tile.color === 'black') return false;

		// Check if the move is within range and has a valid path
		return findPath(from, to, 3);
	}

	function handleTileClick() {
		if (!$selectedPawn) return;

		const targetPos: [number, number] = [tile.q, tile.r];

		// Don't allow moving to the same position
		if ($selectedPawn.position[0] === targetPos[0] && $selectedPawn.position[1] === targetPos[1]) {
			return;
		}

		// Check if the move is valid
		if (isValidMove($selectedPawn.position, targetPos)) {
			pawns.update((pawns) =>
				pawns.map((p) => (p.id === $selectedPawn.id ? { ...p, position: targetPos } : p))
			);

			selectedPawn.set(null);
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
			stroke-width: 1.5;
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
