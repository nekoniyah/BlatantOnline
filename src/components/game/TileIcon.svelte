<script lang="ts">
	import type { HexTile } from '../../types/game';

	export let hex: HexTile;
</script>

{#if hex.icon === '⚡'}
	<g class="bolt">
		<image href="/bolt.svg" x="-15" y="-15" width="30" height="30" />
	</g>
{:else if hex.icon === '🎲'}
	<g transform="translate(0, 0)" class="draw">
		<image href="/draw.svg" x="-15" y="-15" width="30" height="30" />
	</g>
{:else if hex.icon === '⚡⚡'}
	<g transform="translate(-20, -10)" class="bolts">
		<g>
			<image href="/bolt2.svg" width="25" height="25" />
		</g>
		<g transform="translate(20, 0)">
			<image href="/bolt2.svg" width="25" height="25" />
		</g>
	</g>
{/if}
