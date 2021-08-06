<script lang="ts">
	import Link from './Link.svelte';

	import { page } from '$app/stores';
	const linksLeft = [
		['/templates', 'templates'],
		['/components', 'components'],
		['/tooling', 'tooling']
	];
	const linksRight = [
		['/recipes', 'recipes'],
		['/cheatsheet', 'cheat sheet'],
		['/events', 'events']
	];
</script>

<div class="shaded" id="title">
	<header class="container mx-auto">
		<nav class="pt-8 pb-8">
			<ul>
				{#each linksLeft as [path, name]}
					<Link {path} active={path === '/' ? $page.path === '/' : $page.path.includes(path)}
						>{name}</Link
					>
				{/each}
				<li class="logo">
					<a href="/"> <img alt="Svelte Society Logo" src="/images/logo.svg" /> </a>
				</li>
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

	ul {
		list-style: none;
		padding: 0;
		display: grid;
		grid-gap: var(--space-600);
		grid-template-columns: repeat(3, 1fr) auto repeat(3, 1fr);
		justify-content: center;
		place-items: center;
		font-weight: bold;
	}

	header {
		padding: var(--space-600) 1rem;
	}

	@media screen and (max-width: 1280px) {
		ul {
			grid-template-columns: auto;
		}
		.logo {
			position: absolute;
			right: 0;
			top: 0;
			width: 3rem;
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
