<script lang="ts">
	import Link from './Link.svelte';
	import { page } from '$app/stores';

	const linksLeft = [
		['/packages', 'packages'],
		['/templates', 'templates']
	];

	const linksRight = [
		['/resources', 'resources'],
		['/recipes', 'recipes'],
		['/events', 'events']
	];
</script>

<header class="px-6 py-4 print:hidden">
	<div class="w-full max-w-7xl mx-auto">
		<nav class="py-6">
			<ul
				class="xl:flex xl:justify-between grid gap-6 justify-center place-items-center font-extrabold"
			>
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
</style>
