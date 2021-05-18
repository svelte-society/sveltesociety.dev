import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

const extensions = [`.svelte`, '.md', `.mdx`, '.svx'];

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess(),
		mdsvex({
			extensions: extensions,
			layout: { eventPage: './src/lib/layouts/EventPage.svelte' }
		})
	],
	extensions: extensions,
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		hydrate: true,
		prerender: {
			crawl: true,
			enabled: true,
			force: false,
			pages: ['*']
		},
		router: true,
		ssr: true
	}
};

export default config;
