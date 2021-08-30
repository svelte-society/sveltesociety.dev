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

<header class="bg-basics-100 py-6 px-4">
	<div class="container mx-auto">
		<nav class="py-8">
			<ul class="grid gap-6 justify-center place-items-center font-bold xl:flex">
				{#each linksLeft as [path, name]}
					<Link {path} active={path === '/' ? $page.path === '/' : $page.path.includes(path)}
						>{name}</Link
					>
				{/each}
				<li class="absolute right-4 top-4 xl:flex xl:relative xl:-inset-0 xl:items-center">
					<a href="/">
						<img
							alt="Svelte Society Logo"
							src="/images/logo.svg"
							class="w-12 h-12 xl:w-32 xl:h-32"
						/>
					</a>
				</li>
				{#each linksRight as [path, name]}
					<Link {path} active={path === '/' ? $page.path === '/' : $page.path.includes(path)}
						>{name}</Link
					>
				{/each}
			</ul>
		</nav>
	</div>
</header>

<style>
	nav {
		padding: 2rem 0;
	}
	header {
		background: var(--accent-color);
		color: var(--header-text-color);
		padding: 1.5rem 1rem;
	}
	@media (min-width: 1280px) {
	}
	@media print {
		header {
			display: none;
		}
	}
</style>
