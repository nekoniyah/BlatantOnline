<!-- src/components/Navbar.svelte -->
<!--
  @component Navbar
  @description The main navigation component for the application.
  Features a responsive design with a hamburger menu for mobile views.
  Includes branding elements and navigation links to main sections of the app.
-->
<script lang="ts">
	// State for mobile menu visibility
	let isMenuOpen = false;

	/**
	 * Toggles the mobile menu visibility state
	 */
	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};

	// Navigation link configuration
	const navLinks = [
		{ href: '/', text: 'Home' },
		{ href: '/game', text: 'Play Game' },
		{ href: '/rules', text: 'Rules' },
		{ href: '/profile', text: 'Profile' }
	];
</script>

<nav class="navbar">
	<!-- Brand section with logo and name -->
	<div class="navbar-brand">
		<img src="/favicon.png" alt="Logo" class="logo" />
		<span class="brand-name">Blatant Online</span>
	</div>

	<!-- Hamburger menu button for mobile views -->
	<button class="menu-button" on:click={toggleMenu} aria-label="Toggle menu">
		<span class="hamburger" class:active={isMenuOpen}></span>
	</button>

	<!-- Navigation links - toggleable on mobile -->
	<div class="nav-links" class:active={isMenuOpen}>
		{#each navLinks as link}
			<a href={link.href} class="nav-link">{link.text}</a>
		{/each}
	</div>
</nav>

<style lang="scss">
	/* Global reset for the navigation context */
	:global(html, body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
	}

	/* Main navbar container */
	.navbar {
		height: 70px;
		width: 100%;
		background-color: var(--color-tertiary);
		color: var(--color-main);
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: relative;
		border-bottom: 2px solid var(--color-secondary-gold);
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
	}

	/* Brand section styling */
	.navbar-brand {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.logo {
		width: 50px;
		height: 50px;
		filter: drop-shadow(0 0 4px var(--color-secondary-gold));
	}

	.brand-name {
		font-size: 1.5rem;
		font-weight: bold;
		color: var(--color-secondary-gold);
		text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
	}

	/* Navigation links container */
	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	/* Individual navigation link styling */
	.nav-link {
		color: var(--color-main);
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		transition: all 0.2s ease;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			left: 50%;
			width: 0;
			height: 2px;
			background-color: var(--color-secondary-gold);
			transition: all 0.2s ease;
			transform: translateX(-50%);
		}

		&:hover {
			color: var(--color-secondary-gold);
			background-color: rgba(255, 215, 0, 0.1);

			&::after {
				width: 80%;
			}
		}
	}

	/* Mobile menu button styling */
	.menu-button {
		display: none;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
	}

	/* Hamburger icon animation */
	.hamburger {
		display: block;
		width: 24px;
		height: 2px;
		background-color: var(--color-main);
		position: relative;
		transition: all 0.3s ease;

		&::before,
		&::after {
			content: '';
			position: absolute;
			width: 24px;
			height: 2px;
			background-color: var(--color-main);
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

	/* Responsive design for mobile devices */
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
			background-color: var(--color-tertiary);
			padding: 1rem;
			gap: 1rem;
			border-bottom: 2px solid var(--color-secondary-gold);
			box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

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
