<script>
	import Board from '../components/game/Board.svelte';
	import Navbar from '../components/common/Navbar.svelte';
</script>

<Navbar />
<Board />

<style>
	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		line-height: 1.6;
	}
</style>
