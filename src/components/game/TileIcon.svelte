<script lang="ts">
	import type { HexTile } from '../../types/game';

	export let hex: HexTile;
</script>

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
