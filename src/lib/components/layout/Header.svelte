<script lang="ts">
	import Link from './Link.svelte';
	import { page } from '$app/stores';
	import Logo from '../../../assets/logo.svg';

	const links = [
		['/packages', 'Packages'],
		['/templates', 'Templates'],
		['/resources', 'Resources'],
		['/recipes', 'Recipes'],
		['/events', 'Events']
	];
	// const linksLeft = [
	// 	['/packages', 'packages'],
	// 	['/templates', 'templates']
	// ];

	// const linksRight = [
	// 	['/resources', 'resources'],
	// 	['/recipes', 'recipes'],
	// 	['/events', 'events']
	// ];
</script>

<header class="px-6 py-4 print:hidden">
	<div class="mx-auto w-full max-w-7xl">
		<nav class="flex items-center gap-12 py-6">
			<a href="/" class="self-start border-none">
				<img alt="Svelte Society Logo" src={Logo} class="w-20 lg:w-36" />
			</a>

			<ul class="grid w-full gap-6 font-extrabold lg:flex lg:items-center lg:justify-around">
				{#each links as [path, name]}
					<li>
						<Link
							{path}
							active={path === '/' ? $page.url.pathname === '/' : $page.url.pathname.includes(path)}
						>
							{name}
						</Link>
					</li>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	header {
		border-top: 6px solid var(--primary);
		background: var(--accent-color);
		color: var(--header-text-color);
	}
</style>
