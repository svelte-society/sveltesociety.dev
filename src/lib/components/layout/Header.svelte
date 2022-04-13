<script lang="ts">
	import Link from './Link.svelte';

	import { page } from '$app/stores';
	const linksLeft = [
		['/templates', 'templates'],
		['/components', 'components'],
		['/tools', 'tools']
	];
	const linksRight = [
		['/recipes', 'recipes'],
		['/events', 'events'],
		['/resources', 'resources']
	];
</script>

<header>
	<div class="container">
		<nav>
			<ul>
				{#each linksLeft as [path, name]}
					<Link
						{path}
						active={path === '/' ? $page.url.pathname === '/' : $page.url.pathname.includes(path)}
					>
						{name}
					</Link>
				{/each}
				<li>
					<a href="/" class="logo">
						<img alt="Svelte Society Logo" src="/images/logo.svg" />
					</a>
				</li>
				{#each linksRight as [path, name]}
					<Link
						{path}
						active={path === '/' ? $page.url.pathname === '/' : $page.url.pathname.includes(path)}
					>
						{name}
					</Link>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	header {
		background: var(--accent-color);
		color: var(--header-text-color);
		padding: var(--s-6) var(--s-4);
	}
	nav {
		padding: 2rem 0;
	}
	ul {
		display: grid;
		gap: var(--s-6);
		justify-content: center;
		place-items: center;
		font-weight: 800;
	}
	li {
		position: absolute;
		right: var(--s-4);
		top: var(--s-4);
	}
	img {
		width: var(--s-12);
		height: var(--s-12);
	}
	.logo {
		border-bottom: none;
	}
	@media (min-width: 1280px) {
		ul {
			display: flex;
			justify-content: space-between;
		}
		li {
			display: flex;
			position: relative;
			inset: 0;
			align-items: center;
		}
		img {
			width: var(--s-32);
			height: var(--s-32);
		}
	}
	@media print {
		header {
			display: none;
		}
	}
</style>
