<script>
	import { page } from '$app/stores';
	import metatags from '$lib/stores/metatags';
	import metatagImage from './metatag.png';

	metatags.title('Svelte Society - a community for Svelte users around the world.');
	metatags.desc('Svelte Society is a community-driven effort to organise and promote SvelteJS.');
	metatags.image(metatagImage);
	metatags.url($page.host + $page.path);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
