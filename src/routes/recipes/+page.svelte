<script lang="ts">
	import CategoryTree from '$lib/components/recipes/CategoryTree.svelte';
	import Icon from '$lib/components/Icon/index.svelte';
	import { page } from '$app/stores';
	import { categories } from '$lib/stores/recipes';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Recipes"
	description="This cookbook serves shows users how best-in-practice code is written in Svelte. You’ll learn how to import third-party libraries, external scripts as well as how to handle common problems that you will have to solve often."
/>

<article>
	<h1>Cheat Sheet</h1>

	<div>
		Check out <a href="/cheatsheet">the Cheat Sheet</a> to get a quick rundown of common Svelte features.
	</div>

	<h1>Cookbook</h1>

	<section class="categories">
		<div class="intro">
			<h2>Pick a Category to Get Started</h2>
			<p>
				This cookbook serves shows users how best-in-practice code is written in Svelte. You’ll
				learn how to import third-party libraries, external scripts as well as how to handle common
				problems that you will have to solve often.
			</p>
		</div>
		<div class="category-wrapper">
			{#each $categories as category}
				{#if category}
					<section class="category">
						<h3>
							<Icon name={category.icon} width="50px" height="50px" />

							<a href={category.path} class="list-title">{category.title}</a>
						</h3>
						<div class="category-list">
							<CategoryTree currentPath={$page.url.pathname} nodes={category.children} />
						</div>
					</section>
				{/if}
			{/each}
		</div>
	</section>
	<section class="bottom-wrapper">
		<section>
			<h3>What can I expect from these recipes?</h3>
			<p>
				The Svelte compiler expects all components it receives to be valid Svelte syntax. To use
				compile-to-js or compile-to-css languages, you need to make sure that any non-standard
				syntax is transformed before Svelte tries to parse it. To enable this Svelte provides a
				preprocess method allowing you to transform different parts of the component before it
				reaches the compiler. With <b>svelte.preprocess</b> you have a great deal of flexibility in how
				you write your components while ensuring that the Svelte compiler receives a plain component.
			</p>
		</section>
		<section>
			<h3>Where to get started</h3>
			<p>
				If you want the quickest way to get started, clone <a
					href="https://github.com/sveltejs/template">the Official Svelte App template</a
				>. If you want a custom setup, head to the
				<a href="/recipes/build-setup">Build Setup recipes</a>.
			</p>
			<p>
				If you are writing a Svelte component library, check the <a
					href="https://github.com/sveltejs/component-template"
					>the Official Svelte Component template</a
				>.
			</p>
		</section>
		<section class="recipe">
			<h3>Do you want to write a recipe?</h3>
			<p>
				We’re looking for new recipes and recipe authors. Are you interested? Just submit a issue
				with a recipe below!
			</p>
			<a href="https://github.com/svelte-society/sveltesociety.dev/issues/new" class="button">
				Submit
			</a>
		</section>
	</section>
</article>

<style>
	article {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
	}
	.intro {
		max-width: 80ch;
		margin-inline: auto;
	}
	.categories {
		background: var(--white);
		padding: var(--s-2);
	}

	.category-wrapper {
		margin-top: var(--s-10);
		display: grid;
		gap: var(--s-12);
		grid-template-columns: minmax(0, 1fr);
	}
	.category {
		background-color: var(--gray);
		border-radius: var(--s-2);
		box-shadow: var(--shadow-short);
		padding-inline: var(--s-4);
	}

	h3 {
		display: flex;
		align-items: center;
	}

	a.button {
		text-decoration: none;
		display: block;
		border-radius: var(--border-radius);
		display: inline-block;
		font-size: medium;
		font-weight: bold;
		padding: var(--s-4) var(--s-6);
		border-radius: var(--s-1);
		background-color: var(--orange);
		color: var(--white);
		box-shadow: var(--shadow-short);
		transition: all 0.2s ease-out;
	}

	a.button:hover {
		cursor: pointer;
		filter: brightness(1.1);
		box-shadow: var(--shadow-diffuse);
	}
	a.button:active {
		position: relative;
		top: 1px;
		box-shadow: 0 0 0 2px var(--accent);
	}
	.list-title {
		color: var(--black);
		margin-left: 1rem;
		text-decoration: none;
		text-transform: uppercase;
		position: relative;
		top: 4px;
	}

	.list-title::before {
		content: '';
		background: var(--black);
		opacity: 0.8;
		height: 0px;
		width: 100%;
		position: absolute;
		bottom: 5px;
		transition: height 0.05s ease;
	}

	.list-title:hover::before {
		height: 5px;
	}

	.bottom-wrapper {
		max-width: 80ch;
		margin-inline: auto;
	}

	.recipe {
		margin-top: var(--s-10);
		margin-inline: auto;
		background-color: var(--white);
		border-radius: var(--s-2);
		padding: var(--s-10);
		display: grid;
		gap: var(--s-4);
		justify-items: flex-start;
	}
	.recipe h3 {
		margin: 0;
	}

	@media (min-width: 1280px) {
		.category-wrapper {
			grid-template-columns: 1fr 1fr;
		}
		.categories {
			padding: var(--s-4) var(--s-10) var(--s-10);
		}
		.category-list {
			padding: var(--s-2) var(--s-4) var(--s-4) 3.8rem;
		}
		.recipe {
			padding: var(--s-20);
		}
	}
</style>
