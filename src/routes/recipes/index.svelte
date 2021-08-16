<script>
	import CategoryTree from '$lib/components/recipes/CategoryTree.svelte';
	import Icon from '$lib/components/Icon/index.svelte';
	import { page } from '$app/stores';
	import { categories } from '$lib/stores/recipes';
</script>

<div class="content-wrap">
	<div class="my-1">
		<h1 class="text-5xl mt-6 mb-4">Cookbook</h1>
		<p class="intro">
			This cookbook serves shows users how best-in-practice code is written in Svelte. You’ll learn
			how to import third-party libraries, external scripts as well as how to handle common problems
			that you will have to solve often.
		</p>
	</div>
</div>
<section class="recipes-block">
	<div class="navigation-block my-1">
		<div class="navigation-content">
			<h3>Pick a Category to Get Started</h3>
			<div class="categories-wrap">
				{#each $categories as category}
					{#if category}
						<div class="category-style">
							<div class="list-meta">
								<div class="icon-circle">
									<Icon name={category.meta.icon} width="1.5em" height="1.5em" />
								</div>
								<a href={category.path} class="list-title">{category.meta.title}</a>
							</div>
							<CategoryTree currentPath={page.path} nodes={category.children} />
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
</section>

<div class="content-wrap">
	<div class="my-1">
		<h3>What can I expect from these recipes?</h3>
		<p>
			The Svelte compiler expects all components it receives to be valid Svelte syntax. To use
			compile-to-js or compile-to-css languages, you need to make sure that any non-standard syntax
			is transformed before Svelte tries to parse it. To enable this Svelte provides a preprocess
			method allowing you to transform different parts of the component before it reaches the
			compiler. With <b>svelte.preprocess</b> you have a great deal of flexibility in how you write your
			components while ensuring that the Svelte compiler receives a plain component.
		</p>
	</div>
	<div class="signup-block my-1">
		<h3>Do you want to write a recipe?</h3>
		<p>
			We’re looking for new recipes and recipe authors. Are you interested? Just submit a issue with
			a recipe below!
		</p>
		<a href="https://github.com/svelte-society/sveltesociety.dev/issues/new" class="button"
			>Submit</a
		>
	</div>
	<div class="my-1">
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
	</div>
</div>

<style>
	.icon-circle {
		border: 2px solid black;
		border-radius: 50%;
		height: 2em;
		width: 2em;
		display: grid;
		place-items: center;
		padding-left: 4px;
	}
	.content-wrap {
		align-items: center;
		width: 65ch;
		margin: 0 auto;
	}
	.navigation-block {
		padding: 1rem;
	}
	.navigation-content h3 {
		display: flex;
		justify-content: center;
	}
	.categories-wrap {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		flex-wrap: wrap;
		padding: 1rem;
	}
	@media screen and (max-width: 1024px) {
		.categories-wrap {
			grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		}
	}
	@media screen and (max-width: 600px) {
		.categories-wrap {

			grid-template-columns: 1fr
		}
	}
	.category-style {
		padding: 1rem;
	}
	@media screen and (max-width: 1200px) {
		.category-style {
			width: 100%;
		}
		.content-wrap,
		.content-wrap {
			width: inherit;
			padding: 0 1rem;
		}
	}
	.signup-block {
		background: #ecf6ff;
		padding: 1rem;
	}
	a.button {
		text-decoration: none;
		display: block;
		margin: 0;
		border-radius: var(--border-radius);
		display: inline-block;
		font-size: medium;
		font-weight: bold;
		margin: 1.5rem 0 0.5rem 0;
		padding: 1rem 2rem;
		background-color: var(--color-secondary);
		border: 2px solid var(--color-secondary);
		color: var(--color-bg);
	}

	a.button:hover {
		cursor: pointer;
		filter: brightness(var(--hover-brightness));
	}
	.recipes-block {
		background: #f3f6f9;
	}
	.list-meta {
		align-items: center;
		display: grid;
		grid-template-columns: 50px auto;
	}
	.list-title {
		color: var(--svelte-grey);
		margin-left: 1rem;
		text-decoration: none;
		text-transform: uppercase;
		font-family: Georgia, 'Times New Roman', Times, serif;
	}
	.list-title:hover {
		text-decoration: underline;
	}
</style>
