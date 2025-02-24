<!-- src/components/Navbar.svelte -->
<script lang="ts">
	let isMenuOpen = false;

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};

	const navLinks = [
		{ href: '/', text: 'Home' },
		{ href: '/game', text: 'Play Game' },
		{ href: '/rules', text: 'Rules' },
		{ href: '/profile', text: 'Profile' }
	];
</script>

<nav class="navbar">
	<div class="navbar-brand">
		<img src="/favicon.png" alt="Logo" class="logo" />
		<span class="brand-name">Blatant Online</span>
	</div>

	<!-- Hamburger menu for mobile -->
	<button class="menu-button" on:click={toggleMenu} aria-label="Toggle menu">
		<span class="hamburger" class:active={isMenuOpen}></span>
	</button>

	<!-- Navigation links -->
	<div class="nav-links" class:active={isMenuOpen}>
		{#each navLinks as link}
			<a href={link.href} class="nav-link">{link.text}</a>
		{/each}
	</div>
</nav>

<style lang="scss">
	:global(html, body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	.navbar {
		height: 70px;
		width: 100%;
		background-color: #2a2a2a;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: relative;
	}

	.navbar-brand {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		width: 50px;
		height: 50px;
	}

	.brand-name {
		font-size: 1.5rem;
		font-weight: bold;
		color: #fbfbfb;
		font-family: sans-serif;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-link {
		color: white;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: rgba(255, 255, 255, 0.1);
		}
	}

	.menu-button {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
	}

	.hamburger {
		display: block;
		width: 24px;
		height: 2px;
		background-color: white;
		position: relative;
		transition: all 0.3s ease;

		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 24px;
			height: 2px;
			background-color: white;
			transition: all 0.3s ease;
		}

		&::before {
			transform: translateY(-8px);
		}

		&::after {
			transform: translateY(8px);
		}

		&.active {
			background-color: transparent;

			&::before {
				transform: rotate(45deg);
			}

			&::after {
				transform: rotate(-45deg);
			}
		}
	}

	// Responsive design
	@media (max-width: 768px) {
		.menu-button {
			display: block;
		}

		.nav-links {
			display: none;
			position: absolute;
			top: 100%;
			left: 0;
			right: 0;
			flex-direction: column;
			background-color: #2a2a2a;
			padding: 1rem;
			gap: 1rem;

			&.active {
				display: flex;
			}
		}

		.nav-link {
			width: 100%;
			text-align: center;
		}
	}
</style>
