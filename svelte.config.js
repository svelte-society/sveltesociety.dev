import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

const extensions = [`.svelte`, '.md', `.mdx`, '.svx'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			"postcss": true
		}),
		mdsvex({
			extensions: extensions,
			layout: {
				eventPage: './src/lib/layouts/EventPage.svelte',
				recipe: './src/lib/layouts/Recipe.svelte',
				recipeCategory: './src/lib/layouts/RecipeCategory.svelte'
			}
		})
	],
	extensions: extensions,
	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			optimizeDeps: {
				// workaround Vite issue to fix highlighting on cheatsheet
				// https://github.com/metonym/svelte-highlight/issues/158
				include: ["highlight.js/lib/core"],
			}
		}
	}
};

export default config;
