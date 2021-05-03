<script lang="ts">
	import Link from './Link.svelte';

	import { page } from '$app/stores';
	const linksLeft = [
		['/', 'home'],
		['/recipes', 'recipes'],
		['/components', 'components']
	];
	const linksRight = [
		['/cheatsheet', 'cheat sheet'],
		['/events', 'events'],
		['/about', 'about']
	];
</script>

<div class="shaded" id="title">
	<header class="wrapper">
		<nav>
			<ul>
				{#each linksLeft as [path, name]}
					<Link {path} active={path === '/' ? $page.path === '/' : $page.path.includes(path)}
						>{name}</Link
					>
				{/each}
			</ul>
			<div class="logo">
				<a href="/"> <img alt="Svelte Society Logo" src="/images/logo.svg" /> </a>
			</div>
			<ul>
				{#each linksRight as [path, name]}
					<Link {path} active={path === '/' ? $page.path === '/' : $page.path.includes(path)}
						>{name}</Link
					>
				{/each}
			</ul>
		</nav>
	</header>
</div>

<style>
	.shaded {
		max-width: 100%;
		background: #f3f6f9;
		margin-bottom: calc(var(--space-600) * 2);
	}

	nav {
		display: grid;
		grid-gap: var(--space-600);
		grid-template-columns: auto auto auto;
		justify-content: center;
		place-items: center;
		font-weight: bold;
	}

	ul {
		list-style: none;
		padding: 0;
	}

	header {
		padding: var(--space-600) 1rem;
	}

	@media screen and (max-width: 920px) {
		nav {
			grid-template-columns: auto;
		}
	}
	.logo {
		display: flex;
		align-items: center;
	}

	img {
		width: 120px;
		height: 120px;
	}

	@media print {
		.shaded {
			display: none;
		}
	}
</style>
