<script lang="ts">
	import { boardData } from '$lib/boardData';
	import { onMount } from 'svelte';

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

<svg class="board" viewBox="-30 -30 500 500">
	{#each boardData as hex}
		{#await hexToPixel(hex.q, hex.r) then { x, y }}
			<g transform="translate({x}, {y})">
				<polygon
					class="hex {hex.color}"
					points={`
			  0,-${hexSize} 
			  ${hexWidth / 2},-${hexSize / 2} 
			  ${hexWidth / 2},${hexSize / 2} 
			  0,${hexSize} 
			  -${hexWidth / 2},${hexSize / 2} 
			  -${hexWidth / 2},-${hexSize / 2}
			`}
				/>
				{#if hex.icon}
					<!-- If there is more than one character, split the string and align the text. Before, wrap the texts.   -->

					{#if hex.icon === '⚡'}
						<g class="bolt">
							<image href="/bolt.svg" x="-5" y="-5" width="10" height="10" />
						</g>
					{:else if hex.icon === '🎲'}
						<g transform="translate(0, 0)" class="draw">
							<image href="/draw.svg" x="-5" y="-5" width="10" height="10" />
						</g>
					{:else if hex.icon === '⚡⚡'}
						<g transform="translate(-7, -4)" class="bolts">
							<g>
								<image href="/bolt2.svg" width="8" height="8" />
							</g>
							<g transform="translate(7, 0)">
								<image href="/bolt2.svg" width="8" height="8" />
							</g>
						</g>
					{/if}
				{/if}
			</g>
		{/await}
	{/each}
</svg>

<style>
	.board {
		width: 90%;
		height: auto;
	}

	.hex {
		stroke: black;
		stroke-width: 1;
		fill: white;
		transition: fill 0.3s;
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

	.icon {
		font-size: 10px;
		font-family: sans-serif;
		fill: black;
		pointer-events: none;
		-webkit-user-select: none;
		user-select: none;
	}
</style>
